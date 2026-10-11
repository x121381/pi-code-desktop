import type { ZCodeSessionFile, ZCodeTaskMeta } from "@zcode/shared";
export type LegacyTaskSessionFile = Omit<ZCodeSessionFile, "meta"> & {
    meta: Omit<ZCodeTaskMeta, "mode"> & {
        mode?: ZCodeTaskMeta["mode"];
    };
};
export declare function parseLegacyTaskSessionFile(input: unknown): LegacyTaskSessionFile;
export declare function safeParseLegacyTaskSessionFile(input: unknown): import("zod").ZodSafeParseResult<{
    messages: {
        role: "assistant" | "user";
        content: string;
        timestamp: number;
        id?: string | undefined;
        model?: string | undefined;
        characterCount?: number | undefined;
        durationMs?: number | undefined;
        interrupted?: boolean | undefined;
        feedback?: "like" | "dislike" | undefined;
        attachments?: ({
            kind: "image";
            filename: string;
            mimeType: string;
            sizeBytes?: number | undefined;
            dataBase64?: string | undefined;
            localPath?: string | undefined;
        } | {
            kind: "video";
            filename: string;
            mimeType: string;
            sizeBytes?: number | undefined;
            dataBase64?: string | undefined;
            localPath?: string | undefined;
        } | {
            kind: "pdf";
            filename: string;
            mimeType: string;
            sizeBytes?: number | undefined;
            dataBase64?: string | undefined;
            localPath?: string | undefined;
        } | {
            kind: "file";
            filename: string;
            mimeType: string;
            sizeBytes: number;
            dataBase64?: string | undefined;
            textContent?: string | undefined;
            localPath?: string | undefined;
        })[] | undefined;
        tools?: {
            input: unknown;
            toolName?: string | undefined;
            title?: string | undefined;
            kind?: string | undefined;
            status?: "failed" | "stopped" | "completed" | "denied" | undefined;
            output?: unknown;
            error?: string | undefined;
            raw?: unknown;
            snapshotRefs?: {
                field: "output" | "input" | "raw";
                refId: string;
                hash: string;
                fullBytes: number;
                previewBytes: number;
            }[] | undefined;
        }[] | undefined;
        thought?: string | undefined;
        parts?: ({
            type: "content";
            content: string;
        } | {
            type: "thought";
            content: string;
        } | {
            type: "tool-call";
            toolIndex: number;
        })[] | undefined;
        checkpointState?: "partial" | undefined;
        checkpointReason?: "tool_completed" | "part_boundary" | "periodic" | undefined;
        checkpointUpdatedAt?: number | undefined;
        turnIndex?: number | undefined;
        bodyRefs?: {
            field: "content" | "thought";
            refId: string;
            hash: string;
            fullBytes: number;
            previewBytes: number;
        }[] | undefined;
        toolSlice?: {
            persistedMessageIndex: number;
            totalTools: number;
            startToolIndex: number;
            endToolIndexExclusive: number;
        } | undefined;
    }[];
    meta: {
        taskId: string;
        traceId: string;
        title: string;
        workspacePath: string;
        createdAt: number;
        updatedAt: number;
        titleOverridden?: boolean | undefined;
        workspaceIdentity?: string | undefined;
        workspacePurpose?: "conversation" | "project" | undefined;
        model?: string | undefined;
        thoughtLevel?: string | undefined;
        runtimeEpoch?: number | undefined;
        provider?: "glm" | undefined;
        migrationSource?: "claudeCode" | undefined;
        forkedFromTaskId?: string | undefined;
        cronAutomationId?: string | undefined;
        offPeakTaskId?: string | undefined;
        unreadAt?: number | undefined;
        status?: "running" | "completed" | "error" | undefined;
        lastError?: {
            message: string;
            code?: string | undefined;
            detail?: string | undefined;
            traceId?: string | undefined;
            taskId?: string | undefined;
            attribution?: {
                source?: "provider" | "tool" | "runtime" | "network" | undefined;
                reason?: string | undefined;
                errorPhase?: "response" | "connect" | "stream" | "prepare" | "configuration" | "parse" | "validation" | "unhandled" | undefined;
                exceptionKind?: "protocol" | "transport" | "validation" | "api_call" | "generic" | "provider_business" | "type_error" | undefined;
                providerId?: string | undefined;
                modelId?: string | undefined;
                providerKind?: string | undefined;
                transport?: "websocket" | "http" | "sse" | undefined;
                statusCode?: number | undefined;
                providerErrorCode?: string | undefined;
                retryable?: boolean | undefined;
            } | undefined;
        } | undefined;
        repairState?: {
            claudeNativeSnapshotAssistantContentVersion?: number | undefined;
            codexNativeSnapshotSubagentToolsVersion?: number | undefined;
        } | undefined;
        changeSummary?: {
            fileCount: number;
            added: number;
            removed: number;
            files: {
                path: string;
                added: number;
                removed: number;
                writeCount: number;
                lastTurnIndex: number;
            }[];
        } | undefined;
        target?: {
            sessionID: string;
            targetID: string;
            objective: string;
            summaryTitle: string | null;
            status: "active" | "paused" | "complete" | "budget_limited";
            tokenBudget: number | null;
            tokensUsed: number;
            timeUsedSeconds: number;
            time: {
                created: number;
                updated: number;
            };
            activeInputId?: string | null | undefined;
            activeRunStartedAtMs?: number | null | undefined;
            activeRunLastSeenAtMs?: number | null | undefined;
        } | null | undefined;
        mode?: "default" | "yolo" | "guarded" | "plan" | "edit" | "acceptEdits" | "auto" | "dontAsk" | "bypassPermissions" | "autoEdit" | "build" | undefined;
    };
    fileChanges?: {
        turnIndex: number;
        snapshots: {
            path: string;
            beforeContent: string | null;
            afterContent: string;
            writeCount: number;
            contentRefs?: {
                field: "beforeContent" | "afterContent";
                refId: string;
                hash: string;
                fullBytes: number;
                previewBytes: number;
            }[] | undefined;
        }[];
        fileState?: "applied" | "reverted" | undefined;
    }[] | undefined;
    turnCheckpoints?: {
        turnIndex: number;
        baseFileCheckpointId: string;
        resultFileCheckpointId?: string | undefined;
    }[] | undefined;
}>;
//# sourceMappingURL=legacyTaskSessionFile.d.ts.map