import { expect, it, vi } from "vitest";
import { RemoteServiceAccess } from "./remoteServiceAccess.js";
it("connects the renderer sampling accessor to the host sampling RPC channel", async () => {
    const call = vi.fn(async (..._args) => ({ cancelled: false }));
    const getChannel = vi.fn((name) => ({
        call: (...args) => call(name, ...args),
        listen: vi.fn(),
    }));
    const access = new RemoteServiceAccess({ getChannel });
    const binding = {
        workspacePath: "/repo",
        sessionId: "task",
        pluginId: "math",
        serverName: "math",
        instance: {
            runtimeId: "agent",
            generation: 1,
            token: "credential",
            appIdentity: "a".repeat(64),
        },
        operationId: "one",
    };
    await access.pluginUiSamplingService.cancelSampling(binding);
    expect(call).toHaveBeenCalledWith("plugin-ui-sampling", "cancelSampling", [binding]);
});
//# sourceMappingURL=remoteServiceAccess.sampling.test.js.map