import { access, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
const DEFAULT_OUTPUT_STYLE = "default";
const SETTINGS_FILE = "settings.json";
const BUILT_IN_STYLES = [
    {
        id: "default",
        name: "Default",
        description: "Completes coding tasks efficiently and provides concise responses",
        content: "",
        isBuiltIn: true,
        enabled: true,
    },
    {
        id: "explanatory",
        name: "Explanatory",
        description: "Explains implementation choices and codebase patterns",
        content: "",
        isBuiltIn: true,
        enabled: false,
    },
    {
        id: "learning",
        name: "Learning",
        description: "Pauses and asks you to write small pieces of code for hands-on practice",
        content: "",
        isBuiltIn: true,
        enabled: false,
    },
];
function resolveUserHomeDir() {
    const envHome = process.env.HOME?.trim() || process.env.USERPROFILE?.trim();
    return envHome && envHome.length > 0 ? envHome : homedir();
}
function getUserOutputStylesDir() {
    return join(resolveUserHomeDir(), ".claude", "output-styles");
}
function getUserClaudeSettingsPath() {
    return join(resolveUserHomeDir(), ".claude", SETTINGS_FILE);
}
/**
 * Read JSON file safely
 */
async function readJsonFile(filePath) {
    try {
        if (!existsSync(filePath)) {
            return null;
        }
        const content = await readFile(filePath, "utf-8");
        return JSON.parse(content);
    }
    catch (error) {
        console.error(`Failed to read JSON file ${filePath}:`, error);
        return null;
    }
}
/**
 * Write JSON file safely
 */
async function writeJsonFile(filePath, data) {
    try {
        await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    }
    catch (error) {
        console.error(`Failed to write JSON file ${filePath}:`, error);
        throw error;
    }
}
/**
 * 解析 markdown 格式的 output style 文件
 */
function parseMarkdownStyle(content, filename) {
    const nameMatch = content.match(/^name:\s*(.+)$/m);
    const descMatch = content.match(/^description:\s*(.+)$/m);
    let name = nameMatch?.[1]?.trim() ?? "";
    if (!name && filename) {
        name = filename.replace(/\.md$/, "");
    }
    if (!name) {
        name = "Custom Style";
    }
    const description = descMatch?.[1]?.trim() ?? "";
    return { name, description };
}
/**
 * 创建 OutputStyle 服务实例
 */
export function createOutputStyleService() {
    async function getActiveStyle() {
        const settingsPath = getUserClaudeSettingsPath();
        const settings = await readJsonFile(settingsPath);
        return { styleId: settings?.outputStyle ?? null };
    }
    async function setActiveStyle(params) {
        const { styleId } = params;
        const settingsPath = getUserClaudeSettingsPath();
        const claudeDir = join(resolveUserHomeDir(), ".claude");
        // Ensure directory exists
        if (!existsSync(claudeDir)) {
            await mkdir(claudeDir, { recursive: true });
        }
        // Read existing settings.json
        const existingSettings = (await readJsonFile(settingsPath)) || {};
        // Update outputStyle
        const newSettings = {
            ...existingSettings,
            outputStyle: styleId,
        };
        await writeJsonFile(settingsPath, newSettings);
    }
    async function listStyles() {
        const stylesDir = getUserOutputStylesDir();
        const customStyles = [];
        // Get active style from settings.local.json, default to "default"
        const { styleId } = await getActiveStyle();
        const activeStyleId = styleId ?? "default";
        try {
            await access(stylesDir);
            const entries = await readdir(stylesDir, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.isFile() && entry.name.endsWith(".md")) {
                    try {
                        const filePath = join(stylesDir, entry.name);
                        const content = await readFile(filePath, "utf-8");
                        const { name, description } = parseMarkdownStyle(content, entry.name);
                        const styleId = `custom-${entry.name.replace(".md", "")}`;
                        customStyles.push({
                            id: styleId,
                            name,
                            description,
                            content,
                            isBuiltIn: false,
                            enabled: styleId === activeStyleId,
                            filePath,
                        });
                    }
                    catch (error) {
                        console.error(`Failed to read output style file ${entry.name}:`, error);
                    }
                }
            }
        }
        catch {
            // 目录不存在或无法访问，返回内置 styles
        }
        // 按名称排序
        customStyles.sort((a, b) => a.name.localeCompare(b.name));
        // 合并内置和自定义 styles，标记激活状态
        const allStyles = [
            ...BUILT_IN_STYLES.map((style) => ({
                ...style,
                enabled: style.id === activeStyleId,
            })),
            ...customStyles,
        ];
        return { styles: allStyles };
    }
    async function addStyle(params) {
        const { config } = params;
        const stylesDir = getUserOutputStylesDir();
        try {
            await mkdir(stylesDir, { recursive: true });
        }
        catch (error) {
            const err = error;
            if (err.code !== "EEXIST") {
                throw error;
            }
        }
        const filename = `${config.name.toLowerCase().replace(/\s+/g, "-")}.md`;
        const filePath = join(stylesDir, filename);
        // 生成文件内容
        const content = `name: ${config.name}
description: ${config.description}

${config.content}`;
        await writeFile(filePath, content, "utf-8");
    }
    async function updateStyle(params) {
        const { id, config } = params;
        // 移除 'custom-' 前缀获取文件名
        const baseId = id.startsWith("custom-") ? id.slice(7) : id;
        const stylesDir = getUserOutputStylesDir();
        const filename = `${baseId}.md`;
        const filePath = join(stylesDir, filename);
        // 生成文件内容
        const content = `name: ${config.name}
description: ${config.description}

${config.content}`;
        await writeFile(filePath, content, "utf-8");
    }
    async function deleteStyle(params) {
        const { id } = params;
        // 移除 'custom-' 前缀获取文件名
        const baseId = id.startsWith("custom-") ? id.slice(7) : id;
        const stylesDir = getUserOutputStylesDir();
        const filename = `${baseId}.md`;
        const filePath = join(stylesDir, filename);
        await rm(filePath, { force: true });
    }
    async function getUserStylesDirectory() {
        const stylesDir = getUserOutputStylesDir();
        try {
            await mkdir(stylesDir, { recursive: true });
        }
        catch {
            // 目录已存在
        }
        return { path: stylesDir };
    }
    return {
        listStyles,
        addStyle,
        updateStyle,
        deleteStyle,
        getUserStylesDirectory,
        setActiveStyle,
        getActiveStyle,
    };
}
//# sourceMappingURL=outputStyleService.js.map