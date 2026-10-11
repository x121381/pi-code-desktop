import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getAppConfigDir } from "../paths.js";
import { isEffectiveDevelopmentNodeEnv } from "../runtime-tools/nodeEnv.js";
export function isZCodeStdioTapDevVisible() {
    return isEffectiveDevelopmentNodeEnv();
}
export function getZCodeStdioTapDevDir() {
    return join(getAppConfigDir(), "dev");
}
export function getZCodeStdioTapDevLogDir() {
    return join(getZCodeStdioTapDevDir(), "stdio-traffic");
}
export function getZCodeStdioTapDevStatePath() {
    return join(getZCodeStdioTapDevDir(), "zcode-stdio-tap.json");
}
function readStateFile(path) {
    if (!existsSync(path)) {
        return {};
    }
    try {
        const parsed = JSON.parse(readFileSync(path, "utf-8"));
        return parsed && typeof parsed === "object" ? parsed : {};
    }
    catch {
        return {};
    }
}
export function readZCodeStdioTapDevState() {
    const visible = isZCodeStdioTapDevVisible();
    const statePath = getZCodeStdioTapDevStatePath();
    const fileState = readStateFile(statePath);
    return {
        enabled: visible && fileState.enabled === true,
        visible,
        logDir: getZCodeStdioTapDevLogDir(),
        statePath,
    };
}
export function setZCodeStdioTapDevEnabled(enabled) {
    const visible = isZCodeStdioTapDevVisible();
    const statePath = getZCodeStdioTapDevStatePath();
    mkdirSync(getZCodeStdioTapDevDir(), { recursive: true });
    writeFileSync(statePath, `${JSON.stringify({
        // 开发态 stdio 抓包是高频原始协议帧，只能通过显式开关写旁路文件，避免误进生产日志。
        enabled: visible && enabled,
        updatedAt: new Date().toISOString(),
    }, null, 2)}\n`);
    return readZCodeStdioTapDevState();
}
//# sourceMappingURL=zcodeStdioTapDevConfig.js.map