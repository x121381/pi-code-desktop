import type { LaunchMarks } from "@zcode/shared";
export declare function shouldReportLaunchToInput(state: {
    isStartupRenderBlocked: boolean;
    welcomeScreenOpen: boolean;
    alreadyReported: boolean;
}): boolean;
export declare function readRendererLaunchTimings(): {
    marks: LaunchMarks | null;
    rendererStart: number;
    reactCommit: number;
} | null;
//# sourceMappingURL=launchToInputReport.d.ts.map