import { ZCODE_AGENT_PROVIDER, ZCODE_COMMAND_AGENT_SOURCES, } from "@zcode/shared";
export const COMMAND_AGENT_SOURCES = [
    ...ZCODE_COMMAND_AGENT_SOURCES,
];
export const COMMAND_AGENT_SOURCE_META = {
    zcodeAgent: {
        labelId: "settings.commands.source.zcodeAgent",
        pathHint: "~/.zcode/commands",
        provider: ZCODE_AGENT_PROVIDER,
    },
};
//# sourceMappingURL=commandsSettingsShared.js.map