import { z } from "zod";
export { browserClientModeSchema, browserCommandContextSchema, browserCommandMethodSchema, browserErrorCodeSchema, browserPageStateSchema, } from "./command-metadata.js";
export type { BrowserClientMode, BrowserCommandContext, BrowserCommandMethod, BrowserErrorCode, BrowserPageState, } from "./command-metadata.js";
export declare const browserMouseButtonSchema: z.ZodEnum<{
    left: "left";
    right: "right";
    middle: "middle";
}>;
export type BrowserMouseButton = z.infer<typeof browserMouseButtonSchema>;
/** 键盘修饰键；CDP dispatchMouse/KeyEvent 的 modifiers 位掩码由 executor 映射。 */
export declare const browserKeyModifierSchema: z.ZodEnum<{
    Alt: "Alt";
    Shift: "Shift";
    Control: "Control";
    ControlOrMeta: "ControlOrMeta";
    Meta: "Meta";
}>;
export type BrowserKeyModifier = z.infer<typeof browserKeyModifierSchema>;
/** 视口坐标点（cua 坐标路 / elementInfo / drag 用；与 CDP Input 同坐标系）。 */
export declare const browserPointSchema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
}, z.core.$strict>;
export type BrowserPoint = z.infer<typeof browserPointSchema>;
/** 内置 WebView 录制只接受受限动作 DSL；不能借录制入口执行任意页面脚本。 */
export declare const browserRecordingActionSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"wait">;
    durationMs: z.ZodNumber;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"click">;
    selector: z.ZodOptional<z.ZodString>;
    x: z.ZodOptional<z.ZodNumber>;
    y: z.ZodOptional<z.ZodNumber>;
    button: z.ZodOptional<z.ZodEnum<{
        left: "left";
        right: "right";
        middle: "middle";
    }>>;
    doubleClick: z.ZodOptional<z.ZodBoolean>;
    delayAfterMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"type">;
    selector: z.ZodString;
    text: z.ZodString;
    delayAfterMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"hover">;
    selector: z.ZodOptional<z.ZodString>;
    x: z.ZodOptional<z.ZodNumber>;
    y: z.ZodOptional<z.ZodNumber>;
    durationMs: z.ZodOptional<z.ZodNumber>;
    delayAfterMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"move">;
    x: z.ZodNumber;
    y: z.ZodNumber;
    durationMs: z.ZodOptional<z.ZodNumber>;
    delayAfterMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"scroll">;
    deltaX: z.ZodOptional<z.ZodNumber>;
    deltaY: z.ZodNumber;
    durationMs: z.ZodOptional<z.ZodNumber>;
    delayAfterMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"scrollTo">;
    selector: z.ZodOptional<z.ZodString>;
    x: z.ZodOptional<z.ZodNumber>;
    y: z.ZodOptional<z.ZodNumber>;
    durationMs: z.ZodOptional<z.ZodNumber>;
    delayAfterMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"wheel">;
    deltaX: z.ZodOptional<z.ZodNumber>;
    deltaY: z.ZodNumber;
    times: z.ZodOptional<z.ZodNumber>;
    intervalMs: z.ZodOptional<z.ZodNumber>;
    delayAfterMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"drag">;
    path: z.ZodArray<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strict>>;
    durationMs: z.ZodOptional<z.ZodNumber>;
    delayAfterMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"waitFor">;
    selector: z.ZodString;
    state: z.ZodOptional<z.ZodEnum<{
        visible: "visible";
        hidden: "hidden";
        attached: "attached";
        detached: "detached";
    }>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    delayAfterMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>], "type">;
