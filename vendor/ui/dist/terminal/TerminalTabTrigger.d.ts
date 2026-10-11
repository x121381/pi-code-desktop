import type { TerminalSessionDescriptor } from "@/terminal/terminalPanelState.js";
export declare function TerminalTabTrigger({ session, title, closeLabel, isActive, onClose, }: {
    session: TerminalSessionDescriptor;
    title: string;
    closeLabel: string;
    isActive: boolean;
    onClose: (sessionId: string) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=TerminalTabTrigger.d.ts.map