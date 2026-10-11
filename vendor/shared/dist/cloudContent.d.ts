import { z } from "zod";
export declare const cloudButtonThemeSchema: z.ZodObject<{
    variant: z.ZodPipe<z.ZodOptional<z.ZodEnum<{
        "": "";
        default: "default";
        link: "link";
        outline: "outline";
        secondary: "secondary";
        ghost: "ghost";
        destructive: "destructive";
        warning: "warning";
    }>>, z.ZodTransform<"default" | "link" | "outline" | "secondary" | "ghost" | "destructive" | "warning", "" | "default" | "link" | "outline" | "secondary" | "ghost" | "destructive" | "warning" | undefined>>;
    class: z.ZodOptional<z.ZodString>;
    style: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const contentBundleSchema: z.ZodObject<{
    format: z.ZodLiteral<"zip">;
    url: z.ZodString;
    entry: z.ZodString;
    sha256: z.ZodString;
    sizeBytes: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CloudContentBundle = z.infer<typeof contentBundleSchema>;
export declare const cloudContentPayloadSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    revision: z.ZodNumber;
    kind: z.ZodEnum<{
        campaign: "campaign";
        feature: "feature";
        notice: "notice";
    }>;
    locale: z.ZodEnum<{
        "zh-CN": "zh-CN";
        "en-US": "en-US";
    }>;
    dialog: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodObject<{
            format: z.ZodEnum<{
                html: "html";
                markdown: "markdown";
                plain_text: "plain_text";
            }>;
            text: z.ZodString;
        }, z.core.$strip>;
        hero: z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"image">;
            src: z.ZodString;
            darkSrc: z.ZodOptional<z.ZodString>;
            alt: z.ZodString;
            fit: z.ZodOptional<z.ZodEnum<{
                cover: "cover";
                contain: "contain";
            }>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"video">;
            src: z.ZodString;
            darkSrc: z.ZodOptional<z.ZodString>;
            poster: z.ZodString;
            autoplay: z.ZodOptional<z.ZodBoolean>;
            loop: z.ZodOptional<z.ZodBoolean>;
            muted: z.ZodLiteral<true>;
            fit: z.ZodOptional<z.ZodEnum<{
                cover: "cover";
                contain: "contain";
            }>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"lottie">;
            src: z.ZodString;
            darkSrc: z.ZodOptional<z.ZodString>;
            autoplay: z.ZodOptional<z.ZodBoolean>;
            loop: z.ZodOptional<z.ZodBoolean>;
            speed: z.ZodOptional<z.ZodNumber>;
            fallback: z.ZodOptional<z.ZodObject<{
                type: z.ZodLiteral<"image">;
                src: z.ZodString;
                darkSrc: z.ZodOptional<z.ZodString>;
                alt: z.ZodString;
                fit: z.ZodOptional<z.ZodEnum<{
                    cover: "cover";
                    contain: "contain";
                }>>;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"interactive_bundle">;
            runtime: z.ZodLiteral<"zcode-hero-sandbox-v1">;
            bundle: z.ZodObject<{
                format: z.ZodLiteral<"zip">;
                url: z.ZodString;
                entry: z.ZodString;
                sha256: z.ZodString;
                sizeBytes: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>;
            viewport: z.ZodObject<{
                aspectRatio: z.ZodLiteral<"4:3">;
            }, z.core.$strip>;
            data: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            events: z.ZodRecord<z.ZodString, z.ZodString>;
            fallback: z.ZodOptional<z.ZodObject<{
                type: z.ZodLiteral<"image">;
                src: z.ZodString;
                darkSrc: z.ZodOptional<z.ZodString>;
                alt: z.ZodString;
                fit: z.ZodOptional<z.ZodEnum<{
                    cover: "cover";
                    contain: "contain";
                }>>;
            }, z.core.$strip>>;
        }, z.core.$strip>], "type">;
        buttons: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            variant: z.ZodEnum<{
                link: "link";
                primary: "primary";
                secondary: "secondary";
            }>;
            theme: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                variant: z.ZodPipe<z.ZodOptional<z.ZodEnum<{
                    "": "";
                    default: "default";
                    link: "link";
                    outline: "outline";
                    secondary: "secondary";
                    ghost: "ghost";
                    destructive: "destructive";
                    warning: "warning";
                }>>, z.ZodTransform<"default" | "link" | "outline" | "secondary" | "ghost" | "destructive" | "warning", "" | "default" | "link" | "outline" | "secondary" | "ghost" | "destructive" | "warning" | undefined>>;
                class: z.ZodOptional<z.ZodString>;
                style: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>>;
            actionId: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    actions: z.ZodRecord<z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"close">;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"dismiss_content">;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"navigate">;
        destination: z.ZodEnum<{
            model_settings: "model_settings";
            plugin_store: "plugin_store";
            settings: "settings";
        }>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"copy_text">;
        text: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"open_external">;
        url: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"claim_plan">;
        planId: z.ZodString;
    }, z.core.$strip>], "type">>;
}, z.core.$strip>;
export type CloudContentPayload = z.infer<typeof cloudContentPayloadSchema>;
export type CloudContentHeroType = CloudContentPayload["dialog"]["hero"]["type"];
//# sourceMappingURL=cloudContent.d.ts.map