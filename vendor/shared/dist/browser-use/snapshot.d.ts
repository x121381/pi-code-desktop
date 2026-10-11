import { z } from "zod";
export declare const browserElementRectSchema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
    width: z.ZodNumber;
    height: z.ZodNumber;
}, z.core.$strict>;
export type BrowserElementRect = z.infer<typeof browserElementRectSchema>;
/**
 * 单个可交互元素的快照条目，以 role、name、ref 提供定位信息，避免转储整页 DOM。
 * ref 为按 DOM 序分配的稳定引用（e1, e2, ...），后续 action 用 ref 定位。
 */
export declare const browserSnapshotElementSchema: z.ZodObject<{
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
}, z.core.$strict>;
export type BrowserSnapshotElement = z.infer<typeof browserSnapshotElementSchema>;
/**
 * 可见语义 DOM 节点。它只负责“读懂页面”，可动作句柄仍由 elements/ref 单独维护，
 * 防止正文节点占满 action ref 预算。ref 仅在该语义节点同时属于 elements 时存在。
 */
export declare const browserSnapshotDomNodeSchema: z.ZodObject<{
    tag: z.ZodString;
    depth: z.ZodNumber;
    inViewport: z.ZodBoolean;
    ref: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    text: z.ZodOptional<z.ZodString>;
    attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$strict>;
export type BrowserSnapshotDomNode = z.infer<typeof browserSnapshotDomNodeSchema>;
export declare const browserSnapshotSchema: z.ZodObject<{
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
}, z.core.$strict>;
export type BrowserSnapshot = z.infer<typeof browserSnapshotSchema>;
//# sourceMappingURL=snapshot.d.ts.map