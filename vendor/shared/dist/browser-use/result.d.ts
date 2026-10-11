import { z } from "zod";
/**
 * 受控 tab 摘要（list 命令返回）：agent 用 tabId 寻址某个具体 tab（含 human 开的 tab）。
 */
export declare const browserTabSummarySchema: z.ZodObject<{
    tabId: z.ZodString;
    url: z.ZodString;
    title: z.ZodString;
    viewport: z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, z.core.$strict>;
    active: z.ZodOptional<z.ZodBoolean>;
    lifecycle: z.ZodOptional<z.ZodEnum<{
        active: "active";
        handoff: "handoff";
        deliverable: "deliverable";
    }>>;
}, z.core.$strict>;
export type BrowserTabSummary = z.infer<typeof browserTabSummarySchema>;
/** 尚未被当前 browser session claim 的用户 IAB tab；claim 前不能执行普通 Tab command。 */
export declare const browserUserTabInfoSchema: z.ZodObject<{
    id: z.ZodString;
    lastOpened: z.ZodOptional<z.ZodString>;
    tabGroup: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type BrowserUserTabInfo = z.infer<typeof browserUserTabInfoSchema>;
/** JS 弹窗信息（getDialog 返回）。 */
export declare const browserDialogSchema: z.ZodObject<{
    type: z.ZodEnum<{
        prompt: "prompt";
        alert: "alert";
        confirm: "confirm";
        beforeunload: "beforeunload";
    }>;
    message: z.ZodString;
    defaultPrompt: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type BrowserDialog = z.infer<typeof browserDialogSchema>;
/** browser command 的 UI/客户端元数据；不会自动变成模型 image block。 */
export declare const browserResponseMetaSchema: z.ZodObject<{
    browserUse: z.ZodLiteral<true>;
    backendType: z.ZodEnum<{
        iab: "iab";
        extension: "extension";
        cdp: "cdp";
    }>;
    browserId: z.ZodString;
    browserGeneration: z.ZodNumber;
    openTabIds: z.ZodArray<z.ZodString>;
    tabId: z.ZodOptional<z.ZodString>;
    currentUrl: z.ZodOptional<z.ZodString>;
    lifecycle: z.ZodOptional<z.ZodEnum<{
        active: "active";
        handoff: "handoff";
        deliverable: "deliverable";
        closed: "closed";
    }>>;
}, z.core.$strict>;
export type BrowserResponseMeta = z.infer<typeof browserResponseMetaSchema>;
export declare const browserRecordingArtifactSchema: z.ZodObject<{
    path: z.ZodString;
    mimeType: z.ZodLiteral<"video/webm">;
    width: z.ZodNumber;
    height: z.ZodNumber;
    fps: z.ZodNumber;
    durationMs: z.ZodNumber;
    frameCount: z.ZodNumber;
}, z.core.$strict>;
export type BrowserRecordingArtifact = z.infer<typeof browserRecordingArtifactSchema>;
export declare const browserRecordingJobSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodEnum<{
        running: "running";
        completed: "completed";
        failed: "failed";
        cancelled: "cancelled";
    }>;
    phase: z.ZodEnum<{
        completed: "completed";
        failed: "failed";
        cancelled: "cancelled";
        preparing: "preparing";
        capturing: "capturing";
        finalizing: "finalizing";
    }>;
    progress: z.ZodNumber;
    startedAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
    artifact: z.ZodOptional<z.ZodObject<{
        path: z.ZodString;
        mimeType: z.ZodLiteral<"video/webm">;
        width: z.ZodNumber;
        height: z.ZodNumber;
        fps: z.ZodNumber;
        durationMs: z.ZodNumber;
        frameCount: z.ZodNumber;
    }, z.core.$strict>>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type BrowserRecordingJob = z.infer<typeof browserRecordingJobSchema>;
/**
 * browser 命令的统一结果（agent BrowserControlPort / 协议 result / main executor 三处同源）。
 * 截图走 image；导航/getState 回 state；snapshot 回 snapshot；list 回 tabs；失败回结构化 error。
 */
export declare const browserCommandResultSchema: z.ZodObject<{
    ok: z.ZodBoolean;
    state: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        title: z.ZodString;
        canGoBack: z.ZodBoolean;
        canGoForward: z.ZodBoolean;
        scrollX: z.ZodOptional<z.ZodNumber>;
        scrollY: z.ZodOptional<z.ZodNumber>;
        viewportWidth: z.ZodOptional<z.ZodNumber>;
        viewportHeight: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    snapshot: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        title: z.ZodString;
        dom: z.ZodOptional<z.ZodArray<z.ZodObject<{
            tag: z.ZodString;
            depth: z.ZodNumber;
            inViewport: z.ZodBoolean;
            ref: z.ZodOptional<z.ZodString>;
            role: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            text: z.ZodOptional<z.ZodString>;
            attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$strict>>>;
        domTruncated: z.ZodOptional<z.ZodBoolean>;
        elements: z.ZodArray<z.ZodObject<{
            ref: z.ZodString;
            tag: z.ZodString;
            role: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            text: z.ZodOptional<z.ZodString>;
            value: z.ZodOptional<z.ZodString>;
            disabled: z.ZodOptional<z.ZodBoolean>;
            checked: z.ZodOptional<z.ZodBoolean>;
            selector: z.ZodString;
            xpath: z.ZodString;
            rect: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                width: z.ZodNumber;
                height: z.ZodNumber;
            }, z.core.$strict>;
            inViewport: z.ZodBoolean;
            parentRef: z.ZodOptional<z.ZodString>;
            framePath: z.ZodOptional<z.ZodString>;
            attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, z.core.$strict>>;
        truncated: z.ZodBoolean;
    }, z.core.$strict>>;
    image: z.ZodOptional<z.ZodObject<{
        base64: z.ZodString;
        mimeType: z.ZodLiteral<"image/png">;
    }, z.core.$strict>>;
    tabs: z.ZodOptional<z.ZodArray<z.ZodObject<{
        tabId: z.ZodString;
        url: z.ZodString;
        title: z.ZodString;
        viewport: z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strict>;
        active: z.ZodOptional<z.ZodBoolean>;
        lifecycle: z.ZodOptional<z.ZodEnum<{
            active: "active";
            handoff: "handoff";
            deliverable: "deliverable";
        }>>;
    }, z.core.$strict>>>;
    userTabs: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        lastOpened: z.ZodOptional<z.ZodString>;
        tabGroup: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>;
    tab: z.ZodOptional<z.ZodObject<{
        tabId: z.ZodString;
        url: z.ZodString;
        title: z.ZodString;
        viewport: z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strict>;
        active: z.ZodOptional<z.ZodBoolean>;
        lifecycle: z.ZodOptional<z.ZodEnum<{
            active: "active";
            handoff: "handoff";
            deliverable: "deliverable";
        }>>;
    }, z.core.$strict>>;
    value: z.ZodOptional<z.ZodUnknown>;
    element: z.ZodOptional<z.ZodObject<{
        ref: z.ZodString;
        tag: z.ZodString;
        role: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        text: z.ZodOptional<z.ZodString>;
        value: z.ZodOptional<z.ZodString>;
        disabled: z.ZodOptional<z.ZodBoolean>;
        checked: z.ZodOptional<z.ZodBoolean>;
        selector: z.ZodString;
        xpath: z.ZodString;
        rect: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strict>;
        inViewport: z.ZodBoolean;
        parentRef: z.ZodOptional<z.ZodString>;
        framePath: z.ZodOptional<z.ZodString>;
        attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$strict>>;
    dialog: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        type: z.ZodEnum<{
            prompt: "prompt";
            alert: "alert";
            confirm: "confirm";
            beforeunload: "beforeunload";
        }>;
        message: z.ZodString;
        defaultPrompt: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>;
    recording: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        status: z.ZodEnum<{
            running: "running";
            completed: "completed";
            failed: "failed";
            cancelled: "cancelled";
        }>;
        phase: z.ZodEnum<{
            completed: "completed";
            failed: "failed";
            cancelled: "cancelled";
            preparing: "preparing";
            capturing: "capturing";
            finalizing: "finalizing";
        }>;
        progress: z.ZodNumber;
        startedAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
        artifact: z.ZodOptional<z.ZodObject<{
            path: z.ZodString;
            mimeType: z.ZodLiteral<"video/webm">;
            width: z.ZodNumber;
            height: z.ZodNumber;
            fps: z.ZodNumber;
            durationMs: z.ZodNumber;
            frameCount: z.ZodNumber;
        }, z.core.$strict>>;
        error: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodEnum<{
            cancelled: "cancelled";
            timeout: "timeout";
            backend_unavailable: "backend_unavailable";
            capability_unsupported: "capability_unsupported";
            duplicate_request_id: "duplicate_request_id";
            ref_not_found: "ref_not_found";
            navigation_blocked: "navigation_blocked";
            renderer_unreachable: "renderer_unreachable";
            execution_error: "execution_error";
        }>;
        message: z.ZodString;
        sideEffect: z.ZodOptional<z.ZodEnum<{
            none: "none";
            uncertain: "uncertain";
        }>>;
    }, z.core.$strict>>;
    meta: z.ZodOptional<z.ZodObject<{
        browserUse: z.ZodLiteral<true>;
        backendType: z.ZodEnum<{
            iab: "iab";
            extension: "extension";
            cdp: "cdp";
        }>;
        browserId: z.ZodString;
        browserGeneration: z.ZodNumber;
        openTabIds: z.ZodArray<z.ZodString>;
        tabId: z.ZodOptional<z.ZodString>;
        currentUrl: z.ZodOptional<z.ZodString>;
        lifecycle: z.ZodOptional<z.ZodEnum<{
            active: "active";
            handoff: "handoff";
            deliverable: "deliverable";
            closed: "closed";
        }>>;
    }, z.core.$strict>>;
    elapsedMs: z.ZodNumber;
}, z.core.$strict>;
export type BrowserCommandResult = z.infer<typeof browserCommandResultSchema>;
//# sourceMappingURL=result.d.ts.map