export type BrowserRecordingAction = z.infer<typeof browserRecordingActionSchema>;
export declare const browserRecordingOptionsSchema: z.ZodObject<{
    viewport: z.ZodOptional<z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, z.core.$strict>>;
    fps: z.ZodOptional<z.ZodNumber>;
    jpegQuality: z.ZodOptional<z.ZodNumber>;
    maxDurationMs: z.ZodOptional<z.ZodNumber>;
    settleMs: z.ZodOptional<z.ZodNumber>;
    showCursor: z.ZodOptional<z.ZodBoolean>;
    actions: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"wait">;
        durationMs: z.ZodNumber;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"click">;
        selector: z.ZodOptional<z.ZodString>;
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
        button: z.ZodOptional<z.ZodEnum<{
            left: "left";
            right: "right";
            middle: "middle";
        }>>;
        doubleClick: z.ZodOptional<z.ZodBoolean>;
        delayAfterMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"type">;
        selector: z.ZodString;
        text: z.ZodString;
        delayAfterMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"hover">;
        selector: z.ZodOptional<z.ZodString>;
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
        durationMs: z.ZodOptional<z.ZodNumber>;
        delayAfterMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"move">;
        x: z.ZodNumber;
        y: z.ZodNumber;
        durationMs: z.ZodOptional<z.ZodNumber>;
        delayAfterMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"scroll">;
        deltaX: z.ZodOptional<z.ZodNumber>;
        deltaY: z.ZodNumber;
        durationMs: z.ZodOptional<z.ZodNumber>;
        delayAfterMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"scrollTo">;
        selector: z.ZodOptional<z.ZodString>;
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
        durationMs: z.ZodOptional<z.ZodNumber>;
        delayAfterMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"wheel">;
        deltaX: z.ZodOptional<z.ZodNumber>;
        deltaY: z.ZodNumber;
        times: z.ZodOptional<z.ZodNumber>;
        intervalMs: z.ZodOptional<z.ZodNumber>;
        delayAfterMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"drag">;
        path: z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, z.core.$strict>>;
        durationMs: z.ZodOptional<z.ZodNumber>;
        delayAfterMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"waitFor">;
        selector: z.ZodString;
        state: z.ZodOptional<z.ZodEnum<{
            visible: "visible";
            hidden: "hidden";
            attached: "attached";
            detached: "detached";
        }>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        delayAfterMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>], "type">>>;
}, z.core.$strict>;
export type BrowserRecordingOptions = z.infer<typeof browserRecordingOptionsSchema>;
/** Playwright locator 的可跨进程终结操作。builder 本身只在 agent 内组合 selector。 */
export declare const browserPlaywrightLocatorOperationSchema: z.ZodEnum<{
    fill: "fill";
    click: "click";
    press: "press";
    evaluate: "evaluate";
    waitFor: "waitFor";
    count: "count";
    allTextContents: "allTextContents";
    dblclick: "dblclick";
    downloadMedia: "downloadMedia";
    getAttribute: "getAttribute";
    innerText: "innerText";
    isEnabled: "isEnabled";
    isVisible: "isVisible";
    selectOption: "selectOption";
    setChecked: "setChecked";
    textContent: "textContent";
}>;
export type BrowserPlaywrightLocatorOperation = z.infer<typeof browserPlaywrightLocatorOperationSchema>;
export declare const browserPlaywrightModifierSchema: z.ZodEnum<{
    Alt: "Alt";
    Shift: "Shift";
    Control: "Control";
    ControlOrMeta: "ControlOrMeta";
    Meta: "Meta";
}>;
export type BrowserPlaywrightModifier = z.infer<typeof browserPlaywrightModifierSchema>;
/**
 * Playwright 公共操作使用与 backend 无关的消息结构，以 `name` 和 `operation` 区分动作，
 * 便于 extension/CDP adapter 复用同一契约。
 */
