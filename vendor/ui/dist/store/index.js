/**
 * Zustand Store —— 全局状态管理
 *
 * 需要跨窗口同步的状态通过 BroadcastService 广播。
 * 广播频道前缀 "state:" 表示状态同步类消息。
 */
import { create } from "zustand";
import { applyCodingPlanQuotaResetAutoPlayedBroadcast, createCodingPlanQuotaResetStoreActions, parseCodingPlanQuotaResetAutoPlayedBroadcastMessage, } from "@/store/codingPlanQuotaResetState.js";
import { DEFAULT_CODE_PREVIEW_SETTINGS } from "@/lib/codePreviewSettings.js";
import { readSafeLocalStorage, writeSafeLocalStorage } from "@/lib/browserEnvironment.js";
import { applyUiFontSizePx, loadUiFontSizePx, normalizeUiFontSizePx, UI_FONT_SIZE_STORAGE_KEY, } from "@/lib/uiFontSize.js";
import { isTaskNotificationEnabled, isTaskNotificationSoundPreferenceEnabled, persistTaskNotificationEnabled, persistTaskNotificationSoundEnabled, } from "@/lib/taskNotificationPreferences.js";
import { applyTheme, normalizeThemePreference, resolveTheme } from "../useTheme.js";
import { INTERFACE_MODE_STORAGE_KEY, normalizeInterfaceMode, } from "@/lib/interfaceMode.js";
import { logger } from "@/logger.js";
export { DEFAULT_CODE_PREVIEW_SETTINGS } from "@/lib/codePreviewSettings.js";
const CODE_PREVIEW_SETTINGS_KEY = "zcode-code-preview-settings";
const PERFORMANCE_MODE_STORAGE_KEY = "zcode-performance-mode";
function loadCodePreviewSettings() {
    try {
        const raw = readSafeLocalStorage(CODE_PREVIEW_SETTINGS_KEY);
        if (!raw) {
            return DEFAULT_CODE_PREVIEW_SETTINGS;
        }
        const parsed = JSON.parse(raw);
        return {
            ...DEFAULT_CODE_PREVIEW_SETTINGS,
            ...parsed,
            fontSizePx: typeof parsed.fontSizePx === "number"
                ? Math.min(20, Math.max(12, Math.round(parsed.fontSizePx)))
                : DEFAULT_CODE_PREVIEW_SETTINGS.fontSizePx,
        };
    }
    catch {
        return DEFAULT_CODE_PREVIEW_SETTINGS;
    }
}
function loadPerformanceMode() {
    return readSafeLocalStorage(PERFORMANCE_MODE_STORAGE_KEY) === "true";
}
// ============================================================================
// 需要广播的字段 —— 只有这些字段的变更会发送给其他窗口
// ============================================================================
const BROADCAST_FIELDS = new Set(["theme", "locale", "uiFontSizePx", "interfaceMode"]);
/** 广播频道名前缀 */
const STATE_CHANNEL_PREFIX = "state:";
// ============================================================================
// Store 创建工厂
// ============================================================================
/**
 * 创建 Zustand store，连接广播服务实现跨窗口状态同步
 *
 * @param broadcastService - 广播服务。Desktop 走 RPC，Web 可传 no-op 实现
 */
