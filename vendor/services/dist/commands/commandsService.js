/* eslint-disable max-lines -- commandsService 需要集中处理目录来源优先级、读写和命令解析，拆分会削弱读取顺序的一致性 */
import { access, lstat, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { ZCODE_COMMAND_AGENT_SOURCE, ZCODE_COMMAND_AGENT_SOURCES, } from "@zcode/shared";
import { DEFAULT_ENABLED_OFFICIAL_PLUGIN_IDS } from "@zcode/shared";
import { CommandFileParser } from "./commandFileParser.js";
import { readInstalledPluginRoots } from "#src/plugins/installedPluginRoots.js";
function resolveUserHomeDir() {
    const envHome = process.env.HOME?.trim() || process.env.USERPROFILE?.trim();
    return envHome && envHome.length > 0 ? envHome : homedir();
}
const DEFAULT_COMMAND_AGENT_SOURCE = ZCODE_COMMAND_AGENT_SOURCE;
const COMMAND_AGENT_SOURCE_ORDER = ZCODE_COMMAND_AGENT_SOURCES;
const ENABLE_OVERRIDE_KEY = "enable";
const HOME_PREFIX = "~/";
const ZCODE_OFFICIAL_PLUGIN_MARKETPLACE = "zcode-plugins-official";
const ZCODE_INLINE_PLUGIN_MARKETPLACE = "inline";
const ZCODE_PLUGIN_MANIFEST_PATH = join(".zcode-plugin", "plugin.json");
const CLAUDE_PLUGIN_MANIFEST_PATH = join(".claude-plugin", "plugin.json");
const CODEX_PLUGIN_MANIFEST_PATH = join(".codex-plugin", "plugin.json");
const ZCODE_COMMAND_DESCRIPTOR = {
    agentSource: "zcodeAgent",
    directorySource: "zcode",
    userDirectorySegments: [".zcode", "commands"],
    workspaceDirectorySegments: [".zcode", "commands"],
    fileExtension: ".md",
    format: "markdown",
    namespaceSeparator: "/",
    supportsArgumentHint: true,
};
const COMMAND_AGENT_SOURCE_DESCRIPTORS = {
    zcodeAgent: ZCODE_COMMAND_DESCRIPTOR,
};
const COMMAND_DIRECTORY_SOURCE_DESCRIPTORS = [
    ZCODE_COMMAND_DESCRIPTOR,
    {
        ...ZCODE_COMMAND_DESCRIPTOR,
        directorySource: "agents",
        userDirectorySegments: [".agents", "commands"],
        workspaceDirectorySegments: [".agents", "commands"],
    },
];
function getCommandSourceDescriptor(agentSource = DEFAULT_COMMAND_AGENT_SOURCE) {
    return COMMAND_AGENT_SOURCE_DESCRIPTORS[agentSource];
}
function getUserCommandsRoot(agentSource) {
    const descriptor = getCommandSourceDescriptor(agentSource);
    return join(resolveUserHomeDir(), ...descriptor.userDirectorySegments);
}
function getUserCliConfigPath() {
    return join(resolveUserHomeDir(), ".zcode", "cli", "config.json");
}
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
async function readUserCliConfig() {
    try {
        const content = await readFile(getUserCliConfigPath(), "utf-8");
        const parsed = JSON.parse(content);
        return isRecord(parsed) ? parsed : {};
    }
    catch {
        return {};
    }
}
async function writeUserCliConfig(config) {
    const filePath = getUserCliConfigPath();
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, `${JSON.stringify(config, null, 2)}\n`, "utf-8");
}
function readCommandEnabledOverrides(config) {
    const commandConfig = config.command;
    const overrides = new Map();
    if (!isRecord(commandConfig)) {
        return overrides;
    }
    for (const [filePath, entry] of Object.entries(commandConfig)) {
        if (isRecord(entry) && typeof entry[ENABLE_OVERRIDE_KEY] === "boolean") {
            overrides.set(filePath, entry[ENABLE_OVERRIDE_KEY]);
        }
    }
    return overrides;
}
async function readCommandEnabledOverridesFromUserConfig() {
    return readCommandEnabledOverrides(await readUserCliConfig());
}
function getCommandEnabled(filePath, overrides) {
    return overrides.get(filePath) ?? true;
}
function setCommandEnabledOverride(config, filePath, enabled) {
    const commandConfig = isRecord(config.command) ? { ...config.command } : {};
    if (enabled) {
        delete commandConfig[filePath];
    }
    else {
        commandConfig[filePath] = { [ENABLE_OVERRIDE_KEY]: false };
    }
    const nextConfig = { ...config };
    if (Object.keys(commandConfig).length > 0) {
        nextConfig.command = commandConfig;
    }
    else {
        delete nextConfig.command;
    }
    return nextConfig;
}
function readStringArray(value) {
    return Array.isArray(value)
        ? value.filter((item) => typeof item === "string")
        : [];
}
function readBooleanRecord(value) {
    const result = {};
    if (!isRecord(value)) {
        return result;
    }
    for (const [key, enabled] of Object.entries(value)) {
        if (typeof enabled === "boolean") {
            result[key] = enabled;
        }
    }
    return result;
}
function readStorageDirFromConfig(config) {
    const storage = isRecord(config.storage) ? config.storage : {};
    return typeof storage.dir === "string" && storage.dir.trim().length > 0
        ? storage.dir
        : "~/.zcode";
}
function readPluginConfigFromConfig(config) {
    const plugins = isRecord(config.plugins) ? config.plugins : {};
    return {
        dirs: readStringArray(plugins.dirs),
        enabled: typeof plugins.enabled === "boolean" ? plugins.enabled : true,
        enabledPlugins: readBooleanRecord(plugins.enabledPlugins),
        storageDir: readStorageDirFromConfig(config),
        suppressedBuiltins: readStringArray(plugins.suppressedBuiltins),
    };
}
function resolveConfigPath(path) {
    const expanded = path.startsWith(HOME_PREFIX)
        ? join(resolveUserHomeDir(), path.slice(HOME_PREFIX.length))
        : path;
    return isAbsolute(expanded) ? expanded : resolve(expanded);
}
function resolveCliStorageRoot(storageDir) {
    const storageRoot = resolveConfigPath(storageDir);
    return basename(storageRoot) === "cli" ? storageRoot : join(storageRoot, "cli");
}
function resolvePluginStorageRoot(storageDir) {
    return join(resolveCliStorageRoot(storageDir), "plugins");
}
function parsePathList(value) {
    if (typeof value === "string") {
        return [value];
    }
    return readStringArray(value);
}
function resolveInside(rootPath, rawPath) {
    if (isAbsolute(rawPath)) {
        return null;
    }
    const resolved = resolve(rootPath, rawPath);
    const relativePath = relative(rootPath, resolved);
    if (relativePath === "" ||
        (!relativePath.startsWith("..") && !relativePath.includes(`..${sep}`))) {
        return resolved;
    }
    return null;
}
async function scanOfficialPluginCacheRoots(pluginStorageRoot) {
    const cacheRoot = join(pluginStorageRoot, "cache", ZCODE_OFFICIAL_PLUGIN_MARKETPLACE);
    let pluginEntries = [];
    try {
        pluginEntries = await readdir(cacheRoot);
    }
    catch {
        return [];
    }
    const roots = [];
    for (const pluginEntry of pluginEntries) {
        const pluginDir = join(cacheRoot, pluginEntry);
        let versionEntries = [];
        try {
            versionEntries = await readdir(pluginDir);
        }
        catch {
            continue;
        }
        for (const versionEntry of versionEntries) {
            const rootPath = join(pluginDir, versionEntry);
            try {
                if ((await lstat(rootPath)).isDirectory()) {
                    roots.push(rootPath);
                }
            }
            catch {
                // ignore inaccessible plugin cache entries
            }
        }
    }
    return roots.sort((left, right) => left.localeCompare(right));
}
async function readPluginManifest(rootPath) {
    const manifestPath = await findPluginManifestPath(rootPath);
    if (!manifestPath) {
        return null;
    }
    let raw;
    try {
        raw = await readFile(manifestPath, "utf-8");
    }
    catch {
        return null;
    }
    try {
        const parsed = JSON.parse(raw);
        if (!isRecord(parsed)) {
            return null;
        }
        const name = typeof parsed.name === "string" ? parsed.name.trim() : "";
        if (!/^[a-z0-9][a-z0-9._-]{0,127}$/.test(name)) {
            return null;
        }
        return { commands: parsed.commands, name };
    }
    catch {
        return null;
    }
}
async function findPluginManifestPath(rootPath) {
    for (const manifestPath of [
        join(rootPath, ZCODE_PLUGIN_MANIFEST_PATH),
        join(rootPath, CLAUDE_PLUGIN_MANIFEST_PATH),
        join(rootPath, CODEX_PLUGIN_MANIFEST_PATH),
    ]) {
        if (existsSync(manifestPath)) {
            return manifestPath;
        }
    }
    return null;
}
function resolvePluginCommandRoots(params) {
    const roots = [];
    for (const rawPath of parsePathList(params.manifest.commands)) {
        const rootPath = resolveInside(params.rootPath, rawPath);
        if (rootPath) {
            roots.push(rootPath);
        }
    }
    if (roots.length === 0 && params.manifest.commands === undefined) {
        const defaultRoot = join(params.rootPath, "commands");
        if (existsSync(defaultRoot)) {
            roots.push(defaultRoot);
        }
    }
    return roots;
}
async function resolvePluginCommandRootDescriptors() {
    const config = readPluginConfigFromConfig(await readUserCliConfig());
    if (!config.enabled) {
        return [];
    }
    const pluginStorageRoot = resolvePluginStorageRoot(config.storageDir);
    const officialCacheRoots = await scanOfficialPluginCacheRoots(pluginStorageRoot);
    const installedRoots = await readInstalledPluginRoots(pluginStorageRoot);
    const candidates = [
        ...config.dirs.map((dir) => ({
            defaultEnabled: true,
            marketplace: ZCODE_INLINE_PLUGIN_MARKETPLACE,
            rootPath: resolveConfigPath(dir),
        })),
        ...officialCacheRoots.map((rootPath) => ({
            defaultEnabled: false,
            marketplace: ZCODE_OFFICIAL_PLUGIN_MARKETPLACE,
            rootPath,
        })),
        ...installedRoots,
    ];
    const descriptors = [];
    const seenPluginIds = new Set();
    for (const candidate of candidates) {
        const manifest = await readPluginManifest(candidate.rootPath);
        if (!manifest) {
            continue;
        }
        const pluginId = `${manifest.name}@${candidate.marketplace}`;
        // 内置官方插件被「卸载」后只在 CLI config 写入 suppressedBuiltins；desktop 直接扫
        // 官方 cache 时不经过 CLI resolve 的过滤，需要在这里同样跳过，否则被卸载的内置插件
        // 仍会从 cache 贡献命令。
        if (candidate.marketplace === ZCODE_OFFICIAL_PLUGIN_MARKETPLACE &&
            config.suppressedBuiltins.includes(pluginId)) {
            continue;
        }
        if (seenPluginIds.has(pluginId)) {
            continue;
        }
        seenPluginIds.add(pluginId);
        const defaultEnabled = candidate.defaultEnabled || DEFAULT_ENABLED_OFFICIAL_PLUGIN_IDS.has(pluginId);
        const enabled = config.enabledPlugins[pluginId] ?? defaultEnabled;
        if (!enabled) {
            continue;
        }
        // 命令管理页过去只展示本地命令，且插件扫描只覆盖内置官方 cache。
        // marketplace installed_plugins.json 里的官方/自建市场插件也要纳入只读命令来源。
        for (const rootPath of resolvePluginCommandRoots({
            manifest,
            rootPath: candidate.rootPath,
        })) {
            descriptors.push({
                pluginEnabled: enabled,
                pluginMarketplace: candidate.marketplace,
                pluginName: manifest.name,
                rootPath,
            });
        }
    }
    return descriptors;
}
function getUserCommandsRootForDescriptor(descriptor) {
    return join(resolveUserHomeDir(), ...descriptor.userDirectorySegments);
}
function getCommandsRootForStorage(params) {
    if (params.storageLevel === "project") {
        if (!params.workspacePath) {
            throw new Error("Missing workspace path for project command");
        }
        return {
            commandsRoot: join(params.workspacePath, ...params.descriptor.workspaceDirectorySegments),
            scope: "project",
            projectPath: params.workspacePath,
        };
    }
    return {
        commandsRoot: getUserCommandsRootForDescriptor(params.descriptor),
        scope: "global",
    };
}
function getLocationScope(scope) {
    return scope === "project" ? "project" : "user";
}
function buildCommandLocation(params) {
    return {
        source: params.descriptor.directorySource,
        scope: getLocationScope(params.scope),
        directoryPath: params.commandsRoot,
        ...(params.projectPath ? { projectPath: params.projectPath } : {}),
    };
}
function getCommandName(rootDir, filePath, descriptor) {
    const relativePath = relative(rootDir, filePath);
    const extensionPattern = new RegExp(`${descriptor.fileExtension.replace(".", "\\.")}$`, "i");
    const withoutExtension = relativePath.replace(extensionPattern, "");
    return `/${withoutExtension
        .split(/[\\/]+/)
        .filter(Boolean)
        .join(descriptor.namespaceSeparator)}`;
}
function getCommandFileName(config, agentSource) {
    const descriptor = getCommandSourceDescriptor(agentSource);
    const rawName = config.name.replace(/^\//, "");
    const relativeName = descriptor.namespaceSeparator === ":" ? rawName.replace(/:/g, "/") : rawName;
    return `${relativeName}${descriptor.fileExtension}`;
}
function getWritableCommandConfig(config, descriptor) {
    return descriptor.supportsArgumentHint ? config : { ...config, argumentHint: undefined };
}
function getCommandAgentSources(agentSource) {
    return agentSource ? [agentSource] : COMMAND_AGENT_SOURCE_ORDER;
}
function buildCommandId(agentSource, scope, name, location) {
    return `${agentSource}:${location.source}:${scope}:${name}`;
}
export function createCommandsService(_options) {
    async function list(params) {
        const userCommands = [];
        const agentSources = getCommandAgentSources(params.agentSource);
        const enabledOverrides = await readCommandEnabledOverridesFromUserConfig();
        // ZCode Agent 需要先合并所有 workspace 目录，再合并所有 user 目录；
        // 按每个目录交错读取 project/user 会让 user .zcode 抢在 workspace .agents 前面。
        for (const agentSource of agentSources) {
            const descriptors = agentSource === ZCODE_COMMAND_AGENT_SOURCE
                ? COMMAND_DIRECTORY_SOURCE_DESCRIPTORS
                : [getCommandSourceDescriptor(agentSource)];
            if (params.workspacePath) {
                const workspacePath = params.workspacePath;
                await discoverCommandsFromDirectorySources({
                    descriptors,
                    commandsRootForDescriptor: (descriptor) => join(workspacePath, ...descriptor.workspaceDirectorySegments),
                    commands: userCommands,
                    enabledOverrides,
                    projectPath: workspacePath,
                    scope: "project",
                });
            }
            await discoverCommandsFromDirectorySources({
                descriptors,
                commandsRootForDescriptor: getUserCommandsRootForDescriptor,
                commands: userCommands,
                enabledOverrides,
                scope: "global",
            });
        }
        const dedupedUserCommands = dedupeCommandsByName(userCommands);
        const pluginCommands = !params.agentSource || params.agentSource === ZCODE_COMMAND_AGENT_SOURCE
            ? await discoverPluginCommands(enabledOverrides)
            : [];
        return {
            commands: [...dedupedUserCommands, ...pluginCommands],
            userCommands: dedupedUserCommands,
            pluginCommands,
            capability: { userScopeAvailable: true },
        };
    }
    async function writeCommandFile(params) {
        const agentSource = params.agentSource ?? DEFAULT_COMMAND_AGENT_SOURCE;
        const descriptor = getCommandSourceDescriptor(agentSource);
        const target = getCommandsRootForStorage({
            descriptor,
            storageLevel: params.storageLevel,
            workspacePath: params.workspacePath,
        });
        const { commandsRoot } = target;
        await mkdir(commandsRoot, { recursive: true });
        const fileName = getCommandFileName(params.config, agentSource);
        const filePath = join(commandsRoot, fileName);
        // 检查文件是否已存在
        try {
            await access(filePath);
            throw new Error(`Command file already exists: ${fileName}`);
        }
        catch (error) {
            const err = error;
            if (err.code !== "ENOENT") {
                throw error;
            }
        }
        const content = CommandFileParser.generateCommandFileContent(getWritableCommandConfig(params.config, descriptor), descriptor.format);
        await writeFile(filePath, content, "utf-8");
        await writeUserCliConfig(setCommandEnabledOverride(await readUserCliConfig(), filePath, true));
        const parsed = CommandFileParser.parseCommandFile(content, filePath, descriptor.format);
        if (!parsed) {
            throw new Error("Failed to parse written command file");
        }
        const name = getCommandName(commandsRoot, filePath, descriptor);
        const location = buildCommandLocation({
            descriptor,
            commandsRoot,
            scope: target.scope,
            ...(target.projectPath ? { projectPath: target.projectPath } : {}),
        });
        const command = {
            ...parsed,
            name,
            agentSource,
            location,
            id: buildCommandId(agentSource, target.scope, name, location),
            source: "user",
            enabled: true,
            scope: target.scope,
            ...(target.projectPath ? { projectPath: target.projectPath } : {}),
        };
        return { command };
    }
    async function updateCommandFile(params) {
        const agentSource = params.agentSource ?? DEFAULT_COMMAND_AGENT_SOURCE;
        const descriptor = getCommandSourceDescriptor(agentSource);
        const target = getCommandsRootForStorage({
            descriptor,
            storageLevel: params.storageLevel,
            workspacePath: params.workspacePath,
        });
        const { commandsRoot } = target;
        const newFileName = getCommandFileName(params.config, agentSource);
        const newFilePath = join(commandsRoot, newFileName);
        const enabledOverrides = await readCommandEnabledOverridesFromUserConfig();
        const existingContent = params.oldFilePath
            ? await readFile(params.oldFilePath, "utf-8").catch(() => undefined)
            : undefined;
        // 如果文件名变了，需要删除旧文件
        if (params.oldFilePath && params.oldFilePath !== newFilePath) {
            try {
                await rm(params.oldFilePath);
            }
            catch {
                // 旧文件可能已被移除，忽略删除失败（ENOENT 属正常情况）。
            }
        }
        // 检查新文件是否已存在（排除自己的旧路径）
        if (newFilePath !== params.oldFilePath) {
            try {
                await access(newFilePath);
                throw new Error(`Command file already exists: ${newFileName}`);
            }
            catch (error) {
                const err = error;
                if (err.code !== "ENOENT") {
                    throw error;
                }
            }
        }
        const content = CommandFileParser.generateCommandFileContent(getWritableCommandConfig(params.config, descriptor), descriptor.format, existingContent);
        await mkdir(dirname(newFilePath), { recursive: true });
        await writeFile(newFilePath, content, "utf-8");
        if (params.oldFilePath &&
            params.oldFilePath !== newFilePath &&
            enabledOverrides.has(params.oldFilePath)) {
            // 禁用状态按命令文件路径存放；编辑命令改名会换文件路径，必须迁移 override，
            // 否则用户刚禁用的命令会因为改名重新启用。
            const migratedConfig = setCommandEnabledOverride(setCommandEnabledOverride(await readUserCliConfig(), params.oldFilePath, true), newFilePath, enabledOverrides.get(params.oldFilePath) ?? true);
            await writeUserCliConfig(migratedConfig);
        }
        const parsed = CommandFileParser.parseCommandFile(content, newFilePath, descriptor.format);
        if (!parsed) {
            throw new Error("Failed to parse written command file");
        }
        const name = getCommandName(commandsRoot, newFilePath, descriptor);
        const location = buildCommandLocation({
            descriptor,
            commandsRoot,
            scope: target.scope,
            ...(target.projectPath ? { projectPath: target.projectPath } : {}),
        });
        const command = {
            ...parsed,
            name,
            agentSource,
            location,
            id: buildCommandId(agentSource, target.scope, name, location),
            source: "user",
            enabled: getCommandEnabled(newFilePath, await readCommandEnabledOverridesFromUserConfig()),
            scope: target.scope,
            ...(target.projectPath ? { projectPath: target.projectPath } : {}),
        };
        return { command };
    }
    async function deleteCommandFile(params) {
        try {
            await rm(params.filePath);
        }
        catch (error) {
            const err = error;
            if (err.code === "ENOENT") {
                // 文件不存在，当作成功
            }
            else {
                throw error;
            }
        }
        await writeUserCliConfig(setCommandEnabledOverride(await readUserCliConfig(), params.filePath, true));
    }
    async function setCommandEnabled(params) {
        const nextConfig = setCommandEnabledOverride(await readUserCliConfig(), params.filePath, params.enabled);
        await writeUserCliConfig(nextConfig);
    }
    async function getPrimaryUserCommandsDirectory(params) {
        const path = getUserCommandsRoot(params?.agentSource);
        // open-in-file-manager 在 Windows 上不能可靠打开不存在的路径，
        // 这里先确保命令目录落盘，再把路径交给系统文件管理器。
        await mkdir(path, { recursive: true });
        return { path };
    }
    return {
        list,
        writeCommandFile,
        updateCommandFile,
        deleteCommandFile,
        setCommandEnabled,
        getPrimaryUserCommandsDirectory,
    };
}
function dedupeCommandsByName(commands) {
    const selected = new Map();
    for (const command of commands) {
        if (!selected.has(command.name)) {
            selected.set(command.name, command);
        }
    }
    return Array.from(selected.values());
}
function buildPluginCommandId(params) {
    return `plugin:${params.pluginMarketplace}:${params.pluginName}:${params.name}:${params.filePath}`;
}
async function discoverPluginCommands(enabledOverrides) {
    const rootDescriptors = await resolvePluginCommandRootDescriptors();
    const commands = [];
    const seenFilePaths = new Set();
    for (const descriptor of rootDescriptors) {
        await discoverPluginCommandsRecursive(descriptor.rootPath, descriptor.rootPath, commands, {
            descriptor,
            enabledOverrides,
            seenFilePaths,
        });
    }
    return commands.sort((left, right) => left.name.localeCompare(right.name));
}
// ============================================================================
// 辅助函数
// ============================================================================
async function discoverPluginCommandsRecursive(rootDir, currentDir, commands, options) {
    let entries;
    try {
        entries = await readdir(currentDir);
    }
    catch {
        return;
    }
    for (const entry of entries) {
        if (entry.startsWith(".")) {
            continue;
        }
        const fullPath = join(currentDir, entry);
        let isDir = false;
        try {
            const stat = await lstat(fullPath);
            isDir = stat.isDirectory();
        }
        catch {
            continue;
        }
        if (isDir) {
            await discoverPluginCommandsRecursive(rootDir, fullPath, commands, options);
            continue;
        }
        if (!entry.toLowerCase().endsWith(ZCODE_COMMAND_DESCRIPTOR.fileExtension)) {
            continue;
        }
        try {
            const content = await readFile(fullPath, "utf-8");
            const parsed = CommandFileParser.parseCommandFile(content, fullPath, ZCODE_COMMAND_DESCRIPTOR.format);
            if (!parsed) {
                continue;
            }
            const name = getCommandName(rootDir, fullPath, ZCODE_COMMAND_DESCRIPTOR);
            const commandKey = fullPath.replaceAll("\\", "/").toLowerCase();
            if (options.seenFilePaths.has(commandKey)) {
                continue;
            }
            options.seenFilePaths.add(commandKey);
            commands.push({
                ...parsed,
                enabled: options.descriptor.pluginEnabled && getCommandEnabled(fullPath, options.enabledOverrides),
                filePath: fullPath,
                id: buildPluginCommandId({
                    filePath: fullPath,
                    name,
                    pluginMarketplace: options.descriptor.pluginMarketplace,
                    pluginName: options.descriptor.pluginName,
                }),
                name,
                pluginEnabled: options.descriptor.pluginEnabled,
                pluginMarketplace: options.descriptor.pluginMarketplace,
                pluginName: options.descriptor.pluginName,
                scope: "global",
                source: "plugin",
            });
        }
        catch {
            // 插件命令本身由插件管理；单个文件解析失败不阻断其它命令展示。
        }
    }
}
async function discoverUserCommandsRecursive(rootDir, currentDir, commands, options) {
    const descriptor = options.descriptor;
    let entries;
    try {
        entries = await readdir(currentDir);
    }
    catch {
        return;
    }
    for (const entry of entries) {
        const fullPath = join(currentDir, entry);
        // 跳过隐藏文件和目录
        if (entry.startsWith(".")) {
            continue;
        }
        let isDir = false;
        try {
            const stat = await lstat(fullPath);
            isDir = stat.isDirectory();
        }
        catch {
            // 无法访问，跳过
            continue;
        }
        if (isDir) {
            // 递归扫描子目录
            await discoverUserCommandsRecursive(rootDir, fullPath, commands, options);
            continue;
        }
        if (entry.toLowerCase().endsWith(descriptor.fileExtension)) {
            try {
                const content = await readFile(fullPath, "utf-8");
                const parsed = CommandFileParser.parseCommandFile(content, fullPath, descriptor.format);
                if (parsed) {
                    const name = getCommandName(rootDir, fullPath, descriptor);
                    const location = buildCommandLocation({
                        descriptor,
                        commandsRoot: rootDir,
                        scope: options.scope,
                        ...(options.projectPath ? { projectPath: options.projectPath } : {}),
                    });
                    commands.push({
                        ...parsed,
                        name,
                        agentSource: descriptor.agentSource,
                        location,
                        id: buildCommandId(descriptor.agentSource, options.scope, name, location),
                        source: "user",
                        enabled: getCommandEnabled(fullPath, options.enabledOverrides),
                        scope: options.scope,
                        ...(options.projectPath ? { projectPath: options.projectPath } : {}),
                    });
                }
            }
            catch {
                // 解析失败就跳过
            }
        }
    }
}
async function discoverCommandsRoot(params) {
    const beforeCount = params.commands.length;
    try {
        await access(params.commandsRoot);
    }
    catch {
        return 0;
    }
    try {
        await discoverUserCommandsRecursive(params.commandsRoot, params.commandsRoot, params.commands, {
            descriptor: params.descriptor,
            scope: params.scope,
            enabledOverrides: params.enabledOverrides,
            ...(params.projectPath ? { projectPath: params.projectPath } : {}),
        });
    }
    catch {
        // 扫描出错时返回已发现的命令
    }
    return params.commands.length - beforeCount;
}
async function discoverCommandsFromDirectorySources(params) {
    for (const descriptor of params.descriptors) {
        const discoveredCount = await discoverCommandsRoot({
            descriptor,
            commandsRoot: params.commandsRootForDescriptor(descriptor),
            commands: params.commands,
            enabledOverrides: params.enabledOverrides,
            scope: params.scope,
            ...(params.projectPath ? { projectPath: params.projectPath } : {}),
        });
        // `.zcode` 是强优先级来源；只要读到有效命令，同 scope 的 `.agents` 就不再参与。
        if (descriptor.directorySource === "zcode" && discoveredCount > 0) {
            break;
        }
    }
}
//# sourceMappingURL=commandsService.js.map