import { dismissToast, toast } from "@/components/ui/toast.js";
export async function runExportLogsAction(platform, intl) {
    const pendingToastId = toast(intl.formatMessage({ id: "sidebar.exportLogs.pending" }), {
        durationMs: Number.POSITIVE_INFINITY,
    });
    try {
        const result = await platform.exportLogs();
        if (!result.success) {
            toast(intl.formatMessage({ id: "sidebar.exportLogs.error" }, { error: result.error ?? "unknown" }));
        }
    }
    catch (error) {
        toast(intl.formatMessage({ id: "sidebar.exportLogs.error" }, { error: error instanceof Error ? error.message : String(error) }));
    }
    finally {
        dismissToast(pendingToastId);
    }
}
//# sourceMappingURL=exportLogsAction.js.map