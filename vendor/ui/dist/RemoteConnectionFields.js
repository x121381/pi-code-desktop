import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable max-lines -- 远程连接字段较多，SSH/WSL/Docker 分支暂集中在单文件维护。 */
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangleIcon, CheckIcon, ChevronDownIcon, LoaderIcon, Plus } from "lucide-react";
import { TID_DOCKER_CONTAINER_INPUT, TID_DOCKER_CONTAINER_SELECT, TID_SSH_CONFIG_ALIAS_SELECT, TID_SSH_AUTH_PASSWORD, TID_SSH_AUTH_PRIVATE_KEY, TID_SSH_HOST_INPUT, TID_SSH_PASSWORD_INPUT, TID_SSH_PORT_INPUT, TID_SSH_PRIVATE_KEY_INPUT, TID_SSH_USERNAME_INPUT, TID_SERVER_NAME_INPUT, TID_SERVER_TOKEN_INPUT, TID_SERVER_URL_INPUT, TID_SERVER_WORKSPACE_PATH_INPUT, TID_WSL_DISTRO_SELECT, TID_WSL_USER_INPUT, isValidWslUser, } from "@zcode/shared";
import { usePlatform } from "@/hooks/usePlatform.js";
import { cn } from "@/components/lib/utils.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { RemoteConnectionHistoryInput } from "@/remote-connection/RemoteConnectionHistoryInput.js";
import { buildSshConnectionHistorySuggestions } from "@/remote-connection/sshHistorySuggestions.js";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command.js";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
const DEFAULT_WSL_DISTRO_VALUE = "__default_wsl_distro__";
const NO_SSH_CONFIG_ALIAS_VALUE = "__ssh_config_alias_none__";
function formatSshConfigAliasSummary(aliasOption) {
    const host = aliasOption.host?.trim() || aliasOption.alias;
    const username = aliasOption.username?.trim();
    const withUser = username ? `${username}@${host}` : host;
    return aliasOption.port != null ? `${withUser}:${aliasOption.port}` : withUser;
}
export function RemoteConnectionFields({ kind, host, port, username, sshAuthMethod, assetInstallMode, password, privateKeyPath, privateKeyPassphrase, wslDistro, wslUser = "", wslDistros, dockerContainer, manualDockerContainer, serverUrl, serverName, serverToken, serverWorkspacePath, dockerContainers, dockerAvailable, sshConfigAliases, sshConfigAliasesLoading, sshConfigAliasesError, selectedSshConfigAlias, runtimeOptionsLoading, remoteWorkspaceSessions = [], refreshDockerContainers, applySshConfigAlias, clearSelectedSshConfigAlias, setHost, setPort, setUsername, setSshAuthMethod, setAssetInstallMode, setPassword, setPrivateKeyPath, setPrivateKeyPassphrase, setWslDistro, setWslUser, setDockerContainer, setManualDockerContainer, setServerUrl, setServerName, setServerToken, setServerWorkspacePath, }) {
    const { intl } = useZCodeIntl();
    const platform = usePlatform();
    const [sshAliasPopoverOpen, setSshAliasPopoverOpen] = useState(false);
    const [dockerContainerPopoverOpen, setDockerContainerPopoverOpen] = useState(false);
    const sshAliasListRef = useRef(null);
    const sshHistorySuggestions = buildSshConnectionHistorySuggestions(remoteWorkspaceSessions);
    const selectedSshAliasOption = selectedSshConfigAlias == null
        ? null
        : (sshConfigAliases.find((option) => option.alias === selectedSshConfigAlias) ?? null);
    const sshAliasTriggerLabel = sshConfigAliasesLoading
        ? intl.formatMessage({ id: "common.loading" })
        : (selectedSshAliasOption?.alias ??
            (sshConfigAliases.length === 0
                ? intl.formatMessage({ id: "ssh.configAliasEmpty" })
                : intl.formatMessage({ id: "ssh.configAliasPlaceholder" })));
    const handleSshAliasListWheel = useCallback((event) => {
        const listElement = event.currentTarget;
        if (listElement.scrollHeight <= listElement.clientHeight) {
            return;
        }
        // Popover 嵌在 Dialog 中时，外层滚动锁会吞掉默认滚轮行为，
        // 导致 alias CommandList 只能拖滚动条、不能直接滚轮滚动。
        // 这里显式驱动列表自身 scrollTop，确保鼠标滚轮和触控板都能滚动候选项。
        listElement.scrollTop += event.deltaY;
        event.preventDefault();
        event.stopPropagation();
    }, []);
    const dockerContainerEmptyText = dockerAvailable === false
        ? intl.formatMessage({ id: "docker.unavailable" })
        : intl.formatMessage({ id: "docker.noContainers" });
    const dockerContainerTriggerLabel = dockerContainer.trim() ||
        (runtimeOptionsLoading
            ? intl.formatMessage({ id: "docker.loading" })
            : dockerContainers.length === 0
                ? dockerContainerEmptyText
                : intl.formatMessage({ id: "docker.selectContainer" }));
    const dockerContainerTriggerIsPlaceholder = !dockerContainer.trim() && dockerContainers.length === 0;
    const manualDockerContainerIsEmpty = manualDockerContainer.trim().length === 0;
    const wslUserIsRoot = wslUser.trim().toLowerCase() === "root";
    const wslUserIsInvalid = wslUser.trim().length > 0 && !isValidWslUser(wslUser);
    const handleDockerContainerPopoverOpenChange = useCallback((nextOpen) => {
        setDockerContainerPopoverOpen(nextOpen);
        if (nextOpen) {
            refreshDockerContainers?.();
        }
    }, [refreshDockerContainers]);
    useEffect(() => {
        if (kind !== "ssh" && sshAliasPopoverOpen) {
            setSshAliasPopoverOpen(false);
        }
    }, [kind, sshAliasPopoverOpen]);
    useEffect(() => {
        if (kind !== "docker" && dockerContainerPopoverOpen) {
            setDockerContainerPopoverOpen(false);
        }
    }, [dockerContainerPopoverOpen, kind]);
    useEffect(() => {
        if (!sshAliasPopoverOpen) {
            return;
        }
        const frameId = window.requestAnimationFrame(() => {
            const selectedAliasItem = sshAliasListRef.current?.querySelector('[data-ssh-config-alias-selected="true"]');
            selectedAliasItem?.scrollIntoView({ block: "nearest" });
        });
        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, [sshAliasPopoverOpen, selectedSshConfigAlias, sshConfigAliases.length]);
    switch (kind) {
        case "ssh":
            return (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "mb-1 block text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "ssh.configAlias" }) }), _jsxs(Popover, { open: sshAliasPopoverOpen, onOpenChange: setSshAliasPopoverOpen, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { type: "button", variant: "outline", size: "lg", disabled: sshConfigAliasesLoading || sshConfigAliases.length === 0, "data-testid": TID_SSH_CONFIG_ALIAS_SELECT, className: "h-9 w-full max-w-80 justify-between rounded-lg border-input-border bg-input px-3 text-ui-base font-normal hover:border-input-border-hover hover:bg-input aria-expanded:border-input-border-focused aria-expanded:bg-input-focused", children: [_jsx("span", { className: "min-w-0 truncate text-left", children: sshAliasTriggerLabel }), _jsx(ChevronDownIcon, { className: "size-3.5 text-foreground-subtle" })] }) }), _jsx(PopoverContent, { align: "start", sideOffset: 6, className: "w-80 gap-0 bg-menu p-0", children: _jsxs(Command, { className: "bg-transparent p-0 text-foreground", children: [_jsx(CommandInput, { placeholder: intl.formatMessage({
                                                        id: "ssh.configAliasSearchPlaceholder",
                                                    }), className: "h-8" }), _jsxs(CommandList, { ref: sshAliasListRef, className: "max-h-60 overscroll-contain", onWheel: handleSshAliasListWheel, children: [_jsx(CommandEmpty, { className: "px-4 py-5 text-foreground-subtle", children: intl.formatMessage({ id: "ssh.configAliasEmpty" }) }), _jsxs(CommandGroup, { className: "p-1", children: [_jsx(CommandItem, { value: NO_SSH_CONFIG_ALIAS_VALUE, "data-checked": selectedSshConfigAlias == null ? "true" : undefined, "data-ssh-config-alias-selected": selectedSshConfigAlias == null ? "true" : undefined, className: "min-h-8 cursor-pointer px-2 text-ui-base", onSelect: () => {
                                                                        clearSelectedSshConfigAlias();
                                                                        setSshAliasPopoverOpen(false);
                                                                    }, children: _jsx("span", { className: "truncate", children: intl.formatMessage({ id: "ssh.configAliasPlaceholder" }) }) }), sshConfigAliases.map((aliasOption) => (_jsx(CommandItem, { value: `${aliasOption.alias} ${formatSshConfigAliasSummary(aliasOption)}`, "data-checked": selectedSshConfigAlias === aliasOption.alias ? "true" : undefined, "data-ssh-config-alias-selected": selectedSshConfigAlias === aliasOption.alias ? "true" : undefined, className: "min-h-8 cursor-pointer px-2 text-ui-base", onSelect: () => {
                                                                        applySshConfigAlias(aliasOption);
                                                                        setSshAliasPopoverOpen(false);
                                                                    }, children: _jsxs("span", { className: "flex min-w-0 flex-1 flex-col text-left", children: [_jsx("span", { className: "truncate", children: aliasOption.alias }), _jsx("span", { className: "truncate text-ui-base text-foreground-subtle", children: formatSshConfigAliasSummary(aliasOption) })] }) }, aliasOption.alias)))] })] })] }) })] }), _jsx("p", { className: cn("text-ui-base", sshConfigAliasesError ? "text-warning" : "text-foreground-subtle"), children: sshConfigAliasesLoading
                                    ? intl.formatMessage({ id: "common.loading" })
                                    : sshConfigAliasesError
                                        ? intl.formatMessage({ id: "ssh.configAliasLoadFailed" })
                                        : sshConfigAliases.length === 0
                                            ? intl.formatMessage({ id: "ssh.configAliasEmpty" })
                                            : intl.formatMessage({ id: "ssh.configAliasDescription" }) })] }), _jsxs("div", { className: "grid gap-3 md:grid-cols-[minmax(0,1fr)_6.5rem]", children: [_jsx(RemoteConnectionHistoryInput, { className: "h-9 text-ui-base", label: intl.formatMessage({ id: "ssh.host" }), value: host, onChange: setHost, placeholder: intl.formatMessage({ id: "ssh.hostPlaceholder" }), suggestions: sshHistorySuggestions.hosts, emptyText: intl.formatMessage({ id: "remote.history.empty" }), suggestionWidth: "min(30ch, calc(100vw - 2rem))", autoCapitalize: "none", spellCheck: false, "data-testid": TID_SSH_HOST_INPUT }), _jsx(RemoteConnectionHistoryInput, { className: "h-9 text-ui-base", label: intl.formatMessage({ id: "ssh.port" }), value: port, onChange: setPort, placeholder: "22", suggestions: sshHistorySuggestions.ports, emptyText: intl.formatMessage({ id: "remote.history.empty" }), suggestionWidth: "min(8ch, calc(100vw - 2rem))", inputMode: "numeric", "data-testid": TID_SSH_PORT_INPUT })] }), _jsxs("div", { className: "grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-end", children: [_jsx(RemoteConnectionHistoryInput, { className: "h-9 text-ui-base", label: intl.formatMessage({ id: "ssh.username" }), value: username, onChange: setUsername, placeholder: intl.formatMessage({ id: "ssh.usernamePlaceholder" }), suggestions: sshHistorySuggestions.usernames, emptyText: intl.formatMessage({ id: "remote.history.empty" }), suggestionWidth: "min(30ch, calc(100vw - 2rem))", autoCapitalize: "none", spellCheck: false, "data-testid": TID_SSH_USERNAME_INPUT }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "ssh.authMethod" }) }), _jsx("div", { className: "inline-flex w-full items-center rounded-lg border border-input-border bg-input p-[3px]", children: ["password", "privateKey"].map((value) => {
                                            const selected = sshAuthMethod === value;
                                            return (_jsx("button", { type: "button", onClick: () => setSshAuthMethod(value), "data-testid": value === "password" ? TID_SSH_AUTH_PASSWORD : TID_SSH_AUTH_PRIVATE_KEY, className: cn("inline-flex h-7 flex-1 items-center justify-center rounded-md px-3 text-ui-base font-medium whitespace-nowrap transition-colors", selected
                                                    ? "bg-background text-foreground"
                                                    : "text-foreground-subtle hover:text-foreground"), children: intl.formatMessage({ id: `ssh.auth.${value}` }) }, value));
                                        }) })] })] }), sshAuthMethod === "password" ? (_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "ssh.password" }) }), _jsx(Input, { size: "lg", className: "h-9 text-ui-base", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: intl.formatMessage({
                                    id: "ssh.passwordPlaceholder",
                                }), name: "remote-ssh-password", autoComplete: "off", "data-testid": TID_SSH_PASSWORD_INPUT })] })) : (_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "ssh.privateKey" }) }), _jsxs("div", { className: "relative mb-3", children: [_jsx(RemoteConnectionHistoryInput, { className: "h-9 pr-10 text-ui-base", value: privateKeyPath, onChange: setPrivateKeyPath, placeholder: intl.formatMessage({
                                            id: "ssh.privateKeyPlaceholder",
                                        }), suggestions: sshHistorySuggestions.privateKeyPaths, emptyText: intl.formatMessage({
                                            id: "remote.history.empty",
                                        }), autoCapitalize: "none", spellCheck: false, "data-testid": TID_SSH_PRIVATE_KEY_INPUT }), _jsx(Button, { type: "button", variant: "ghost", size: "icon-lg", className: "absolute top-1/2 right-0.5 -translate-y-1/2", title: intl.formatMessage({ id: "ssh.privateKeySelect" }), onClick: () => {
                                            void (async () => {
                                                const selectedPath = await platform.selectFile();
                                                if (selectedPath) {
                                                    setPrivateKeyPath(selectedPath);
                                                }
                                            })();
                                        }, children: _jsx(Plus, { className: "size-4" }) })] }), _jsx("label", { className: "mb-1 block text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "ssh.privateKeyPassphrase" }) }), _jsx(Input, { size: "lg", className: "h-9 text-ui-base", type: "password", value: privateKeyPassphrase, onChange: (e) => setPrivateKeyPassphrase(e.target.value), placeholder: intl.formatMessage({
                                    id: "ssh.privateKeyPassphrasePlaceholder",
                                }), name: "remote-ssh-private-key-passphrase", autoComplete: "off" })] })), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "ssh.assetInstallMode" }) }), _jsx("div", { className: "inline-flex w-full max-w-md flex-col items-stretch rounded-lg border border-input-border bg-input p-[3px] sm:w-fit sm:flex-row sm:items-center", children: ["local-download-upload", "remote-download"].map((value) => {
                                    const selected = assetInstallMode === value;
                                    return (_jsx("button", { type: "button", onClick: () => setAssetInstallMode(value), className: cn("inline-flex min-h-7 min-w-0 flex-1 items-center justify-center rounded-md px-3 py-1 text-center text-ui-base font-medium transition-colors sm:flex-none", selected
                                            ? "bg-background text-foreground"
                                            : "text-foreground-subtle hover:text-foreground"), children: _jsx("span", { className: "min-w-0 break-words", children: intl.formatMessage({
                                                id: `ssh.assetInstallMode.${value}`,
                                            }) }) }, value));
                                }) }), _jsx("p", { className: "mt-1 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "ssh.assetInstallModeDescription" }) })] })] }));
        case "server":
            return (_jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "server.description" }) }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "server.url" }) }), _jsx(Input, { size: "lg", className: "h-9 text-ui-base", value: serverUrl, onChange: (event) => setServerUrl(event.target.value), placeholder: intl.formatMessage({ id: "server.urlPlaceholder" }), autoCapitalize: "none", spellCheck: false, "data-testid": TID_SERVER_URL_INPUT })] }), _jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "server.name" }) }), _jsx(Input, { size: "lg", className: "h-9 text-ui-base", value: serverName, onChange: (event) => setServerName(event.target.value), placeholder: intl.formatMessage({ id: "server.namePlaceholder" }), "data-testid": TID_SERVER_NAME_INPUT })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "server.token" }) }), _jsx(Input, { size: "lg", className: "h-9 text-ui-base", type: "password", value: serverToken, onChange: (event) => setServerToken(event.target.value), placeholder: intl.formatMessage({ id: "server.tokenPlaceholder" }), autoComplete: "off", "data-testid": TID_SERVER_TOKEN_INPUT })] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "server.workspacePath" }) }), _jsx(Input, { size: "lg", className: "h-9 text-ui-base", value: serverWorkspacePath, onChange: (event) => setServerWorkspacePath(event.target.value), placeholder: intl.formatMessage({ id: "server.workspacePathPlaceholder" }), autoCapitalize: "none", spellCheck: false, "data-testid": TID_SERVER_WORKSPACE_PATH_INPUT }), _jsx("p", { className: "mt-1 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "server.workspacePathDescription" }) })] })] }));
        case "wsl":
            return (_jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "wsl.description" }) }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "wsl.distro" }) }), wslDistros.length > 0 ? (_jsxs(Select, { value: wslDistro || DEFAULT_WSL_DISTRO_VALUE, onValueChange: (value) => {
                                    setWslDistro(value === DEFAULT_WSL_DISTRO_VALUE ? "" : value);
                                }, children: [_jsx(SelectTrigger, { size: "lg", className: "h-9 w-full", "data-testid": TID_WSL_DISTRO_SELECT, children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { align: "start", children: [_jsx(SelectItem, { value: DEFAULT_WSL_DISTRO_VALUE, children: intl.formatMessage({ id: "wsl.defaultDistro" }) }), wslDistros.map((distro) => (_jsx(SelectItem, { value: distro.name, children: distro.name }, distro.name)))] })] })) : (_jsx(Input, { size: "lg", className: "h-9 text-ui-base", value: wslDistro, onChange: (e) => setWslDistro(e.target.value), placeholder: intl.formatMessage({ id: "wsl.defaultDistro" }) }))] }), _jsx("p", { className: "text-ui-base text-foreground-subtle", children: runtimeOptionsLoading
                            ? intl.formatMessage({ id: "wsl.loading" })
                            : wslDistros.length > 0
                                ? intl.formatMessage({ id: "wsl.detectedCount" }, {
                                    count: String(wslDistros.length),
                                })
                                : intl.formatMessage({ id: "wsl.noDistros" }) }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "wsl.user" }) }), _jsx(Input, { size: "lg", className: "h-9 text-ui-base", value: wslUser, onChange: (event) => setWslUser?.(event.target.value), placeholder: intl.formatMessage({ id: "wsl.defaultUser" }), autoCapitalize: "none", spellCheck: false, "aria-invalid": wslUserIsInvalid, "data-testid": TID_WSL_USER_INPUT }), _jsx("p", { className: cn("mt-1 text-ui-base", wslUserIsInvalid ? "text-destructive" : "text-foreground-subtle"), children: intl.formatMessage({
                                    id: wslUserIsInvalid
                                        ? "wsl.validation.invalidUser"
                                        : "wsl.userDescription",
                                }) })] }), wslUserIsRoot ? (_jsxs("div", { className: "flex items-start gap-2 rounded-lg border border-warning bg-warning px-3 py-2 text-ui-base text-warning-foreground", children: [_jsx(AlertTriangleIcon, { className: "mt-0.5 size-4 shrink-0" }), _jsx("span", { children: intl.formatMessage({ id: "wsl.rootWarning" }) })] })) : null] }));
        case "docker":
            return (_jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "docker.description" }) }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "docker.selectContainer" }) }), _jsxs(Popover, { open: dockerContainerPopoverOpen, onOpenChange: handleDockerContainerPopoverOpenChange, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { type: "button", variant: "outline", size: "lg", "data-testid": TID_DOCKER_CONTAINER_SELECT, className: "h-9 w-full justify-between rounded-lg border-input-border bg-input px-3 text-ui-base font-normal hover:border-input-border-hover hover:bg-input aria-expanded:border-input-border-focused aria-expanded:bg-input-focused", children: [_jsx("span", { className: cn("min-w-0 truncate text-left", dockerContainerTriggerIsPlaceholder
                                                        ? "text-foreground-subtlest"
                                                        : "text-foreground"), children: dockerContainerTriggerLabel }), runtimeOptionsLoading ? (_jsx(LoaderIcon, { className: "size-3.5 shrink-0 animate-spin text-foreground-subtle" })) : (_jsx(ChevronDownIcon, { className: "size-3.5 shrink-0 text-foreground-subtle" }))] }) }), _jsx(PopoverContent, { align: "start", sideOffset: 6, className: "max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-menu p-1 shadow-lg", style: { width: "var(--radix-popover-trigger-width)" }, children: _jsx(Command, { className: "rounded-lg bg-transparent p-0 text-foreground", children: _jsxs(CommandList, { className: "max-h-56 scroll-py-1", children: [runtimeOptionsLoading ? (_jsxs("div", { className: "flex min-h-8 items-center gap-2 rounded-lg px-3 py-1.5 text-ui-base text-foreground-subtle", children: [_jsx(LoaderIcon, { className: "size-3.5 shrink-0 animate-spin" }), _jsx("span", { className: "truncate", children: intl.formatMessage({ id: "docker.loading" }) })] })) : null, dockerContainers.length === 0 && !runtimeOptionsLoading ? (_jsx(CommandEmpty, { className: "px-3 py-5 text-ui-base text-foreground-subtle", children: dockerContainerEmptyText })) : (dockerContainers.map((container) => {
                                                        const selected = container.name === dockerContainer;
                                                        return (_jsxs(CommandItem, { value: container.name, className: "min-h-8 cursor-pointer rounded-lg px-3 py-1.5 text-ui-base text-foreground data-selected:bg-menu-hover data-selected:text-foreground", onSelect: () => {
                                                                setDockerContainer(container.name);
                                                                setDockerContainerPopoverOpen(false);
                                                            }, children: [_jsx("span", { className: "min-w-0 flex-1 truncate", children: container.name }), _jsx(CheckIcon, { className: cn("size-4 shrink-0 text-foreground-subtle", selected ? "opacity-100" : "opacity-0") })] }, container.id));
                                                    }))] }) }) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "docker.container" }) }), _jsx(Input, { size: "lg", className: "h-9 text-ui-base", value: manualDockerContainer, onChange: (event) => setManualDockerContainer(event.target.value), placeholder: intl.formatMessage({ id: "docker.containerPlaceholder" }), "data-testid": TID_DOCKER_CONTAINER_INPUT }), manualDockerContainerIsEmpty ? (_jsx("p", { className: "mt-1 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "docker.manualContainerHint" }) })) : null] })] }));
    }
}
//# sourceMappingURL=RemoteConnectionFields.js.map