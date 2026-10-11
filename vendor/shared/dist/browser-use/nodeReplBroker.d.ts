import { z } from "zod";
export declare const NODE_REPL_BROWSER_BROKER_SOCKET_ENV = "ZCODE_NODE_REPL_BROWSER_BROKER_SOCKET";
export declare const NODE_REPL_BROWSER_BROKER_TOKEN_ENV = "ZCODE_NODE_REPL_BROWSER_BROKER_TOKEN";
export declare const nodeReplBrowserBrokerRequestSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    id: z.ZodString;
    runtimeScope: z.ZodEnum<{
        subagent: "subagent";
        main: "main";
    }>;
    token: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    trace: z.ZodOptional<z.ZodObject<{
        traceId: z.ZodString;
        spanId: z.ZodOptional<z.ZodString>;
        parentSpanId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    op: z.ZodLiteral<"list">;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodString;
    runtimeScope: z.ZodEnum<{
        subagent: "subagent";
        main: "main";
    }>;
    token: z.ZodString;
    sessionId: z.ZodString;
    turnId: z.ZodOptional<z.ZodString>;
    trace: z.ZodOptional<z.ZodObject<{
        traceId: z.ZodString;
        spanId: z.ZodOptional<z.ZodString>;
        parentSpanId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    op: z.ZodLiteral<"execute">;
    browserId: z.ZodString;
    browserGeneration: z.ZodNumber;
    command: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strict>], "op">;
export type NodeReplBrowserBrokerRequest = z.infer<typeof nodeReplBrowserBrokerRequestSchema>;
export declare const nodeReplBrowserBrokerResponseSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    id: z.ZodString;
    ok: z.ZodLiteral<true>;
    browsers: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        generation: z.ZodDefault<z.ZodNumber>;
        type: z.ZodEnum<{
            iab: "iab";
            extension: "extension";
            cdp: "cdp";
        }>;
        name: z.ZodString;
        capabilities: z.ZodObject<{
            browser: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                description: z.ZodString;
            }, z.core.$strict>>>;
            tab: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                description: z.ZodString;
            }, z.core.$strict>>>;
        }, z.core.$strict>;
        apiSupportOverrides: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$strict>>>;
    result: z.ZodOptional<z.ZodObject<{
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
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodString;
    ok: z.ZodLiteral<false>;
    error: z.ZodString;
}, z.core.$strict>], "ok">;
export type NodeReplBrowserBrokerResponse = z.infer<typeof nodeReplBrowserBrokerResponseSchema>;
//# sourceMappingURL=nodeReplBroker.d.ts.map