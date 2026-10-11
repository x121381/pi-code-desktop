import { z } from "zod";
export declare const genUiAnnotationControlSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"range">;
    currentValue: z.ZodNumber;
    min: z.ZodNumber;
    max: z.ZodNumber;
    step: z.ZodNumber;
    callback: z.ZodString;
    label: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"color">;
    currentValue: z.ZodString;
    callback: z.ZodString;
    label: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"toggle">;
    currentValue: z.ZodBoolean;
    callback: z.ZodString;
    label: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"select">;
    currentValue: z.ZodString;
    options: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        value: z.ZodString;
    }, z.core.$strict>>;
    callback: z.ZodString;
    label: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
}, z.core.$strict>], "type">;
export type GenUiAnnotationControl = z.infer<typeof genUiAnnotationControlSchema>;
export declare function isGenUiAnnotationValue(control: GenUiAnnotationControl, candidate: unknown): candidate is string | number | boolean;
export declare const genUiTweakMessageSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    registrationId: z.ZodString;
    annotationControls: z.ZodObject<{
        controlsMode: z.ZodLiteral<"replace">;
        controls: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"range">;
            currentValue: z.ZodNumber;
            min: z.ZodNumber;
            max: z.ZodNumber;
            step: z.ZodNumber;
            callback: z.ZodString;
            label: z.ZodString;
            reference: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"color">;
            currentValue: z.ZodString;
            callback: z.ZodString;
            label: z.ZodString;
            reference: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"toggle">;
            currentValue: z.ZodBoolean;
            callback: z.ZodString;
            label: z.ZodString;
            reference: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"select">;
            currentValue: z.ZodString;
            options: z.ZodArray<z.ZodObject<{
                label: z.ZodString;
                value: z.ZodString;
            }, z.core.$strict>>;
            callback: z.ZodString;
            label: z.ZodString;
            reference: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>], "type">>;
    }, z.core.$strict>;
    targets: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        selector: z.ZodString;
        tagName: z.ZodString;
        rect: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strict>;
    }, z.core.$strict>>;
    type: z.ZodLiteral<"register">;
}, z.core.$strict>, z.ZodObject<{
    registrationId: z.ZodString;
    annotationControls: z.ZodObject<{
        controlsMode: z.ZodLiteral<"replace">;
        controls: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"range">;
            currentValue: z.ZodNumber;
            min: z.ZodNumber;
            max: z.ZodNumber;
            step: z.ZodNumber;
            callback: z.ZodString;
            label: z.ZodString;
            reference: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"color">;
            currentValue: z.ZodString;
            callback: z.ZodString;
            label: z.ZodString;
            reference: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"toggle">;
            currentValue: z.ZodBoolean;
            callback: z.ZodString;
            label: z.ZodString;
            reference: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"select">;
            currentValue: z.ZodString;
            options: z.ZodArray<z.ZodObject<{
                label: z.ZodString;
                value: z.ZodString;
            }, z.core.$strict>>;
            callback: z.ZodString;
            label: z.ZodString;
            reference: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>], "type">>;
    }, z.core.$strict>;
    targets: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        selector: z.ZodString;
        tagName: z.ZodString;
        rect: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strict>;
    }, z.core.$strict>>;
    type: z.ZodLiteral<"update">;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"dispose">;
    registrationId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"select">;
    registrationId: z.ZodString;
    targetId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"escape">;
}, z.core.$strict>], "type">;
export type GenUiTweakMessage = z.infer<typeof genUiTweakMessageSchema>;
export declare const genUiTweakResultSchema: z.ZodObject<{
    annotationControls: z.ZodOptional<z.ZodObject<{
        controlsMode: z.ZodLiteral<"replace">;
        controls: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"range">;
            currentValue: z.ZodNumber;
            min: z.ZodNumber;
            max: z.ZodNumber;
            step: z.ZodNumber;
            callback: z.ZodString;
            label: z.ZodString;
            reference: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"color">;
            currentValue: z.ZodString;
            callback: z.ZodString;
            label: z.ZodString;
            reference: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"toggle">;
            currentValue: z.ZodBoolean;
            callback: z.ZodString;
            label: z.ZodString;
            reference: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodObject<{
            type: z.ZodLiteral<"select">;
            currentValue: z.ZodString;
            options: z.ZodArray<z.ZodObject<{
                label: z.ZodString;
                value: z.ZodString;
            }, z.core.$strict>>;
            callback: z.ZodString;
            label: z.ZodString;
            reference: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>], "type">>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type GenUiTweakResult = z.infer<typeof genUiTweakResultSchema>;
export declare const genUiTweakAnnotationSchema: z.ZodObject<{
    active: z.ZodBoolean;
    selection: z.ZodNullable<z.ZodObject<{
        registrationId: z.ZodString;
        targetId: z.ZodString;
    }, z.core.$strip>>;
    changes: z.ZodArray<z.ZodObject<{
        registrationId: z.ZodString;
        targetId: z.ZodString;
        annotationControlChanges: z.ZodArray<z.ZodObject<{
            callback: z.ZodString;
            previousValue: z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>;
            value: z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type GenUiTweakAnnotation = z.infer<typeof genUiTweakAnnotationSchema>;
//# sourceMappingURL=tweakProtocol.d.ts.map