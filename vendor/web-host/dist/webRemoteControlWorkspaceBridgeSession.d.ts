import type { WebRemoteControlExternalWorkspaceBridge, WebRemoteControlWorkspaceBridge } from "@zcode/shared";
import { type RemoteWorkspaceSession } from "@zcode/ui/remote-workspace-session-store";
type WebRemoteControlBridgeWithRemoteSession = WebRemoteControlExternalWorkspaceBridge | WebRemoteControlWorkspaceBridge;
export interface WebRemoteControlWorkspaceBridgeServiceRegistration {
    dispose: () => void;
}
export declare function registerWebRemoteControlWorkspaceBridgeServices(params: {
    bridge: WebRemoteControlBridgeWithRemoteSession;
    services: RemoteWorkspaceSession["services"];
}): WebRemoteControlWorkspaceBridgeServiceRegistration;
export {};
