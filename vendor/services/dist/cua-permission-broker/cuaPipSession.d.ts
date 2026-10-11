import type { PipSessionEvent } from "@zcode/zcode-cua/pip-session";
type FocusEvent = Extract<PipSessionEvent, {
    kind: "focus-changed";
}>;
type LifecycleEvent = Exclude<PipSessionEvent, FocusEvent>;
export interface CuaPipSessionService {
    publishFocus(event: FocusEvent): Promise<void>;
    publishLifecycle(event: LifecycleEvent): Promise<void>;
    dispose(): void;
}
export declare const ICuaPipSessionService: import("../descriptors.js").ServiceDescriptor<CuaPipSessionService>;
export {};
//# sourceMappingURL=cuaPipSession.d.ts.map