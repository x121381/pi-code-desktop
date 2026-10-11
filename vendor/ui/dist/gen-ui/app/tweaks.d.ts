import { type GenUiTweakMessage, type GenUiTweakResult, type GenUiTweakAnnotation, type GenUiTweak, type GenUiTweakValues } from "@zcode/shared/gen-ui";
/** 上游 helper 的接受状态归页面 owner；guest 只通过 ACK 得到绑定投影。 */
export declare function createGenUiTweakRegistry(): {
    handle(input: GenUiTweakMessage): GenUiTweakResult;
    groups(): GenUiTweak[];
    annotation(values: GenUiTweakValues): GenUiTweakAnnotation;
};
//# sourceMappingURL=tweaks.d.ts.map