export function createZCodeStore(broadcastService, options = {}) {
    /** 标记：正在应用来自广播的更新，此时不再重复广播（防止循环） */
    let applyingBroadcast = false;
    let loginEntryRequestSeq = 0;
    let cleanupSystemThemeListener = null;
    let syncSystemThemeListener = (_theme) => { };
    const useStore = create()((set, get) => ({
        interfaceMode: normalizeInterfaceMode(readSafeLocalStorage(INTERFACE_MODE_STORAGE_KEY)),
        setInterfaceMode: (mode) => {
            const interfaceMode = normalizeInterfaceMode(mode);
            if (get().interfaceMode !== interfaceMode) {
                logger.debug("[InterfaceMode] 切换界面模式", {
                    interfaceMode,
                    source: applyingBroadcast ? "broadcast" : "local",
                });
            }
            writeSafeLocalStorage(INTERFACE_MODE_STORAGE_KEY, interfaceMode);
            set({ interfaceMode });
        },
        // 默认主题统一收敛到 Zai dark，避免首次启动时 store 与其他主题入口表现不一致。
        // 仍然优先尊重 localStorage 中已保存的用户选择，不覆盖已有偏好。
        theme: normalizeThemePreference(readSafeLocalStorage("zcode-theme") || "zai-dark"),
        setTheme: (theme) => {
            const normalizedTheme = normalizeThemePreference(theme);
            writeSafeLocalStorage("zcode-theme", normalizedTheme);
            syncSystemThemeListener(normalizedTheme);
            applyTheme(normalizedTheme);
            set({ theme: normalizedTheme });
        },
        locale: readSafeLocalStorage("zcode-locale") || "zh-CN",
        setLocale: (locale) => {
            writeSafeLocalStorage("zcode-locale", locale);
            set({ locale });
        },
        codePreviewSettings: loadCodePreviewSettings(),
        setCodePreviewSettings: (patch) => set((state) => {
            const next = {
                ...state.codePreviewSettings,
                ...patch,
                fontSizePx: typeof patch.fontSizePx === "number"
                    ? Math.min(20, Math.max(12, Math.round(patch.fontSizePx)))
                    : state.codePreviewSettings.fontSizePx,
            };
            writeSafeLocalStorage(CODE_PREVIEW_SETTINGS_KEY, JSON.stringify(next));
            return { codePreviewSettings: next };
        }),
        uiFontSizePx: loadUiFontSizePx(),
        setUiFontSizePx: (fontSizePx) => {
            const normalizedFontSizePx = normalizeUiFontSizePx(fontSizePx);
            writeSafeLocalStorage(UI_FONT_SIZE_STORAGE_KEY, String(normalizedFontSizePx));
            applyUiFontSizePx(normalizedFontSizePx);
            set({ uiFontSizePx: normalizedFontSizePx });
        },
        performanceMode: loadPerformanceMode(),
        setPerformanceMode: (enabled) => {
            writeSafeLocalStorage(PERFORMANCE_MODE_STORAGE_KEY, enabled ? "true" : "false");
            set({ performanceMode: enabled });
        },
        notificationEnabled: isTaskNotificationEnabled(),
        setNotificationEnabled: (enabled) => {
            persistTaskNotificationEnabled(enabled);
            set({ notificationEnabled: enabled });
        },
        notificationSoundEnabled: isTaskNotificationSoundPreferenceEnabled(),
        setNotificationSoundEnabled: (enabled) => {
            persistTaskNotificationSoundEnabled(enabled);
            set({ notificationSoundEnabled: enabled });
        },
        user: null,
        authSessionSeq: 0,
        setUser: (user) => set((state) => ({
            user,
            authSessionSeq: state.user === null && user !== null ? state.authSessionSeq + 1 : state.authSessionSeq,
        })),
        isRestoringOAuthSession: options.initialIsRestoringOAuthSession ?? false,
        setIsRestoringOAuthSession: (restoring) => set({ isRestoringOAuthSession: restoring }),
        oauthError: null,
        setOAuthError: (error) => set({ oauthError: error }),
        oauthPollingActive: false,
        setOAuthPollingActive: (active) => set({ oauthPollingActive: active }),
        oauthSuccessSeq: 0,
        lastOAuthSuccessProvider: null,
        markOAuthSuccess: (provider) => set((state) => ({
            oauthSuccessSeq: state.oauthSuccessSeq + 1,
            lastOAuthSuccessProvider: provider ?? state.lastOAuthSuccessProvider,
        })),
        apiKeyLoginSuccessSeq: 0,
        lastApiKeyLoginModel: null,
        markApiKeyLoginSuccess: (preferredModel) => set((state) => ({
            apiKeyLoginSuccessSeq: state.apiKeyLoginSuccessSeq + 1,
            lastApiKeyLoginModel: preferredModel?.trim() || null,
        })),
        loginEntryRequest: null,
        loginEntryAttempt: null,
        requestLoginEntry: (providerId, purpose) => {
            const id = ++loginEntryRequestSeq;
            const attempt = {
                id,
                providerId,
                purpose,
                status: "requested",
            };
            set({
                loginEntryRequest: {
                    id,
                    providerId,
                    purpose,
                },
                loginEntryAttempt: attempt,
            });
            return id;
        },
        clearLoginEntryRequest: (requestId) => set((state) => {
            if (requestId !== undefined && state.loginEntryRequest?.id !== requestId) {
                return {};
            }
            return { loginEntryRequest: null };
        }),
        markLoginEntryAttemptStatus: (requestId, status) => set((state) => {
            if (state.loginEntryAttempt?.id !== requestId) {
                return {};
            }
            return {
                loginEntryAttempt: {
                    ...state.loginEntryAttempt,
                    status,
                },
            };
        }),
        codingPlanQuotaResetUiBySource: {},
        codingPlanQuotaResetAutomaticObservationsBySource: {},
        codingPlanQuotaResetAutoPlayedBySource: {},
        ...createCodingPlanQuotaResetStoreActions({
            broadcastService,
            readState: get,
            writeState: (updater) => set((state) => updater(state)),
        }),
        newUserOnboardingOpen: false,
        setNewUserOnboardingOpen: (open) => set({ newUserOnboardingOpen: open }),
        onboardingDialogRequested: false,
        requestOnboardingDialog: (entry) => set({ onboardingDialogRequested: entry ?? true }),
        clearOnboardingDialogRequest: () => set({ onboardingDialogRequested: false }),
    }));
    syncSystemThemeListener = (theme) => {
        cleanupSystemThemeListener?.();
        cleanupSystemThemeListener = null;
        if (theme !== "system" || typeof window === "undefined") {
            return;
        }
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleSystemThemeChange = () => {
            if (useStore.getState().theme !== "system") {
                return;
            }
            // system 模式需要持续订阅系统亮暗变化，不能只在切换到 system 的瞬间应用一次。
            // 否则用户后续切系统主题时，DOM 上的 dark class 不会同步更新，看起来就像“跟随系统失效”。
            applyTheme("system");
        };
        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", handleSystemThemeChange);
            cleanupSystemThemeListener = () => {
                mediaQuery.removeEventListener("change", handleSystemThemeChange);
            };
            return;
        }
        // 某些 Electron / Chromium 组合仍然只支持旧版 MediaQueryList listener API。
        // 如果这里只调用 addEventListener，system 模式切系统主题时会完全收不到通知。
        mediaQuery.addListener(handleSystemThemeChange);
        cleanupSystemThemeListener = () => {
            mediaQuery.removeListener(handleSystemThemeChange);
        };
    };
    // Zustand v5 的 setState 在 replace=true/false 上使用了不同重载，
    // 之前直接包一层并透传 replace，会在严格类型下落到互不兼容的签名分支。
    // 这里改成订阅状态变化后再广播，只比较真正需要跨窗口同步的字段，逻辑更直观，也避免重载冲突。
    useStore.subscribe((state, prevState) => {
        if (applyingBroadcast) {
            return;
        }
        for (const field of BROADCAST_FIELDS) {
            if (state[field] === prevState[field]) {
                continue;
            }
            broadcastService.send({
                channel: `${STATE_CHANNEL_PREFIX}${field}`,
                payload: state[field],
            });
        }
    });
    // 监听来自其他窗口的广播
    broadcastService.onMessage((msg) => {
        // 自动完成"多窗口只播一次"。其他窗口广播已播 used_at 后，本窗口合并
        // played 记录并收起正在播放的同 used_at 提示；本地回声已在解析阶段被忽略。
        const autoPlayed = parseCodingPlanQuotaResetAutoPlayedBroadcastMessage(msg);
        if (autoPlayed) {
            useStore.setState((state) => applyCodingPlanQuotaResetAutoPlayedBroadcast(state, autoPlayed));
            return;
        }
        if (!msg.channel.startsWith(STATE_CHANNEL_PREFIX))
            return;
        const field = msg.channel.slice(STATE_CHANNEL_PREFIX.length);
        if (!BROADCAST_FIELDS.has(field))
            return;
        applyingBroadcast = true;
        try {
            // 调用对应的 setter，确保副作用（localStorage、DOM）也执行
            const state = useStore.getState();
            if (field === "theme" && typeof msg.payload === "string") {
                state.setTheme(msg.payload);
            }
            else if (field === "locale" && typeof msg.payload === "string") {
                state.setLocale(msg.payload);
            }
            else if (field === "interfaceMode" &&
                (msg.payload === "office" || msg.payload === "coding")) {
                state.setInterfaceMode(normalizeInterfaceMode(msg.payload));
            }
            else if (field === "uiFontSizePx" && typeof msg.payload === "number") {
                state.setUiFontSizePx(msg.payload);
            }
        }
        finally {
            applyingBroadcast = false;
        }
    });
    syncSystemThemeListener(useStore.getState().theme);
    applyTheme(useStore.getState().theme);
    applyUiFontSizePx(useStore.getState().uiFontSizePx);
    document.documentElement.classList.toggle("dark", resolveTheme(useStore.getState().theme) === "dark");
    return useStore;
}
//# sourceMappingURL=index.js.map