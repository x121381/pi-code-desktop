import type { CreateTaskRequest } from "@/app-shell/types.js";
export declare function usePluginCreator(onCreateTask: ((request?: CreateTaskRequest) => void) | undefined, isWebRemoteControl?: boolean): {
    create: () => Promise<void>;
    busy: boolean;
    available: boolean;
};
//# sourceMappingURL=usePluginCreator.d.ts.map