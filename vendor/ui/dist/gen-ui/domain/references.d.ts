import { type GenUiReference } from "@zcode/shared/gen-ui";
export type GenUiPart = {
    kind: "text";
    text: string;
} | {
    kind: "ui";
    reference: GenUiReference;
    offset: number;
} | {
    kind: "pending" | "invalid";
};
export declare function projectGenUiReferences(text: string, completed: boolean): GenUiPart[];
//# sourceMappingURL=references.d.ts.map