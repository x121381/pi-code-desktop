import type { Event } from "@zcode/rpc";
import type { GenUiDocument, GenUiScope, GenUiStateChange, GenUiStateEntry, GenUiStateTarget, GenUiWidgetState } from "@zcode/shared/gen-ui";
import type { PluginSandboxHandle } from "@zcode/shared/mcp-apps";
export interface GenUiPrepareParams extends GenUiStateTarget {
    html: string;
    ownerWebContentsId: number;
    instanceKey: string;
}
/** readDocument runs on the executor Host. State and sandbox methods run on desktop base services. */
export interface IGenUiService {
    readDocument(target: GenUiStateTarget): Promise<GenUiDocument>;
    prepareSandbox(input: GenUiPrepareParams): Promise<PluginSandboxHandle>;
    getState(target: GenUiStateTarget): Promise<GenUiWidgetState | null>;
    setState(input: {
        target: GenUiStateTarget;
        state: GenUiWidgetState;
    }): Promise<void>;
    listState(scope: GenUiScope): Promise<GenUiStateEntry[]>;
    onStateChanged: Event<GenUiStateChange>;
}
export declare const IGenUiService: import("../descriptors.js").ServiceDescriptor<IGenUiService>;
//# sourceMappingURL=contract.d.ts.map