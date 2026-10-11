import { z } from "zod";
export declare const marketingAssetSchema: z.ZodObject<{
    src: z.ZodString;
    sha256: z.ZodString;
}, z.core.$strip>;
export declare const marketingNavigationSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    page: z.ZodLiteral<"upgrade">;
}, z.core.$strict>, z.ZodObject<{
    page: z.ZodLiteral<"rewards">;
}, z.core.$strict>, z.ZodObject<{
    page: z.ZodLiteral<"settings">;
    section: z.ZodOptional<z.ZodEnum<{
        usage: "usage";
        subagents: "subagents";
        models: "models";
        skills: "skills";
        hooks: "hooks";
        browser: "browser";
        mcp: "mcp";
        memory: "memory";
        plugins: "plugins";
        commands: "commands";
        general: "general";
        appearance: "appearance";
        computer_use: "computer_use";
    }>>;
    provider_id: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    page: z.ZodLiteral<"plugin_marketplace">;
    plugin_id: z.ZodOptional<z.ZodString>;
}, z.core.$strict>], "page">;
export declare const marketingActionSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"close">;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"open_url">;
    args: z.ZodObject<{
        url: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"claim_zcode_plan">;
    args: z.ZodObject<{
        plan_id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"navigate">;
    args: z.ZodDiscriminatedUnion<[z.ZodObject<{
        page: z.ZodLiteral<"upgrade">;
    }, z.core.$strict>, z.ZodObject<{
        page: z.ZodLiteral<"rewards">;
    }, z.core.$strict>, z.ZodObject<{
        page: z.ZodLiteral<"settings">;
        section: z.ZodOptional<z.ZodEnum<{
            usage: "usage";
            subagents: "subagents";
            models: "models";
            skills: "skills";
            hooks: "hooks";
            browser: "browser";
            mcp: "mcp";
            memory: "memory";
            plugins: "plugins";
            commands: "commands";
            general: "general";
            appearance: "appearance";
            computer_use: "computer_use";
        }>>;
        provider_id: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        page: z.ZodLiteral<"plugin_marketplace">;
        plugin_id: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>], "page">;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"copy_text">;
    args: z.ZodObject<{
        text: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strip>], "type">;
export declare const marketingVisualSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"image">;
    image: z.ZodObject<{
        default: z.ZodObject<{
            src: z.ZodString;
            sha256: z.ZodString;
        }, z.core.$strip>;
        dark: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            src: z.ZodString;
            sha256: z.ZodString;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
    args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"video">;
    video: z.ZodObject<{
        src: z.ZodObject<{
            src: z.ZodString;
            sha256: z.ZodString;
        }, z.core.$strip>;
        fallback: z.ZodObject<{
            src: z.ZodString;
            sha256: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"bundle">;
    bundle: z.ZodObject<{
        bundle: z.ZodObject<{
            src: z.ZodString;
            sha256: z.ZodString;
        }, z.core.$strip>;
        entry: z.ZodString;
        fallback: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            src: z.ZodString;
            sha256: z.ZodString;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
    args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>], "type">;
export declare const marketingPopupSchema: z.ZodObject<{
    layout: z.ZodOptional<z.ZodEnum<{
        "": "";
        v1: "v1";
    }>>;
    title: z.ZodObject<{
        format: z.ZodEnum<{
            html: "html";
            markdown: "markdown";
            plaintext: "plaintext";
        }>;
        content: z.ZodString;
    }, z.core.$strip>;
    description: z.ZodObject<{
        format: z.ZodEnum<{
            html: "html";
            markdown: "markdown";
            plaintext: "plaintext";
        }>;
        content: z.ZodString;
    }, z.core.$strip>;
    hero: z.ZodOptional<z.ZodNullable<z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"image">;
        image: z.ZodObject<{
            default: z.ZodObject<{
                src: z.ZodString;
                sha256: z.ZodString;
            }, z.core.$strip>;
            dark: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                src: z.ZodString;
                sha256: z.ZodString;
            }, z.core.$strip>>>;
        }, z.core.$strip>;
        args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"video">;
        video: z.ZodObject<{
            src: z.ZodObject<{
                src: z.ZodString;
                sha256: z.ZodString;
            }, z.core.$strip>;
            fallback: z.ZodObject<{
                src: z.ZodString;
                sha256: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>;
        args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"bundle">;
        bundle: z.ZodObject<{
            bundle: z.ZodObject<{
                src: z.ZodString;
                sha256: z.ZodString;
            }, z.core.$strip>;
            entry: z.ZodString;
            fallback: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                src: z.ZodString;
                sha256: z.ZodString;
            }, z.core.$strip>>>;
        }, z.core.$strip>;
        args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>], "type">>>;
    buttons: z.ZodArray<z.ZodObject<{
        text: z.ZodObject<{
            format: z.ZodEnum<{
                html: "html";
                markdown: "markdown";
                plaintext: "plaintext";
            }>;
            content: z.ZodString;
        }, z.core.$strip>;
        action: z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"close">;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"open_url">;
            args: z.ZodObject<{
                url: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"claim_zcode_plan">;
            args: z.ZodObject<{
                plan_id: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"navigate">;
            args: z.ZodDiscriminatedUnion<[z.ZodObject<{
                page: z.ZodLiteral<"upgrade">;
            }, z.core.$strict>, z.ZodObject<{
                page: z.ZodLiteral<"rewards">;
            }, z.core.$strict>, z.ZodObject<{
                page: z.ZodLiteral<"settings">;
                section: z.ZodOptional<z.ZodEnum<{
                    usage: "usage";
                    subagents: "subagents";
                    models: "models";
                    skills: "skills";
                    hooks: "hooks";
                    browser: "browser";
                    mcp: "mcp";
                    memory: "memory";
                    plugins: "plugins";
                    commands: "commands";
                    general: "general";
                    appearance: "appearance";
                    computer_use: "computer_use";
                }>>;
                provider_id: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>, z.ZodObject<{
                page: z.ZodLiteral<"plugin_marketplace">;
                plugin_id: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>], "page">;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"copy_text">;
            args: z.ZodObject<{
                text: z.ZodString;
            }, z.core.$strict>;
        }, z.core.$strip>], "type">;
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
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const marketingDeliverySchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    resource_position: z.ZodLiteral<"banner">;
    banner: z.ZodObject<{
        layout: z.ZodOptional<z.ZodEnum<{
            "": "";
            v1: "v1";
        }>>;
        background: z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"image">;
            image: z.ZodObject<{
                default: z.ZodObject<{
                    src: z.ZodString;
                    sha256: z.ZodString;
                }, z.core.$strip>;
                dark: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    src: z.ZodString;
                    sha256: z.ZodString;
                }, z.core.$strip>>>;
            }, z.core.$strip>;
            args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"video">;
            video: z.ZodObject<{
                src: z.ZodObject<{
                    src: z.ZodString;
                    sha256: z.ZodString;
                }, z.core.$strip>;
                fallback: z.ZodObject<{
                    src: z.ZodString;
                    sha256: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>;
            args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"bundle">;
            bundle: z.ZodObject<{
                bundle: z.ZodObject<{
                    src: z.ZodString;
                    sha256: z.ZodString;
                }, z.core.$strip>;
                entry: z.ZodString;
                fallback: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    src: z.ZodString;
                    sha256: z.ZodString;
                }, z.core.$strip>>>;
            }, z.core.$strip>;
            args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>], "type">;
        buttons: z.ZodArray<z.ZodObject<{
            action: z.ZodDiscriminatedUnion<[z.ZodObject<{
                type: z.ZodLiteral<"close">;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"open_url">;
                args: z.ZodObject<{
                    url: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"claim_zcode_plan">;
                args: z.ZodObject<{
                    plan_id: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"navigate">;
                args: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    page: z.ZodLiteral<"upgrade">;
                }, z.core.$strict>, z.ZodObject<{
                    page: z.ZodLiteral<"rewards">;
                }, z.core.$strict>, z.ZodObject<{
                    page: z.ZodLiteral<"settings">;
                    section: z.ZodOptional<z.ZodEnum<{
                        usage: "usage";
                        subagents: "subagents";
                        models: "models";
                        skills: "skills";
                        hooks: "hooks";
                        browser: "browser";
                        mcp: "mcp";
                        memory: "memory";
                        plugins: "plugins";
                        commands: "commands";
                        general: "general";
                        appearance: "appearance";
                        computer_use: "computer_use";
                    }>>;
                    provider_id: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>, z.ZodObject<{
                    page: z.ZodLiteral<"plugin_marketplace">;
                    plugin_id: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>], "page">;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"copy_text">;
                args: z.ZodObject<{
                    text: z.ZodString;
                }, z.core.$strict>;
            }, z.core.$strip>], "type">;
            text: z.ZodObject<{
                content: z.ZodString;
                format: z.ZodPipe<z.ZodEnum<{
                    "": "";
                    html: "html";
                    markdown: "markdown";
                    plaintext: "plaintext";
                }>, z.ZodTransform<"html" | "markdown" | "plaintext", "" | "html" | "markdown" | "plaintext">>;
            }, z.core.$strip>;
        }, z.core.$strip>>;
        success_popup: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            layout: z.ZodOptional<z.ZodEnum<{
                "": "";
                v1: "v1";
            }>>;
            title: z.ZodObject<{
                format: z.ZodEnum<{
                    html: "html";
                    markdown: "markdown";
                    plaintext: "plaintext";
                }>;
                content: z.ZodString;
            }, z.core.$strip>;
            description: z.ZodObject<{
                format: z.ZodEnum<{
                    html: "html";
                    markdown: "markdown";
                    plaintext: "plaintext";
                }>;
                content: z.ZodString;
            }, z.core.$strip>;
            hero: z.ZodOptional<z.ZodNullable<z.ZodDiscriminatedUnion<[z.ZodObject<{
                type: z.ZodLiteral<"image">;
                image: z.ZodObject<{
                    default: z.ZodObject<{
                        src: z.ZodString;
                        sha256: z.ZodString;
                    }, z.core.$strip>;
                    dark: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        src: z.ZodString;
                        sha256: z.ZodString;
                    }, z.core.$strip>>>;
                }, z.core.$strip>;
                args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"video">;
                video: z.ZodObject<{
                    src: z.ZodObject<{
                        src: z.ZodString;
                        sha256: z.ZodString;
                    }, z.core.$strip>;
                    fallback: z.ZodObject<{
                        src: z.ZodString;
                        sha256: z.ZodString;
                    }, z.core.$strip>;
                }, z.core.$strip>;
                args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"bundle">;
                bundle: z.ZodObject<{
                    bundle: z.ZodObject<{
                        src: z.ZodString;
                        sha256: z.ZodString;
                    }, z.core.$strip>;
                    entry: z.ZodString;
                    fallback: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        src: z.ZodString;
                        sha256: z.ZodString;
                    }, z.core.$strip>>>;
                }, z.core.$strip>;
                args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, z.core.$strip>], "type">>>;
            buttons: z.ZodArray<z.ZodObject<{
                text: z.ZodObject<{
                    format: z.ZodEnum<{
                        html: "html";
                        markdown: "markdown";
                        plaintext: "plaintext";
                    }>;
                    content: z.ZodString;
                }, z.core.$strip>;
                action: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    type: z.ZodLiteral<"close">;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"open_url">;
                    args: z.ZodObject<{
                        url: z.ZodString;
                    }, z.core.$strip>;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"claim_zcode_plan">;
                    args: z.ZodObject<{
                        plan_id: z.ZodString;
                    }, z.core.$strip>;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"navigate">;
                    args: z.ZodDiscriminatedUnion<[z.ZodObject<{
                        page: z.ZodLiteral<"upgrade">;
                    }, z.core.$strict>, z.ZodObject<{
                        page: z.ZodLiteral<"rewards">;
                    }, z.core.$strict>, z.ZodObject<{
                        page: z.ZodLiteral<"settings">;
                        section: z.ZodOptional<z.ZodEnum<{
                            usage: "usage";
                            subagents: "subagents";
                            models: "models";
                            skills: "skills";
                            hooks: "hooks";
                            browser: "browser";
                            mcp: "mcp";
                            memory: "memory";
                            plugins: "plugins";
                            commands: "commands";
                            general: "general";
                            appearance: "appearance";
                            computer_use: "computer_use";
                        }>>;
                        provider_id: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>, z.ZodObject<{
                        page: z.ZodLiteral<"plugin_marketplace">;
                        plugin_id: z.ZodOptional<z.ZodString>;
                    }, z.core.$strict>], "page">;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"copy_text">;
                    args: z.ZodObject<{
                        text: z.ZodString;
                    }, z.core.$strict>;
                }, z.core.$strip>], "type">;
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
            }, z.core.$strip>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
    campaign_id: z.ZodString;
    priority: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    resource_position: z.ZodLiteral<"popup">;
    popup: z.ZodObject<{
        layout: z.ZodOptional<z.ZodEnum<{
            "": "";
            v1: "v1";
        }>>;
        title: z.ZodObject<{
            format: z.ZodEnum<{
                html: "html";
                markdown: "markdown";
                plaintext: "plaintext";
            }>;
            content: z.ZodString;
        }, z.core.$strip>;
        description: z.ZodObject<{
            format: z.ZodEnum<{
                html: "html";
                markdown: "markdown";
                plaintext: "plaintext";
            }>;
            content: z.ZodString;
        }, z.core.$strip>;
        hero: z.ZodOptional<z.ZodNullable<z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"image">;
            image: z.ZodObject<{
                default: z.ZodObject<{
                    src: z.ZodString;
                    sha256: z.ZodString;
                }, z.core.$strip>;
                dark: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    src: z.ZodString;
                    sha256: z.ZodString;
                }, z.core.$strip>>>;
            }, z.core.$strip>;
            args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"video">;
            video: z.ZodObject<{
                src: z.ZodObject<{
                    src: z.ZodString;
                    sha256: z.ZodString;
                }, z.core.$strip>;
                fallback: z.ZodObject<{
                    src: z.ZodString;
                    sha256: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>;
            args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"bundle">;
            bundle: z.ZodObject<{
                bundle: z.ZodObject<{
                    src: z.ZodString;
                    sha256: z.ZodString;
                }, z.core.$strip>;
                entry: z.ZodString;
                fallback: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    src: z.ZodString;
                    sha256: z.ZodString;
                }, z.core.$strip>>>;
            }, z.core.$strip>;
            args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>], "type">>>;
        buttons: z.ZodArray<z.ZodObject<{
            text: z.ZodObject<{
                format: z.ZodEnum<{
                    html: "html";
                    markdown: "markdown";
                    plaintext: "plaintext";
                }>;
                content: z.ZodString;
            }, z.core.$strip>;
            action: z.ZodDiscriminatedUnion<[z.ZodObject<{
                type: z.ZodLiteral<"close">;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"open_url">;
                args: z.ZodObject<{
                    url: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"claim_zcode_plan">;
                args: z.ZodObject<{
                    plan_id: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"navigate">;
                args: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    page: z.ZodLiteral<"upgrade">;
                }, z.core.$strict>, z.ZodObject<{
                    page: z.ZodLiteral<"rewards">;
                }, z.core.$strict>, z.ZodObject<{
                    page: z.ZodLiteral<"settings">;
                    section: z.ZodOptional<z.ZodEnum<{
                        usage: "usage";
                        subagents: "subagents";
                        models: "models";
                        skills: "skills";
                        hooks: "hooks";
                        browser: "browser";
                        mcp: "mcp";
                        memory: "memory";
                        plugins: "plugins";
                        commands: "commands";
                        general: "general";
                        appearance: "appearance";
                        computer_use: "computer_use";
                    }>>;
                    provider_id: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>, z.ZodObject<{
                    page: z.ZodLiteral<"plugin_marketplace">;
                    plugin_id: z.ZodOptional<z.ZodString>;
                }, z.core.$strict>], "page">;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"copy_text">;
                args: z.ZodObject<{
                    text: z.ZodString;
                }, z.core.$strict>;
            }, z.core.$strip>], "type">;
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
        }, z.core.$strip>>;
    }, z.core.$strip>;
    campaign_id: z.ZodString;
    priority: z.ZodNumber;
}, z.core.$strip>], "resource_position">;
export type MarketingAsset = z.infer<typeof marketingAssetSchema>;
export type MarketingAction = z.infer<typeof marketingActionSchema>;
export type MarketingPopup = z.infer<typeof marketingPopupSchema>;
export type MarketingVisual = z.infer<typeof marketingVisualSchema>;
export type MarketingDelivery = z.infer<typeof marketingDeliverySchema>;
export type MarketingBannerDelivery = Extract<MarketingDelivery, {
    resource_position: "banner";
}>;
export type MarketingPopupDelivery = Extract<MarketingDelivery, {
    resource_position: "popup";
}>;
export type MarketingTouchSnapshot = ReturnType<typeof parseMarketingTouchResponse>;
/** 单条坏投放不影响其他资源位；外层失败不能伪装成成功空结果。 */
export declare function parseMarketingTouchResponse(input: unknown): {
    serverTime: number;
    language: "zh-CN" | "en-US";
    deliveries: ({
        resource_position: "banner";
        banner: {
            background: {
                type: "image";
                image: {
                    default: {
                        src: string;
                        sha256: string;
                    };
                    dark?: {
                        src: string;
                        sha256: string;
                    } | null | undefined;
                };
                args?: Record<string, unknown> | undefined;
            } | {
                type: "video";
                video: {
                    src: {
                        src: string;
                        sha256: string;
                    };
                    fallback: {
                        src: string;
                        sha256: string;
                    };
                };
                args?: Record<string, unknown> | undefined;
            } | {
                type: "bundle";
                bundle: {
                    bundle: {
                        src: string;
                        sha256: string;
                    };
                    entry: string;
                    fallback?: {
                        src: string;
                        sha256: string;
                    } | null | undefined;
                };
                args?: Record<string, unknown> | undefined;
            };
            buttons: {
                action: {
                    type: "close";
                } | {
                    type: "open_url";
                    args: {
                        url: string;
                    };
                } | {
                    type: "claim_zcode_plan";
                    args: {
                        plan_id: string;
                    };
                } | {
                    type: "navigate";
                    args: {
                        page: "settings";
                        section?: "usage" | "subagents" | "models" | "skills" | "hooks" | "browser" | "mcp" | "memory" | "plugins" | "commands" | "general" | "appearance" | "computer_use" | undefined;
                        provider_id?: string | undefined;
                    } | {
                        page: "upgrade";
                    } | {
                        page: "rewards";
                    } | {
                        page: "plugin_marketplace";
                        plugin_id?: string | undefined;
                    };
                } | {
                    type: "copy_text";
                    args: {
                        text: string;
                    };
                };
                text: {
                    content: string;
                    format: "html" | "markdown" | "plaintext";
                };
            }[];
            layout?: "" | "v1" | undefined;
            success_popup?: {
                title: {
                    format: "html" | "markdown" | "plaintext";
                    content: string;
                };
                description: {
                    format: "html" | "markdown" | "plaintext";
                    content: string;
                };
                buttons: {
                    text: {
                        format: "html" | "markdown" | "plaintext";
                        content: string;
                    };
                    action: {
                        type: "close";
                    } | {
                        type: "open_url";
                        args: {
                            url: string;
                        };
                    } | {
                        type: "claim_zcode_plan";
                        args: {
                            plan_id: string;
                        };
                    } | {
                        type: "navigate";
                        args: {
                            page: "settings";
                            section?: "usage" | "subagents" | "models" | "skills" | "hooks" | "browser" | "mcp" | "memory" | "plugins" | "commands" | "general" | "appearance" | "computer_use" | undefined;
                            provider_id?: string | undefined;
                        } | {
                            page: "upgrade";
                        } | {
                            page: "rewards";
                        } | {
                            page: "plugin_marketplace";
                            plugin_id?: string | undefined;
                        };
                    } | {
                        type: "copy_text";
                        args: {
                            text: string;
                        };
                    };
                    theme?: {
                        variant: "default" | "link" | "outline" | "secondary" | "ghost" | "destructive" | "warning";
                        class?: string | undefined;
                        style?: string | undefined;
                    } | null | undefined;
                }[];
                layout?: "" | "v1" | undefined;
                hero?: {
                    type: "image";
                    image: {
                        default: {
                            src: string;
                            sha256: string;
                        };
                        dark?: {
                            src: string;
                            sha256: string;
                        } | null | undefined;
                    };
                    args?: Record<string, unknown> | undefined;
                } | {
                    type: "video";
                    video: {
                        src: {
                            src: string;
                            sha256: string;
                        };
                        fallback: {
                            src: string;
                            sha256: string;
                        };
                    };
                    args?: Record<string, unknown> | undefined;
                } | {
                    type: "bundle";
                    bundle: {
                        bundle: {
                            src: string;
                            sha256: string;
                        };
                        entry: string;
                        fallback?: {
                            src: string;
                            sha256: string;
                        } | null | undefined;
                    };
                    args?: Record<string, unknown> | undefined;
                } | null | undefined;
            } | null | undefined;
        };
        campaign_id: string;
        priority: number;
    } | {
        resource_position: "popup";
        popup: {
            title: {
                format: "html" | "markdown" | "plaintext";
                content: string;
            };
            description: {
                format: "html" | "markdown" | "plaintext";
                content: string;
            };
            buttons: {
                text: {
                    format: "html" | "markdown" | "plaintext";
                    content: string;
                };
                action: {
                    type: "close";
                } | {
                    type: "open_url";
                    args: {
                        url: string;
                    };
                } | {
                    type: "claim_zcode_plan";
                    args: {
                        plan_id: string;
                    };
                } | {
                    type: "navigate";
                    args: {
                        page: "settings";
                        section?: "usage" | "subagents" | "models" | "skills" | "hooks" | "browser" | "mcp" | "memory" | "plugins" | "commands" | "general" | "appearance" | "computer_use" | undefined;
                        provider_id?: string | undefined;
                    } | {
                        page: "upgrade";
                    } | {
                        page: "rewards";
                    } | {
                        page: "plugin_marketplace";
                        plugin_id?: string | undefined;
                    };
                } | {
                    type: "copy_text";
                    args: {
                        text: string;
                    };
                };
                theme?: {
                    variant: "default" | "link" | "outline" | "secondary" | "ghost" | "destructive" | "warning";
                    class?: string | undefined;
                    style?: string | undefined;
                } | null | undefined;
            }[];
            layout?: "" | "v1" | undefined;
            hero?: {
                type: "image";
                image: {
                    default: {
                        src: string;
                        sha256: string;
                    };
                    dark?: {
                        src: string;
                        sha256: string;
                    } | null | undefined;
                };
                args?: Record<string, unknown> | undefined;
            } | {
                type: "video";
                video: {
                    src: {
                        src: string;
                        sha256: string;
                    };
                    fallback: {
                        src: string;
                        sha256: string;
                    };
                };
                args?: Record<string, unknown> | undefined;
            } | {
                type: "bundle";
                bundle: {
                    bundle: {
                        src: string;
                        sha256: string;
                    };
                    entry: string;
                    fallback?: {
                        src: string;
                        sha256: string;
                    } | null | undefined;
                };
                args?: Record<string, unknown> | undefined;
            } | null | undefined;
        };
        campaign_id: string;
        priority: number;
    })[];
    rejectedCount: number;
};
//# sourceMappingURL=marketingTouch.d.ts.map