import { type GenUiScope } from "../gen-ui/index.js";
/** Execution Host supplies this process-scoped root; models never choose it. */
export declare const GEN_UI_OUTPUT_ROOT_ENV = "ZCODE_GEN_UI_OUTPUT_ROOT";
export declare const GEN_UI_OUTPUT_DIRECTORY = "visualizations";
export declare function getGenUiOutputDirectory(outputRoot: string, scope: GenUiScope): string;
//# sourceMappingURL=genUiPaths.d.ts.map