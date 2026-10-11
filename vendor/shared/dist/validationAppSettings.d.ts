import { z } from "zod";
export declare const appSettingsOccupationEnum: z.ZodEnum<{
    office: "office";
    developer: "developer";
    independent: "independent";
    infrastructure: "infrastructure";
    product: "product";
    design: "design";
    student: "student";
    creator: "creator";
    operations: "operations";
    marketing: "marketing";
    finance: "finance";
    accounting: "accounting";
    legal: "legal";
    other: "other";
}>;
export declare const localeSchema: z.ZodEnum<{
    "zh-CN": "zh-CN";
    "en-US": "en-US";
}>;
export declare const localePreferenceSchema: z.ZodEnum<{
    system: "system";
    "zh-CN": "zh-CN";
    "en-US": "en-US";
}>;
export declare const integratedTerminalShellSelectionSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    mode: z.ZodLiteral<"auto">;
}, z.core.$strip>, z.ZodObject<{
    mode: z.ZodLiteral<"shell">;
    dialect: z.ZodEnum<{
        cmd: "cmd";
        "git-bash": "git-bash";
    }>;
    id: z.ZodString;
    label: z.ZodString;
    path: z.ZodString;
}, z.core.$strip>], "mode">;
export declare const postUpdateReleaseNotesPayloadSchema: z.ZodObject<{
    version: z.ZodString;
    title: z.ZodString;
    markdown: z.ZodString;
    releaseDate: z.ZodOptional<z.ZodString>;
    releaseNotesByLocale: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        "zh-CN": "zh-CN";
        "en-US": "en-US";
    }> & z.core.$partial, z.ZodObject<{
        title: z.ZodString;
        markdown: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const appSettingsSchema: z.ZodPreprocess<z.ZodObject<{
    recentProjects: z.ZodDefault<z.ZodArray<z.ZodString>>;
    locale: z.ZodDefault<z.ZodEnum<{
        "zh-CN": "zh-CN";
        "en-US": "en-US";
    }>>;
    shortcutBindings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>;
    localePreference: z.ZodDefault<z.ZodEnum<{
        system: "system";
        "zh-CN": "zh-CN";
        "en-US": "en-US";
    }>>;
    terminalInheritSystemProfile: z.ZodDefault<z.ZodBoolean>;
    terminalFontFamily: z.ZodOptional<z.ZodString>;
    integratedTerminalShell: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        mode: z.ZodLiteral<"auto">;
    }, z.core.$strip>, z.ZodObject<{
        mode: z.ZodLiteral<"shell">;
        dialect: z.ZodEnum<{
            cmd: "cmd";
            "git-bash": "git-bash";
        }>;
        id: z.ZodString;
        label: z.ZodString;
        path: z.ZodString;
    }, z.core.$strip>], "mode">>;
    httpProxy: z.ZodOptional<z.ZodString>;
    httpProxyNoProxy: z.ZodOptional<z.ZodString>;
    httpProxyCaCertPath: z.ZodOptional<z.ZodString>;
    embeddedBrowserAllowInsecureCertificates: z.ZodDefault<z.ZodBoolean>;
    embeddedBrowserViewportPreference: z.ZodDefault<z.ZodObject<{
        mode: z.ZodEnum<{
            normal: "normal";
            responsive: "responsive";
        }>;
        viewport: z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strict>;
        zoom: z.ZodEnum<{
            50: "50";
            fit: "fit";
            75: "75";
            100: "100";
            125: "125";
            150: "150";
            200: "200";
        }>;
    }, z.core.$strict>>;
    computerUseComposerEntryHidden: z.ZodDefault<z.ZodBoolean>;
    taskAutoArchiveEnabled: z.ZodDefault<z.ZodBoolean>;
    taskAutoArchiveOlderThanDays: z.ZodDefault<z.ZodNumber>;
    closeToTrayOnWindows: z.ZodDefault<z.ZodBoolean>;
    closeToTrayOnWindowsMigrationInitialized: z.ZodDefault<z.ZodBoolean>;
    closeToTrayLinuxMigrationInitialized: z.ZodDefault<z.ZodBoolean>;
    keepAwakeWhileRunning: z.ZodDefault<z.ZodBoolean>;
    desktopZoomLevel: z.ZodOptional<z.ZodNumber>;
    desktopWindowSize: z.ZodOptional<z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
        maximized: z.ZodBoolean;
    }, z.core.$strip>>;
    desktopChromiumHardwareAccelerationEnabled: z.ZodDefault<z.ZodBoolean>;
    messageStreamShowReasoning: z.ZodDefault<z.ZodBoolean>;
    messageStreamShowReasoningMigrationInitialized: z.ZodDefault<z.ZodBoolean>;
    messageStreamShowTodos: z.ZodDefault<z.ZodBoolean>;
    toolGroupingExploreEnabled: z.ZodDefault<z.ZodBoolean>;
    toolGroupingTerminalEnabled: z.ZodDefault<z.ZodBoolean>;
    toolGroupingChangesEnabled: z.ZodDefault<z.ZodBoolean>;
    zcodeInteractionBehavior: z.ZodDefault<z.ZodEnum<{
        queue: "queue";
        guide: "guide";
    }>>;
    askUserQuestionAutoResolutionEnabled: z.ZodDefault<z.ZodBoolean>;
    modelIoFullRetentionEnabled: z.ZodDefault<z.ZodBoolean>;
    dynamicWorkflowMode: z.ZodCatch<z.ZodOptional<z.ZodEnum<{
        disabled: "disabled";
        onDemand: "onDemand";
        alwaysOn: "alwaysOn";
    }>>>;
    enabledBuiltinAgentCliProviders: z.ZodDefault<z.ZodPipe<z.ZodArray<z.ZodEnum<{
        claude: "claude";
        glm: "glm";
        opencode: "opencode";
        gemini: "gemini";
        codex: "codex";
    }>>, z.ZodTransform<"glm"[], ("claude" | "glm" | "opencode" | "gemini" | "codex")[]>>>;
    startPlanRecommendationDismissed: z.ZodDefault<z.ZodBoolean>;
    providerFamilyConnectionSelections: z.ZodDefault<z.ZodObject<{
        zai: z.ZodOptional<z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"start-plan">;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"individual-coding-plan">;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"team-coding-plan">;
            productId: z.ZodString;
            organizationId: z.ZodString;
            projectId: z.ZodString;
        }, z.core.$strict>], "kind">>>;
        bigmodel: z.ZodOptional<z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"start-plan">;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"individual-coding-plan">;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"team-coding-plan">;
            productId: z.ZodString;
            organizationId: z.ZodString;
            projectId: z.ZodString;
        }, z.core.$strict>], "kind">>>;
    }, z.core.$strip>>;
    providerFamilyDomain: z.ZodOptional<z.ZodEnum<{
        bigmodel: "bigmodel";
        zai: "zai";
    }>>;
    providerFamilyDomainUpdatedAt: z.ZodOptional<z.ZodNumber>;
    providerFamilyDomainMigrated: z.ZodDefault<z.ZodBoolean>;
    nativeSearchEnhancementsEnabled: z.ZodDefault<z.ZodBoolean>;
    onboardingOccupation: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        office: "office";
        developer: "developer";
        independent: "independent";
        infrastructure: "infrastructure";
        product: "product";
        design: "design";
        student: "student";
        creator: "creator";
        operations: "operations";
        marketing: "marketing";
        finance: "finance";
        accounting: "accounting";
        legal: "legal";
        other: "other";
    }>>>;
    proactiveSuggestionsEnabled: z.ZodOptional<z.ZodBoolean>;
    memoryEnabled: z.ZodDefault<z.ZodBoolean>;
    lastWorkspaceSession: z.ZodDefault<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"local">;
        workspacePath: z.ZodString;
        workspacePurpose: z.ZodDefault<z.ZodEnum<{
            project: "project";
            conversation: "conversation";
        }>>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"remote">;
        workspacePath: z.ZodString;
        localWorkspacePath: z.ZodOptional<z.ZodString>;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        target: z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"ssh">;
            host: z.ZodString;
            port: z.ZodOptional<z.ZodNumber>;
            username: z.ZodString;
            sshConfigAlias: z.ZodOptional<z.ZodString>;
            privateKeyPath: z.ZodOptional<z.ZodString>;
            assetInstallMode: z.ZodOptional<z.ZodEnum<{
                "local-download-upload": "local-download-upload";
                "remote-download": "remote-download";
            }>>;
            resourcePackages: z.ZodOptional<z.ZodObject<{
                selectedPackageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
            }, z.core.$strip>>;
            passwordCredentialKey: z.ZodOptional<z.ZodString>;
            privateKeyPassphraseCredentialKey: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"wsl">;
            distro: z.ZodOptional<z.ZodString>;
            user: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"docker">;
            container: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"server">;
            url: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            workspacePath: z.ZodOptional<z.ZodString>;
            serverId: z.ZodOptional<z.ZodString>;
            tokenCredentialKey: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>], "kind">;
        lastOpenedAt: z.ZodNumber;
        lastConnectionStatus: z.ZodEnum<{
            failed: "failed";
            connected: "connected";
        }>;
        lastConnectionError: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>], "kind">>>;
    lastActiveTabIndex: z.ZodDefault<z.ZodNumber>;
    lastActiveTaskByWorkspace: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    dataBaseDir: z.ZodOptional<z.ZodString>;
    pendingPostUpdateReleaseNotes: z.ZodOptional<z.ZodObject<{
        version: z.ZodString;
        title: z.ZodString;
        markdown: z.ZodString;
        releaseDate: z.ZodOptional<z.ZodString>;
        releaseNotesByLocale: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
            "zh-CN": "zh-CN";
            "en-US": "en-US";
        }> & z.core.$partial, z.ZodObject<{
            title: z.ZodString;
            markdown: z.ZodString;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    receivePreviewUpdates: z.ZodDefault<z.ZodBoolean>;
    autoDownloadAndInstallUpdates: z.ZodDefault<z.ZodBoolean>;
    skippedElectronUpdateVersions: z.ZodDefault<z.ZodRecord<z.ZodEnum<{
        preview: "preview";
        stable: "stable";
    }> & z.core.$partial, z.ZodString>>;
    settingsSyncFirstRunPromptHandled: z.ZodOptional<z.ZodBoolean>;
    webRemoteControlExternalRelayDevice: z.ZodOptional<z.ZodObject<{
        deviceSid: z.ZodString;
    }, z.core.$strip>>;
    webRemoteControlLastEnabledContext: z.ZodOptional<z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        initialTaskId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    zcodeEndpointOrigin: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, unknown>;
export declare const appSettingsPatchSchema: z.ZodObject<{
    recentProjects: z.ZodOptional<z.ZodArray<z.ZodString>>;
    locale: z.ZodOptional<z.ZodEnum<{
        "zh-CN": "zh-CN";
        "en-US": "en-US";
    }>>;
    shortcutBindings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>;
    localePreference: z.ZodOptional<z.ZodEnum<{
        system: "system";
        "zh-CN": "zh-CN";
        "en-US": "en-US";
    }>>;
    terminalInheritSystemProfile: z.ZodOptional<z.ZodBoolean>;
    terminalFontFamily: z.ZodOptional<z.ZodString>;
    integratedTerminalShell: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        mode: z.ZodLiteral<"auto">;
    }, z.core.$strip>, z.ZodObject<{
        mode: z.ZodLiteral<"shell">;
        dialect: z.ZodEnum<{
            cmd: "cmd";
            "git-bash": "git-bash";
        }>;
        id: z.ZodString;
        label: z.ZodString;
        path: z.ZodString;
    }, z.core.$strip>], "mode">>;
    httpProxy: z.ZodOptional<z.ZodString>;
    httpProxyNoProxy: z.ZodOptional<z.ZodString>;
    httpProxyCaCertPath: z.ZodOptional<z.ZodString>;
    embeddedBrowserAllowInsecureCertificates: z.ZodOptional<z.ZodBoolean>;
    embeddedBrowserViewportPreference: z.ZodOptional<z.ZodObject<{
        mode: z.ZodEnum<{
            normal: "normal";
            responsive: "responsive";
        }>;
        viewport: z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, z.core.$strict>;
        zoom: z.ZodEnum<{
            50: "50";
            fit: "fit";
            75: "75";
            100: "100";
            125: "125";
            150: "150";
            200: "200";
        }>;
    }, z.core.$strict>>;
    computerUseComposerEntryHidden: z.ZodOptional<z.ZodBoolean>;
    taskAutoArchiveEnabled: z.ZodOptional<z.ZodBoolean>;
    taskAutoArchiveOlderThanDays: z.ZodOptional<z.ZodNumber>;
    closeToTrayOnWindows: z.ZodOptional<z.ZodBoolean>;
    keepAwakeWhileRunning: z.ZodOptional<z.ZodBoolean>;
    closeToTrayOnWindowsMigrationInitialized: z.ZodOptional<z.ZodBoolean>;
    closeToTrayLinuxMigrationInitialized: z.ZodOptional<z.ZodBoolean>;
    desktopZoomLevel: z.ZodOptional<z.ZodNumber>;
    desktopWindowSize: z.ZodOptional<z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
        maximized: z.ZodBoolean;
    }, z.core.$strip>>;
    desktopChromiumHardwareAccelerationEnabled: z.ZodOptional<z.ZodBoolean>;
    messageStreamShowReasoning: z.ZodOptional<z.ZodBoolean>;
    messageStreamShowReasoningMigrationInitialized: z.ZodOptional<z.ZodBoolean>;
    messageStreamShowTodos: z.ZodOptional<z.ZodBoolean>;
    toolGroupingExploreEnabled: z.ZodOptional<z.ZodBoolean>;
    toolGroupingTerminalEnabled: z.ZodOptional<z.ZodBoolean>;
    toolGroupingChangesEnabled: z.ZodOptional<z.ZodBoolean>;
    zcodeInteractionBehavior: z.ZodOptional<z.ZodEnum<{
        queue: "queue";
        guide: "guide";
    }>>;
    askUserQuestionAutoResolutionEnabled: z.ZodOptional<z.ZodBoolean>;
    modelIoFullRetentionEnabled: z.ZodOptional<z.ZodBoolean>;
    dynamicWorkflowMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        disabled: "disabled";
        onDemand: "onDemand";
        alwaysOn: "alwaysOn";
    }>, z.ZodLiteral<"">]>>;
    enabledBuiltinAgentCliProviders: z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodEnum<{
        claude: "claude";
        glm: "glm";
        opencode: "opencode";
        gemini: "gemini";
        codex: "codex";
    }>>, z.ZodTransform<"glm"[], ("claude" | "glm" | "opencode" | "gemini" | "codex")[]>>>;
    startPlanRecommendationDismissed: z.ZodOptional<z.ZodBoolean>;
    providerFamilyConnectionSelections: z.ZodOptional<z.ZodObject<{
        zai: z.ZodOptional<z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"start-plan">;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"individual-coding-plan">;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"team-coding-plan">;
            productId: z.ZodString;
            organizationId: z.ZodString;
            projectId: z.ZodString;
        }, z.core.$strict>], "kind">>>;
        bigmodel: z.ZodOptional<z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"start-plan">;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"individual-coding-plan">;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"team-coding-plan">;
            productId: z.ZodString;
            organizationId: z.ZodString;
            projectId: z.ZodString;
        }, z.core.$strict>], "kind">>>;
    }, z.core.$strip>>;
    providerFamilyDomain: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        bigmodel: "bigmodel";
        zai: "zai";
    }>, z.ZodLiteral<"">]>>;
    providerFamilyDomainUpdatedAt: z.ZodOptional<z.ZodNumber>;
    providerFamilyDomainMigrated: z.ZodOptional<z.ZodBoolean>;
    nativeSearchEnhancementsEnabled: z.ZodOptional<z.ZodBoolean>;
    onboardingOccupation: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        office: "office";
        developer: "developer";
        independent: "independent";
        infrastructure: "infrastructure";
        product: "product";
        design: "design";
        student: "student";
        creator: "creator";
        operations: "operations";
        marketing: "marketing";
        finance: "finance";
        accounting: "accounting";
        legal: "legal";
        other: "other";
    }>>>;
    proactiveSuggestionsEnabled: z.ZodOptional<z.ZodBoolean>;
    memoryEnabled: z.ZodOptional<z.ZodBoolean>;
    lastWorkspaceSession: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"local">;
        workspacePath: z.ZodString;
        workspacePurpose: z.ZodDefault<z.ZodEnum<{
            project: "project";
            conversation: "conversation";
        }>>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"remote">;
        workspacePath: z.ZodString;
        localWorkspacePath: z.ZodOptional<z.ZodString>;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        target: z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"ssh">;
            host: z.ZodString;
            port: z.ZodOptional<z.ZodNumber>;
            username: z.ZodString;
            sshConfigAlias: z.ZodOptional<z.ZodString>;
            privateKeyPath: z.ZodOptional<z.ZodString>;
            assetInstallMode: z.ZodOptional<z.ZodEnum<{
                "local-download-upload": "local-download-upload";
                "remote-download": "remote-download";
            }>>;
            resourcePackages: z.ZodOptional<z.ZodObject<{
                selectedPackageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
            }, z.core.$strip>>;
            passwordCredentialKey: z.ZodOptional<z.ZodString>;
            privateKeyPassphraseCredentialKey: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"wsl">;
            distro: z.ZodOptional<z.ZodString>;
            user: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"docker">;
            container: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"server">;
            url: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            workspacePath: z.ZodOptional<z.ZodString>;
            serverId: z.ZodOptional<z.ZodString>;
            tokenCredentialKey: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>], "kind">;
        lastOpenedAt: z.ZodNumber;
        lastConnectionStatus: z.ZodEnum<{
            failed: "failed";
            connected: "connected";
        }>;
        lastConnectionError: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>], "kind">>>;
    lastActiveTabIndex: z.ZodOptional<z.ZodNumber>;
    lastActiveTaskByWorkspace: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    dataBaseDir: z.ZodOptional<z.ZodString>;
    pendingPostUpdateReleaseNotes: z.ZodOptional<z.ZodObject<{
        version: z.ZodString;
        title: z.ZodString;
        markdown: z.ZodString;
        releaseDate: z.ZodOptional<z.ZodString>;
        releaseNotesByLocale: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
            "zh-CN": "zh-CN";
            "en-US": "en-US";
        }> & z.core.$partial, z.ZodObject<{
            title: z.ZodString;
            markdown: z.ZodString;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    receivePreviewUpdates: z.ZodOptional<z.ZodBoolean>;
    autoDownloadAndInstallUpdates: z.ZodOptional<z.ZodBoolean>;
    skippedElectronUpdateVersions: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        preview: "preview";
        stable: "stable";
    }> & z.core.$partial, z.ZodString>>;
    settingsSyncFirstRunPromptHandled: z.ZodOptional<z.ZodBoolean>;
    webRemoteControlExternalRelayDevice: z.ZodOptional<z.ZodObject<{
        deviceSid: z.ZodString;
    }, z.core.$strip>>;
    webRemoteControlLastEnabledContext: z.ZodOptional<z.ZodObject<{
        workspacePath: z.ZodString;
        workspaceIdentity: z.ZodOptional<z.ZodString>;
        initialTaskId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    zcodeEndpointOrigin: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>;
//# sourceMappingURL=validationAppSettings.d.ts.map