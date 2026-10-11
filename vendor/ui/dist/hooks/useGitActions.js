import { useCallback, useState } from "react";
import { toast } from "../components/ui/toast.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { logger } from "../logger.js";
export function useGitActions(options) {
    const { workspacePath } = options;
    const { intl } = useZCodeIntl();
    const [refreshVersion, setRefreshVersion] = useState(0);
    const announcePlaceholder = useCallback((action, detail) => {
        logger.info(`[GitPane] ${action} workspace=${workspacePath}`, detail);
        toast(intl.formatMessage({ id: "diff.placeholder.toast" }));
    }, [intl, workspacePath]);
    const refresh = useCallback(async (sourceId) => {
        setRefreshVersion((value) => value + 1);
        announcePlaceholder("refresh", { sourceId });
    }, [announcePlaceholder]);
    const stagePaths = useCallback(async (paths) => {
        announcePlaceholder("stagePaths", { count: paths.length, paths });
    }, [announcePlaceholder]);
    const unstagePaths = useCallback(async (paths) => {
        announcePlaceholder("unstagePaths", { count: paths.length, paths });
    }, [announcePlaceholder]);
    const discardPaths = useCallback(async (paths) => {
        announcePlaceholder("discardPaths", { count: paths.length, paths });
    }, [announcePlaceholder]);
    const commit = useCallback(async (message) => {
        announcePlaceholder("commit", { messageLength: message.trim().length });
    }, [announcePlaceholder]);
    return {
        refreshVersion,
        refresh,
        stagePaths,
        unstagePaths,
        discardPaths,
        commit,
    };
}
//# sourceMappingURL=useGitActions.js.map