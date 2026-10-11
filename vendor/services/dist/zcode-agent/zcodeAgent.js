import { ServiceChannels } from "@zcode/shared";
import { createServiceDescriptor } from "../descriptors.js";
export * from "./zcodeAgentPluginParams.js";
export * from "./zcodeAgentWorkflowParams.js";
export const ZCODE_AGENT_RUNTIME_UNAVAILABLE_CODE = "ZCODE_AGENT_RUNTIME_UNAVAILABLE";
export const IZCodeAgentService = createServiceDescriptor(ServiceChannels.ZCodeAgent);
//# sourceMappingURL=zcodeAgent.js.map