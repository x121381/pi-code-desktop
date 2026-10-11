export interface StableCuaWinRecipe {
    command: string;
    entryPath: string;
    root: string;
    addonPath: string;
    commandEnv: Record<string, string>;
}
export declare function getStableCuaPipeName(): string;
export declare function resolveStableCuaWinRecipe(): Promise<StableCuaWinRecipe | null>;
export declare function __resetStableCuaTransportForTest(): void;
//# sourceMappingURL=stableCuaTransport.d.ts.map