import type { RendererActionTraceGroup } from "@zcode/shared";
export declare const CORE_USER_ACTION_FEATURES: {
    readonly "workspace.local.lifecycle": readonly ["open", "switch", "close"];
    readonly "workspace.remote.lifecycle": readonly ["open_dialog", "connect", "reconnect", "disconnect"];
    readonly "workspace.project_binding": readonly ["attach", "detach", "work_outside_project"];
    readonly "task.lifecycle": readonly ["create", "open", "archive", "rename", "delete"];
    readonly "task.layout": readonly ["open_split", "split_right", "split_down", "close_pane"];
    readonly "conversation.composer.message": readonly ["send", "stop"];
    readonly "conversation.composer.attachment": readonly ["add", "remove", "retry_upload"];
    readonly "conversation.composer.config": readonly ["change_model", "change_thought_level", "change_mode"];
    readonly "conversation.queue.item": readonly ["send_now", "edit", "remove", "reorder"];
    readonly "conversation.queue.policy": readonly ["resume", "toggle_auto_drain", "toggle_followup", "clear_and_send", "keep_and_send"];
    readonly "conversation.history.branch": readonly ["retry", "edit", "fork", "rewind_files"];
    readonly "conversation.history.feedback": readonly ["like", "dislike", "clear_feedback", "copy"];
    readonly "conversation.blocking.user_input": readonly ["select_option", "submit_text", "cancel"];
    readonly "conversation.blocking.hook": readonly ["review", "dismiss"];
    readonly "conversation.navigation": readonly ["load_older", "jump_bottom", "open_turn"];
    readonly "conversation.subagent": readonly ["expand", "open_side_pane", "open_split"];
    readonly "conversation.background_work": readonly ["open", "cancel"];
    readonly "workbench.file": readonly ["open_tree", "refresh", "open_file", "open_preview"];
    readonly "workbench.terminal": readonly ["open", "close"];
    readonly "workbench.browser": readonly ["open", "navigate", "back", "forward", "refresh", "open_external"];
    readonly "workbench.git": readonly ["open", "commit", "generate_commit_message", "run_action"];
    readonly "extension.plugin": readonly ["open_store", "search", "open_detail", "install", "enable", "disable", "update", "uninstall", "save_config"];
    readonly "extension.mcp": readonly ["authorize", "refresh", "enable", "disable"];
    readonly "automation.lifecycle": readonly ["create", "update", "run_now", "enable", "disable", "pause", "resume", "delete"];
};
export declare const SETTINGS_USER_ACTION_FEATURES: {
    readonly "settings.navigation": readonly ["open_section", "back_to_workspace", "open_onboarding"];
    readonly "settings.locale": readonly ["change_locale"];
    readonly "settings.appearance": readonly ["change_theme", "change_ui_font_size", "change_code_light_theme", "change_code_dark_theme", "toggle_code_line_numbers", "toggle_code_line_wrap", "change_code_font_size"];
    readonly "settings.terminal": readonly ["toggle_system_profile", "save_font_family", "change_shell"];
    readonly "settings.search": readonly ["toggle_native_search"];
    readonly "settings.network": readonly ["save_http_proxy", "save_no_proxy", "save_ca_certificate"];
    readonly "settings.desktop": readonly ["toggle_hardware_acceleration", "toggle_close_to_tray", "toggle_keep_awake"];
    readonly "settings.update": readonly ["toggle_preview_updates", "toggle_auto_update"];
    readonly "settings.notification": readonly ["toggle_notification", "toggle_notification_sound"];
    readonly "settings.conversation": readonly ["change_interaction_behavior", "toggle_ask_user_auto_resolution", "toggle_model_io_retention", "toggle_show_reasoning", "toggle_show_todos"];
    readonly "settings.tool_grouping": readonly ["toggle_explore_grouping", "toggle_terminal_grouping", "toggle_changes_grouping"];
    readonly "settings.task": readonly ["toggle_auto_archive", "change_auto_archive_days"];
    readonly "settings.storage": readonly ["change_data_directory"];
    readonly "settings.memory": readonly ["toggle_memory", "refresh_memory", "change_memory_scope"];
    readonly "settings.browser": readonly ["toggle_browser_use", "import_browser_data", "toggle_insecure_certificates", "clear_cache", "clear_all_data"];
};
export type CoreUserActionFeatureId = keyof typeof CORE_USER_ACTION_FEATURES;
export type SettingsUserActionFeatureId = keyof typeof SETTINGS_USER_ACTION_FEATURES;
export type UserActionFeatureId = CoreUserActionFeatureId | SettingsUserActionFeatureId;
export type UserActionOperationKind = "navigation" | "preference" | "command" | "management" | "destructive";
export interface UserActionCatalogEntry {
    featureId: UserActionFeatureId;
    action: string;
    group: Extract<RendererActionTraceGroup, "core" | "settings">;
    operationKind: UserActionOperationKind;
    surface: string;
    timeoutMs: number;
}
export declare const USER_ACTION_CATALOG: readonly UserActionCatalogEntry[];
export declare function resolveUserActionCatalogEntry(featureId: string, action: string): UserActionCatalogEntry | undefined;
//# sourceMappingURL=userActionTraceCatalog.d.ts.map