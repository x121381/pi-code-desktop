export declare function ModelTrajectoryPane({ taskId, title, workspacePath, workspaceIdentity, onClose, }: {
    taskId: string;
    title?: string | null;
    workspacePath: string;
    workspaceIdentity?: string;
    onClose?: () => void;
}): import("react/jsx-runtime").JSX.Element;
export { resolveTrajectoryInputMessages, resolveTrajectoryTimelineItems, } from "@/ModelTrajectoryTimeline.js";
export declare function getModelTrajectorySourceDirectory(sourceFiles: readonly string[] | undefined): string | null;
//# sourceMappingURL=ModelTrajectoryPane.d.ts.map