export declare const browserPlaywrightActionSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    name: z.ZodLiteral<"domSnapshot">;
}, z.core.$strict>, z.ZodObject<{
    name: z.ZodLiteral<"elementInfo">;
    x: z.ZodNumber;
    y: z.ZodNumber;
    includeNonInteractable: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>, z.ZodObject<{
    name: z.ZodLiteral<"elementScreenshot">;
    x: z.ZodNumber;
    y: z.ZodNumber;
    includeNonInteractable: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>, z.ZodObject<{
    name: z.ZodLiteral<"evaluate">;
    expression: z.ZodString;
    expressionKind: z.ZodEnum<{
        string: "string";
        function: "function";
    }>;
    arg: z.ZodOptional<z.ZodUnknown>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodObject<{
    name: z.ZodLiteral<"waitForLoadState">;
    state: z.ZodOptional<z.ZodEnum<{
        load: "load";
        domcontentloaded: "domcontentloaded";
        networkidle: "networkidle";
    }>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodObject<{
    name: z.ZodLiteral<"waitForURL">;
    url: z.ZodString;
    waitUntil: z.ZodOptional<z.ZodEnum<{
        load: "load";
        domcontentloaded: "domcontentloaded";
        networkidle: "networkidle";
        commit: "commit";
    }>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodObject<{
    name: z.ZodLiteral<"waitForEvent">;
    event: z.ZodEnum<{
        download: "download";
        filechooser: "filechooser";
    }>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodObject<{
    name: z.ZodLiteral<"downloadPath">;
    downloadId: z.ZodString;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodObject<{
    name: z.ZodLiteral<"fileChooserSetFiles">;
    fileChooserId: z.ZodString;
    files: z.ZodArray<z.ZodString>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodObject<{
    name: z.ZodLiteral<"locator">;
    selector: z.ZodString;
    operation: z.ZodEnum<{
        fill: "fill";
        click: "click";
        press: "press";
        evaluate: "evaluate";
        waitFor: "waitFor";
        count: "count";
        allTextContents: "allTextContents";
        dblclick: "dblclick";
        downloadMedia: "downloadMedia";
        getAttribute: "getAttribute";
        innerText: "innerText";
        isEnabled: "isEnabled";
        isVisible: "isVisible";
        selectOption: "selectOption";
        setChecked: "setChecked";
        textContent: "textContent";
    }>;
    value: z.ZodOptional<z.ZodUnknown>;
    arg: z.ZodOptional<z.ZodUnknown>;
    expression: z.ZodOptional<z.ZodString>;
    expressionKind: z.ZodOptional<z.ZodEnum<{
        string: "string";
        function: "function";
    }>>;
    attribute: z.ZodOptional<z.ZodString>;
    checked: z.ZodOptional<z.ZodBoolean>;
    replace: z.ZodOptional<z.ZodBoolean>;
    force: z.ZodOptional<z.ZodBoolean>;
    button: z.ZodOptional<z.ZodEnum<{
        left: "left";
        right: "right";
        middle: "middle";
    }>>;
    modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        Alt: "Alt";
        Shift: "Shift";
        Control: "Control";
        ControlOrMeta: "ControlOrMeta";
        Meta: "Meta";
    }>>>;
    state: z.ZodOptional<z.ZodEnum<{
        visible: "visible";
        hidden: "hidden";
        attached: "attached";
        detached: "detached";
    }>>;
    selections: z.ZodOptional<z.ZodArray<z.ZodObject<{
        value: z.ZodOptional<z.ZodString>;
        label: z.ZodOptional<z.ZodString>;
        index: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>], "name">;
export type BrowserPlaywrightAction = z.infer<typeof browserPlaywrightActionSchema>;
/**
 * 统一命令面：后端只认这一个判别联合类型。
 *
 * tabId（可选）：agent 对象模型用于寻址指定受控 tab（含 human 开的 tab）。缺省表示作用于
 * 该会话默认 view。manager 侧以 `command.tabId ?? key` 解析为受控 view 的 key。
 */
export declare const browserCommandSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    method: z.ZodLiteral<"navigate">;
    url: z.ZodString;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"back">;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"forward">;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"reload">;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"snapshot">;
    maxElements: z.ZodOptional<z.ZodNumber>;
    includeHidden: z.ZodOptional<z.ZodBoolean>;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"click">;
    ref: z.ZodOptional<z.ZodString>;
    x: z.ZodOptional<z.ZodNumber>;
    y: z.ZodOptional<z.ZodNumber>;
    button: z.ZodOptional<z.ZodEnum<{
        left: "left";
        right: "right";
        middle: "middle";
    }>>;
    doubleClick: z.ZodOptional<z.ZodBoolean>;
    modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        Alt: "Alt";
        Shift: "Shift";
        Control: "Control";
        ControlOrMeta: "ControlOrMeta";
        Meta: "Meta";
    }>>>;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"fill">;
    ref: z.ZodString;
    value: z.ZodString;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"type">;
    ref: z.ZodOptional<z.ZodString>;
    text: z.ZodString;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"press">;
    key: z.ZodString;
    ref: z.ZodOptional<z.ZodString>;
    modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        Alt: "Alt";
        Shift: "Shift";
        Control: "Control";
        ControlOrMeta: "ControlOrMeta";
        Meta: "Meta";
    }>>>;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"cuaKeypress">;
    keys: z.ZodArray<z.ZodString>;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"scroll">;
    ref: z.ZodOptional<z.ZodString>;
    x: z.ZodOptional<z.ZodNumber>;
    y: z.ZodOptional<z.ZodNumber>;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"cuaScroll">;
    x: z.ZodNumber;
    y: z.ZodNumber;
    scrollX: z.ZodNumber;
    scrollY: z.ZodNumber;
    modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        Alt: "Alt";
        Shift: "Shift";
        Control: "Control";
        ControlOrMeta: "ControlOrMeta";
        Meta: "Meta";
    }>>>;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"domCuaScroll">;
    nodeId: z.ZodOptional<z.ZodString>;
    scrollX: z.ZodNumber;
    scrollY: z.ZodNumber;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"screenshot">;
    ref: z.ZodOptional<z.ZodString>;
    fullPage: z.ZodOptional<z.ZodBoolean>;
    clip: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, z.core.$strict>>;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"getState">;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"hover">;
    ref: z.ZodOptional<z.ZodString>;
    x: z.ZodOptional<z.ZodNumber>;
    y: z.ZodOptional<z.ZodNumber>;
    modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        Alt: "Alt";
        Shift: "Shift";
        Control: "Control";
        ControlOrMeta: "ControlOrMeta";
        Meta: "Meta";
    }>>>;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"select">;
    ref: z.ZodString;
    values: z.ZodArray<z.ZodString>;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"check">;
    ref: z.ZodString;
    checked: z.ZodOptional<z.ZodBoolean>;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"drag">;
    fromRef: z.ZodOptional<z.ZodString>;
    toRef: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strict>>;
    to: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strict>>;
    modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        Alt: "Alt";
        Shift: "Shift";
        Control: "Control";
        ControlOrMeta: "ControlOrMeta";
        Meta: "Meta";
    }>>>;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"cuaDrag">;
    path: z.ZodArray<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strict>>;
    modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        Alt: "Alt";
        Shift: "Shift";
        Control: "Control";
        ControlOrMeta: "ControlOrMeta";
        Meta: "Meta";
    }>>>;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"elementInfo">;
    x: z.ZodNumber;
    y: z.ZodNumber;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"evaluate">;
    expression: z.ZodString;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"getDialog">;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"handleDialog">;
    accept: z.ZodBoolean;
    promptText: z.ZodOptional<z.ZodString>;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"waitFor">;
    selector: z.ZodOptional<z.ZodString>;
    text: z.ZodOptional<z.ZodString>;
    textGone: z.ZodOptional<z.ZodString>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"playwrightWaitForTimeout">;
    timeoutMs: z.ZodNumber;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"playwright">;
    action: z.ZodDiscriminatedUnion<[z.ZodObject<{
        name: z.ZodLiteral<"domSnapshot">;
    }, z.core.$strict>, z.ZodObject<{
        name: z.ZodLiteral<"elementInfo">;
        x: z.ZodNumber;
        y: z.ZodNumber;
        includeNonInteractable: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>, z.ZodObject<{
        name: z.ZodLiteral<"elementScreenshot">;
        x: z.ZodNumber;
        y: z.ZodNumber;
        includeNonInteractable: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>, z.ZodObject<{
        name: z.ZodLiteral<"evaluate">;
        expression: z.ZodString;
        expressionKind: z.ZodEnum<{
            string: "string";
            function: "function";
        }>;
        arg: z.ZodOptional<z.ZodUnknown>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        name: z.ZodLiteral<"waitForLoadState">;
        state: z.ZodOptional<z.ZodEnum<{
            load: "load";
            domcontentloaded: "domcontentloaded";
            networkidle: "networkidle";
        }>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        name: z.ZodLiteral<"waitForURL">;
        url: z.ZodString;
        waitUntil: z.ZodOptional<z.ZodEnum<{
            load: "load";
            domcontentloaded: "domcontentloaded";
            networkidle: "networkidle";
            commit: "commit";
        }>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        name: z.ZodLiteral<"waitForEvent">;
        event: z.ZodEnum<{
            download: "download";
            filechooser: "filechooser";
        }>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        name: z.ZodLiteral<"downloadPath">;
        downloadId: z.ZodString;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        name: z.ZodLiteral<"fileChooserSetFiles">;
        fileChooserId: z.ZodString;
        files: z.ZodArray<z.ZodString>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        name: z.ZodLiteral<"locator">;
        selector: z.ZodString;
        operation: z.ZodEnum<{
            fill: "fill";
            click: "click";
            press: "press";
            evaluate: "evaluate";
            waitFor: "waitFor";
            count: "count";
            allTextContents: "allTextContents";
            dblclick: "dblclick";
            downloadMedia: "downloadMedia";
            getAttribute: "getAttribute";
            innerText: "innerText";
            isEnabled: "isEnabled";
            isVisible: "isVisible";
            selectOption: "selectOption";
            setChecked: "setChecked";
            textContent: "textContent";
        }>;
        value: z.ZodOptional<z.ZodUnknown>;
        arg: z.ZodOptional<z.ZodUnknown>;
        expression: z.ZodOptional<z.ZodString>;
        expressionKind: z.ZodOptional<z.ZodEnum<{
            string: "string";
            function: "function";
        }>>;
        attribute: z.ZodOptional<z.ZodString>;
        checked: z.ZodOptional<z.ZodBoolean>;
        replace: z.ZodOptional<z.ZodBoolean>;
        force: z.ZodOptional<z.ZodBoolean>;
        button: z.ZodOptional<z.ZodEnum<{
            left: "left";
            right: "right";
            middle: "middle";
        }>>;
        modifiers: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            Alt: "Alt";
            Shift: "Shift";
            Control: "Control";
            ControlOrMeta: "ControlOrMeta";
            Meta: "Meta";
        }>>>;
        state: z.ZodOptional<z.ZodEnum<{
            visible: "visible";
            hidden: "hidden";
            attached: "attached";
            detached: "detached";
        }>>;
        selections: z.ZodOptional<z.ZodArray<z.ZodObject<{
            value: z.ZodOptional<z.ZodString>;
            label: z.ZodOptional<z.ZodString>;
            index: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>], "name">;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"capabilities">;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"browserVisibilityGet">;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"browserVisibilitySet">;
    visible: z.ZodBoolean;
}, z.core.$strict>, z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
    method: z.ZodLiteral<"browserViewportSet">;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"browserViewportReset">;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"recordingStart">;
    options: z.ZodOptional<z.ZodObject<{
        viewport: z.ZodOptional<z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strict>>;
        fps: z.ZodOptional<z.ZodNumber>;
        jpegQuality: z.ZodOptional<z.ZodNumber>;
        maxDurationMs: z.ZodOptional<z.ZodNumber>;
        settleMs: z.ZodOptional<z.ZodNumber>;
        showCursor: z.ZodOptional<z.ZodBoolean>;
        actions: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"wait">;
            durationMs: z.ZodNumber;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"click">;
            selector: z.ZodOptional<z.ZodString>;
            x: z.ZodOptional<z.ZodNumber>;
            y: z.ZodOptional<z.ZodNumber>;
            button: z.ZodOptional<z.ZodEnum<{
                left: "left";
                right: "right";
                middle: "middle";
            }>>;
            doubleClick: z.ZodOptional<z.ZodBoolean>;
            delayAfterMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"type">;
            selector: z.ZodString;
            text: z.ZodString;
            delayAfterMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"hover">;
            selector: z.ZodOptional<z.ZodString>;
            x: z.ZodOptional<z.ZodNumber>;
            y: z.ZodOptional<z.ZodNumber>;
            durationMs: z.ZodOptional<z.ZodNumber>;
            delayAfterMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"move">;
            x: z.ZodNumber;
            y: z.ZodNumber;
            durationMs: z.ZodOptional<z.ZodNumber>;
            delayAfterMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"scroll">;
            deltaX: z.ZodOptional<z.ZodNumber>;
            deltaY: z.ZodNumber;
            durationMs: z.ZodOptional<z.ZodNumber>;
            delayAfterMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"scrollTo">;
            selector: z.ZodOptional<z.ZodString>;
            x: z.ZodOptional<z.ZodNumber>;
            y: z.ZodOptional<z.ZodNumber>;
            durationMs: z.ZodOptional<z.ZodNumber>;
            delayAfterMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"wheel">;
            deltaX: z.ZodOptional<z.ZodNumber>;
            deltaY: z.ZodNumber;
            times: z.ZodOptional<z.ZodNumber>;
            intervalMs: z.ZodOptional<z.ZodNumber>;
            delayAfterMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"drag">;
            path: z.ZodArray<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strict>>;
            durationMs: z.ZodOptional<z.ZodNumber>;
            delayAfterMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"waitFor">;
            selector: z.ZodString;
            state: z.ZodOptional<z.ZodEnum<{
                visible: "visible";
                hidden: "hidden";
                attached: "attached";
                detached: "detached";
            }>>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            delayAfterMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>], "type">>>;
    }, z.core.$strict>>;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"recordingStatus">;
    recordingId: z.ZodString;
    outputPath: z.ZodOptional<z.ZodString>;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"recordingCancel">;
    recordingId: z.ZodString;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"activateTab">;
    tabId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"newTab">;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"listUserTabs">;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"claimTab">;
    tabId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"finalizeTabs">;
    keep: z.ZodArray<z.ZodObject<{
        tabId: z.ZodString;
        status: z.ZodEnum<{
            handoff: "handoff";
            deliverable: "deliverable";
        }>;
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"markDeliverable">;
    tabId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"markHandoff">;
    tabId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"nameSession">;
    name: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"finalize">;
    tabId: z.ZodOptional<z.ZodString>;
    deliverable: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"turnEnded">;
    turnId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"closeSession">;
    closeTabs: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"cancelRequest">;
    requestId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"close">;
    tabId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    method: z.ZodLiteral<"list">;
}, z.core.$strict>], "method">;
export type BrowserCommand = z.infer<typeof browserCommandSchema>;
//# sourceMappingURL=commands.d.ts.map