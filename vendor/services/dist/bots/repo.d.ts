import { type BotsConfigFile, type BotsStateFile } from "@zcode/shared";
export declare class BotsRepo {
    readConfig(): Promise<BotsConfigFile>;
    writeConfig(config: BotsConfigFile): Promise<BotsConfigFile>;
    readState(): Promise<BotsStateFile>;
    writeState(state: BotsStateFile): Promise<BotsStateFile>;
}
//# sourceMappingURL=repo.d.ts.map