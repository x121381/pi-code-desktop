import type { StorageVolume } from "@zcode/shared";
import type { VolumeProbePort } from "../app/ports.js";
export declare function probeStorageVolume(path: string): Promise<StorageVolume | null>;
export declare function createFsVolumeProbe(): VolumeProbePort;
//# sourceMappingURL=volumeProbe.d.ts.map