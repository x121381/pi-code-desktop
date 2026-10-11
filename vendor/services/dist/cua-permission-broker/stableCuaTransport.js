import { mintBrokerSocketPath } from "@zcode/zcode-cua/broker";
import { createServiceLogger } from "#src/logger/serviceLogger.js";
import { resolveWindowsCuaRuntime } from "#src/cua-permission-broker/windowsCuaDevRuntime.js";
const logger = createServiceLogger("stable-cua-transport");
let stablePipeName = null;
let recipePromise = null;
let recipeFailureLogged = false;
export function getStableCuaPipeName() {
    stablePipeName ??= mintBrokerSocketPath({ env: process.env });
    return stablePipeName;
}
export function resolveStableCuaWinRecipe() {
    recipePromise ??= resolveWindowsCuaRuntime()
        .then((runtime) => ({
        command: runtime.command,
        entryPath: runtime.entryPath,
        root: runtime.root,
        addonPath: runtime.addonPath,
        commandEnv: runtime.commandEnv,
    }))
        .catch((error) => {
        if (!recipeFailureLogged) {
            recipeFailureLogged = true;
            logger.warn(undefined, `Windows CUA helper recipe unavailable: ${error instanceof Error ? error.message : String(error)}`);
        }
        recipePromise = null;
        return null;
    });
    return recipePromise;
}
export function __resetStableCuaTransportForTest() {
    stablePipeName = null;
    recipePromise = null;
    recipeFailureLogged = false;
}
//# sourceMappingURL=stableCuaTransport.js.map