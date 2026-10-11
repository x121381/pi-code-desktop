import { runExportLogsAction } from "@/lib/exportLogsAction.js";
import { ZCODE_PRODUCT_DOCS_URL } from "@/lib/productDocs.js";
export function createHelpMenuActionHandlers({ platform, intl, openSubmit, }) {
    return {
        openIssueReport: async () => {
            openSubmit({
                type: "bug",
                module: "其它",
                severity: "P2-中",
                includeLogs: true,
                screenshots: [],
            });
        },
        openProductDocs: () => {
            platform.openExternal(ZCODE_PRODUCT_DOCS_URL);
        },
        exportLogs: () => {
            void runExportLogsAction(platform, intl);
        },
    };
}
//# sourceMappingURL=helpMenuActions.js.map