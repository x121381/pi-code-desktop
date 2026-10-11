import type { Locale, UserInfo } from "@zcode/shared";
import { type ReactNode } from "react";
import type { Theme } from "@/useTheme.js";
import { WorkspaceSidebarFooterUsageSummaryContent } from "@/WorkspaceSidebarFooterUsageSummary.js";
export declare const WorkspaceSidebarFooter: import("react").MemoExoticComponent<({ theme, localeMenuValue, onLocaleChange, onThemeChange, onSettingsButtonClick, onUsageClick, onUpgradeClick, onLogin, onLogout, settingsButtonMode, user, workspacePath, workspaceIdentity, workspaceRemoteSessionId, activeTaskId, isDesktop, banner, className, }: {
    theme: Theme;
    localeMenuValue: Locale | "system";
    onLocaleChange: (value: string) => void;
    onThemeChange: (value: string) => void;
    onSettingsButtonClick?: () => void;
    onUsageClick?: () => void;
    onUpgradeClick?: Parameters<typeof WorkspaceSidebarFooterUsageSummaryContent>[0]["onUpgradeClick"];
    onLogin?: () => void;
    onLogout?: () => void;
    settingsButtonMode?: "settings" | "back";
    user?: UserInfo | null;
    workspacePath?: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
    activeTaskId?: string | null;
    isDesktop?: boolean;
    banner?: ReactNode;
    className?: string;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=WorkspaceSidebarFooter.d.ts.map