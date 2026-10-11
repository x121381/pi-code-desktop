export declare const ZCODE_KNOWN_TOOL_NAMES: readonly ["Read", "Write", "Edit", "ApplyPatch", "Bash", "Glob", "Grep", "WebFetch", "WebSearch", "web_search", "TodoRead", "TodoWrite", "GoalRead", "ReadSessionContext", "AskUserQuestion", "SendMessage", "RespondToCoordinator", "TaskOutput", "TaskStop", "js", "js_reset", "js_add_node_module_dir", "mcp__node_repl__js", "mcp__node_repl__js_reset", "mcp__node_repl__js_add_node_module_dir", "Agent", "Task", "Skill", "CreateWorkflow", "AmendWorkflow", "FillWorkflowHole", "submit_result"];
export type ZCodeKnownToolName = (typeof ZCODE_KNOWN_TOOL_NAMES)[number];
export type ZCodeToolFamily = "file-read" | "file-write" | "shell" | "search" | "todo" | "ask-user-question" | "agent" | "skill" | "goal" | "session-context" | "message" | "task-control" | "node-repl" | "workflow";
export declare function normalizeZCodeToolName(value: string | null | undefined): ZCodeKnownToolName | null;
export declare function getZCodeToolFamilyForName(value: string | null | undefined): ZCodeToolFamily | null;
export declare function isZCodeToolFamily(value: string | null | undefined, family: ZCodeToolFamily): boolean;
export declare function isZCodeFileContentWriteToolName(value: string | null | undefined): boolean;
//# sourceMappingURL=tool-identity.d.ts.map