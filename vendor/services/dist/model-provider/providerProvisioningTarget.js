/* eslint-disable max-lines -- Provisioning target keeps transaction and rollback invariants together. */
import { readFile } from "node:fs/promises";
import { atomicWritePrivateTextFile, withFileLock } from "@zcode/shared/node";
import {} from "@zcode/provider";
import { decodeProviderConfigFile, encodeProviderConfigFile } from "@zcode/provider-node";
import { providerProvisioningEnvelopeSchema, providerProvisioningResultSchema, isProviderProvisioningAccountCredentialKey, } from "@zcode/shared";
import { PROVIDER_PROVISIONING_OAUTH_CREDENTIAL_KEYS, readProvisionablePersonalConfig, } from "./providerProvisioningSource.js";
const PROVISIONING_SCHEMA_VERSION = 1;
const OAUTH_CREDENTIAL_KEYS = new Set(PROVIDER_PROVISIONING_OAUTH_CREDENTIAL_KEYS);
/** 运行在目标 Environment 内的 Provisioning target；负责写正式 Store 并在失败时回滚。 */
export function createProviderProvisioningTarget(options) {
    return {
        async apply(input) {
            const envelope = providerProvisioningEnvelopeSchema.parse(input);
            return withFileLock(options.stateFilePath, async () => {
                const previousState = await readStateFile(options.stateFilePath);
                const previousResult = previousState?.records.find((record) => record.syncId === envelope.syncId);
                if (previousResult) {
                    return {
                        ...previousResult.result,
                        status: "already-applied",
                    };
                }
                validateCredentialEntries(envelope);
                // schema v1 接受旧 Source 的账号 Key 字段，但新 Host 不再读取或应用它。
                // 旧/手工 Key 留在原 Store，避免升级同步误删其它客户端共享的凭据。
                const oauthCredentials = envelope.credentials.filter((entry) => entry.scope === "oauth-session");
                await options.providerRuntime.start();
                const before = await captureBeforeState(envelope, options);
                const personalUpdate = parsePersonalConfig(envelope);
                const applied = {
                    settings: false,
                    settingsExpected: envelope.accountSettings,
                    credentials: [],
                    personalConfig: false,
                    personalConfigExpected: personalUpdate,
                };
                let errorCode = "target-write-failed";
                try {
                    // 先登记再写入：底层原子写即使在替换完成后才抛错，也必须进入回滚集合。
                    applied.settings = true;
                    await options.settingService.update({
                        providerFamilyDomain: envelope.accountSettings.providerFamilyDomain ?? undefined,
                        providerFamilyConnectionSelections: envelope.accountSettings.providerFamilyConnectionSelections,
                    });
                    const incomingCredentials = new Map(oauthCredentials.map((credential) => [credential.key, credential.value]));
                    for (const key of before.credentials.keys()) {
                        const value = incomingCredentials.get(key);
                        applied.credentials.push({ key, value: value ?? null });
                        if (value === undefined)
                            await options.credentialService.delete(key);
                        else
                            await options.credentialService.save(key, value);
                    }
                    applied.personalConfig = true;
                    await options.personalRepository.update((current) => {
                        // 其他域写入期间 Personal 可能已被编辑；检查与替换必须在同一个文件锁内。
                        if (!samePersonalConfig(current, before.personal)) {
                            throw new Error("Personal Provider Config 在同步期间被其它操作修改");
                        }
                        return personalUpdate;
                    });
                    errorCode = "target-refresh-failed";
                    await options.accountProviderSource.refresh("provider-provisioning");
                    const snapshot = await options.providerRuntime.registryService.refresh("provider-provisioning");
                    // 失效默认只是新会话偏好；把它当同步硬条件会让正常 SSH 被旧模型/档位阻断。
                    // 原样保留偏好，由 Host 现有推荐逻辑解析；真实写入/刷新失败仍按事务回滚。
                    const result = {
                        syncId: envelope.syncId,
                        status: "applied",
                        personalProviderCount: personalUpdate.providers.keys().length,
                        credentialCount: oauthCredentials.length,
                        configRevision: snapshot.sourceRevisions.config,
                        rolledBack: false,
                    };
                    errorCode = "target-commit-failed";
                    await writeStateFile(options.stateFilePath, appendStateRecord(previousState, result));
                    return result;
                }
                catch (error) {
                    // 回滚前对每个 domain 做 CAS 式校验；若期间已有其它写入，宁可报告
                    // rollback_failed，也不能用过期快照覆盖或删除用户的新配置。
                    const rollbackError = await rollback(before, applied, options);
                    if (rollbackError) {
                        return {
                            syncId: envelope.syncId,
                            status: "rollback_failed",
                            personalProviderCount: before.personal.providers.keys().length,
                            credentialCount: oauthCredentials.length,
                            errorMessage: `${formatError(error)}；回滚失败：${formatError(rollbackError)}`,
                            errorCode,
                            rolledBack: false,
                        };
                    }
                    return {
                        syncId: envelope.syncId,
                        status: "failed",
                        personalProviderCount: before.personal.providers.keys().length,
                        credentialCount: oauthCredentials.length,
                        errorMessage: formatError(error),
                        errorCode,
                        rolledBack: true,
                    };
                }
            });
        },
    };
}
function parsePersonalConfig(envelope) {
    // 信封与本地保存复用正式 Personal codec，不在接收端另建字段清单或模式判断。
    return decodeProviderConfigFile({ schemaVersion: 1, config: envelope.personalConfig });
}
async function captureBeforeState(envelope, options) {
    const [personal, settings] = await Promise.all([
        readProvisionablePersonalConfig(options.personalRepository, options.personalConfigFilePath),
        options.settingService.get(),
    ]);
    const credentials = new Map();
    const credentialKeys = new Set([
        ...OAUTH_CREDENTIAL_KEYS,
        ...((await options.listProvisioningCredentialKeys?.()) ?? []),
        ...envelope.credentials.map((entry) => entry.key),
    ]);
    for (const key of credentialKeys) {
        if (!OAUTH_CREDENTIAL_KEYS.has(key)) {
            continue;
        }
        credentials.set(key, await options.credentialService.load(key));
    }
    return {
        personal,
        settings,
        credentials,
    };
}
async function rollback(before, applied, options) {
    const errors = [];
    if (applied.personalConfig) {
        try {
            await options.personalRepository.update((current) => {
                if (samePersonalConfig(current, before.personal))
                    return current;
                if (!samePersonalConfig(current, applied.personalConfigExpected)) {
                    throw new Error("Personal Provider Config 在同步期间被其它操作修改，跳过回滚");
                }
                // 默认选择与 Provider/Model 共用一份 CAS；不能分别回滚制造混合状态或覆盖新选择。
                return before.personal;
            });
        }
        catch (error) {
            errors.push(error);
        }
    }
    for (const { key, value } of applied.credentials) {
        try {
            const previous = before.credentials.get(key) ?? null;
            const current = await options.credentialService.load(key);
            if (current === previous) {
                continue;
            }
            if (current !== value) {
                errors.push(new Error(`Credential ${key} 在同步期间被其它操作修改，跳过回滚`));
                continue;
            }
            if (previous === null) {
                await options.credentialService.delete(key);
            }
            else {
                await options.credentialService.save(key, previous);
            }
        }
        catch (error) {
            errors.push(error);
        }
    }
    if (applied.settings) {
        try {
            const current = await options.settingService.get();
            const previousSettings = toProvisioningAccountSettings(before.settings);
            if (sameAccountSettings(current, previousSettings)) {
                // 写入失败发生在落盘前，目标已经处于回滚前的状态。
            }
            else if (!sameAccountSettings(current, applied.settingsExpected)) {
                errors.push(new Error("Account Settings 在同步期间被其它操作修改，跳过回滚"));
            }
            else {
                await options.settingService.update({
                    providerFamilyDomain: before.settings.providerFamilyDomain,
                    providerFamilyConnectionSelections: before.settings.providerFamilyConnectionSelections,
                });
            }
        }
        catch (error) {
            errors.push(error);
        }
    }
    if (errors.length > 0) {
        return new Error(errors.map(formatError).join("；"));
    }
    try {
        await options.accountProviderSource.refresh("provider-provisioning-rollback");
        await options.providerRuntime.registryService.refresh("provider-provisioning-rollback");
    }
    catch (error) {
        return error instanceof Error ? error : new Error(String(error));
    }
    return undefined;
}
function samePersonalConfig(left, right) {
    return (JSON.stringify(encodeProviderConfigFile(left)) ===
        JSON.stringify(encodeProviderConfigFile(right)));
}
function toProvisioningAccountSettings(settings) {
    return {
        providerFamilyDomain: settings.providerFamilyDomain ?? null,
        providerFamilyConnectionSelections: settings.providerFamilyConnectionSelections ?? {},
    };
}
function sameAccountSettings(current, expected) {
    return JSON.stringify(toProvisioningAccountSettings(current)) === JSON.stringify(expected);
}
function validateCredentialEntries(envelope) {
    const seen = new Set();
    for (const entry of envelope.credentials) {
        if (seen.has(entry.key))
            throw new Error(`重复 Provisioning Credential key: ${entry.key}`);
        seen.add(entry.key);
        const allowed = (entry.scope === "oauth-session" && OAUTH_CREDENTIAL_KEYS.has(entry.key)) ||
            (entry.scope === "account-provider" && isProviderProvisioningAccountCredentialKey(entry.key));
        if (!allowed)
            throw new Error(`不允许同步的 Credential key: ${entry.key}`);
    }
}
async function readStateFile(filePath) {
    try {
        const parsed = JSON.parse(await readFile(filePath, "utf8"));
        if (parsed.schemaVersion !== PROVISIONING_SCHEMA_VERSION) {
            return null;
        }
        const rawRecords = Array.isArray(parsed.records)
            ? parsed.records
            : parsed.syncId && parsed.result
                ? [{ syncId: parsed.syncId, result: parsed.result }]
                : [];
        const records = rawRecords.flatMap((record) => {
            if (typeof record !== "object" || record === null)
                return [];
            const candidate = record;
            if (typeof candidate.syncId !== "string" || !candidate.syncId.trim())
                return [];
            const result = providerProvisioningResultSchema.safeParse(candidate.result);
            return result.success ? [{ syncId: candidate.syncId, result: result.data }] : [];
        });
        return { schemaVersion: PROVISIONING_SCHEMA_VERSION, records };
    }
    catch (error) {
        if (isFileNotFound(error))
            return null;
        return null;
    }
}
function appendStateRecord(previousState, result) {
    const records = [
        ...(previousState?.records ?? []).filter((record) => record.syncId !== result.syncId),
        { syncId: result.syncId, result },
    ];
    return {
        schemaVersion: PROVISIONING_SCHEMA_VERSION,
        records,
    };
}
function writeStateFile(filePath, state) {
    return atomicWritePrivateTextFile(filePath, `${JSON.stringify(state, null, 2)}\n`);
}
function isFileNotFound(error) {
    return (typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "ENOENT");
}
function formatError(error) {
    return error instanceof Error ? error.message : String(error);
}
//# sourceMappingURL=providerProvisioningTarget.js.map