/*
 * Derived from vercel/ai-elements (packages/elements/src/prompt-input.tsx).
 * Copyright 2023 Vercel, Inc. Licensed under Apache-2.0.
 * Modified by ZCode: local integration, formatting and adaptations.
 * See THIRD-PARTY-NOTICES.md in the repository root for license and provenance.
 */
"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { InputGroup, InputGroupAddon } from "../ui/input-group.js";
import { cn } from "../lib/utils.js";
import { nanoid } from "nanoid";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, } from "react";
// ============================================================================
// Helpers
// ============================================================================
const convertBlobUrlToDataUrl = async (url) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        // FileReader uses callback-based API, wrapping in Promise is necessary
        // oxlint-disable-next-line eslint-plugin-promise(avoid-new)
        return new Promise((resolve) => {
            const reader = new FileReader();
            // oxlint-disable-next-line eslint-plugin-unicorn(prefer-add-event-listener)
            reader.onloadend = () => resolve(reader.result);
            // oxlint-disable-next-line eslint-plugin-unicorn(prefer-add-event-listener)
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
        });
    }
    catch {
        return null;
    }
};
const PromptInputController = createContext(null);
const ProviderAttachmentsContext = createContext(null);
export const usePromptInputController = () => {
    const ctx = useContext(PromptInputController);
    if (!ctx) {
        throw new Error("Wrap your component inside <PromptInputProvider> to use usePromptInputController().");
    }
    return ctx;
};
// Optional variants (do NOT throw). Useful for dual-mode components.
export const useOptionalPromptInputController = () => useContext(PromptInputController);
export const useProviderAttachments = () => {
    const ctx = useContext(ProviderAttachmentsContext);
    if (!ctx) {
        throw new Error("Wrap your component inside <PromptInputProvider> to use useProviderAttachments().");
    }
    return ctx;
};
const useOptionalProviderAttachments = () => useContext(ProviderAttachmentsContext);
/**
 * Optional global provider that lifts PromptInput state outside of PromptInput.
 * If you don't use it, PromptInput stays fully self-managed.
 */
export const PromptInputProvider = ({ initialInput: initialTextInput = "", children, }) => {
    // ----- textInput state
    const [textInput, setTextInput] = useState(initialTextInput);
    const clearInput = useCallback(() => setTextInput(""), []);
    // ----- attachments state (global when wrapped)
    const [attachmentFiles, setAttachmentFiles] = useState([]);
    const fileInputRef = useRef(null);
    // oxlint-disable-next-line eslint(no-empty-function)
    const openRef = useRef(() => { });
    const add = useCallback((files) => {
        const incoming = [...files];
        if (incoming.length === 0) {
            return;
        }
        setAttachmentFiles((prev) => [
            ...prev,
            ...incoming.map((file) => ({
                filename: file.name,
                id: nanoid(),
                mediaType: file.type,
                type: "file",
                url: URL.createObjectURL(file),
            })),
        ]);
    }, []);
    const remove = useCallback((id) => {
        setAttachmentFiles((prev) => {
            const found = prev.find((f) => f.id === id);
            if (found?.url) {
                URL.revokeObjectURL(found.url);
            }
            return prev.filter((f) => f.id !== id);
        });
    }, []);
    const clear = useCallback(() => {
        setAttachmentFiles((prev) => {
            for (const f of prev) {
                if (f.url) {
                    URL.revokeObjectURL(f.url);
                }
            }
            return [];
        });
    }, []);
    // Keep a ref to attachments for cleanup on unmount (avoids stale closure)
    const attachmentsRef = useRef(attachmentFiles);
    useEffect(() => {
        attachmentsRef.current = attachmentFiles;
    }, [attachmentFiles]);
    // Cleanup blob URLs on unmount to prevent memory leaks
    useEffect(() => () => {
        for (const f of attachmentsRef.current) {
            if (f.url) {
                URL.revokeObjectURL(f.url);
            }
        }
    }, []);
    const openFileDialog = useCallback(() => {
        openRef.current?.();
    }, []);
    const attachments = useMemo(() => ({
        add,
        clear,
        fileInputRef,
        files: attachmentFiles,
        openFileDialog,
        remove,
    }), [attachmentFiles, add, remove, clear, openFileDialog]);
    const __registerFileInput = useCallback((ref, open) => {
        fileInputRef.current = ref.current;
        openRef.current = open;
    }, []);
    const controller = useMemo(() => ({
        __registerFileInput,
        attachments,
        textInput: {
            clear: clearInput,
            setInput: setTextInput,
            value: textInput,
        },
    }), [textInput, clearInput, attachments, __registerFileInput]);
    return (_jsx(PromptInputController.Provider, { value: controller, children: _jsx(ProviderAttachmentsContext.Provider, { value: attachments, children: children }) }));
};
// ============================================================================
// Component Context & Hooks
// ============================================================================
const LocalAttachmentsContext = createContext(null);
export const usePromptInputAttachments = () => {
    // Prefer local context (inside PromptInput) as it has validation, fall back to provider
    const provider = useOptionalProviderAttachments();
    const local = useContext(LocalAttachmentsContext);
    const context = local ?? provider;
    if (!context) {
        throw new Error("usePromptInputAttachments must be used within a PromptInput or PromptInputProvider");
    }
    return context;
};
export const LocalReferencedSourcesContext = createContext(null);
export const usePromptInputReferencedSources = () => {
    const ctx = useContext(LocalReferencedSourcesContext);
    if (!ctx) {
        throw new Error("usePromptInputReferencedSources must be used within a LocalReferencedSourcesContext.Provider");
    }
    return ctx;
};
export const PromptInput = ({ className, accept, multiple, globalDrop, syncHiddenInput, maxFiles, maxFileSize, onError, onSubmit, children, ...props }) => {
    // Try to use a provider controller if present
    const controller = useOptionalPromptInputController();
    const usingProvider = !!controller;
    // Refs
    const inputRef = useRef(null);
    const formRef = useRef(null);
    // ----- Local attachments (only used when no provider)
    const [items, setItems] = useState([]);
    const files = usingProvider ? controller.attachments.files : items;
    // ----- Local referenced sources (always local to PromptInput)
    const [referencedSources, setReferencedSources] = useState([]);
    // Keep a ref to files for cleanup on unmount (avoids stale closure)
    const filesRef = useRef(files);
    useEffect(() => {
        filesRef.current = files;
    }, [files]);
    const openFileDialogLocal = useCallback(() => {
        inputRef.current?.click();
    }, []);
    const matchesAccept = useCallback((f) => {
        if (!accept || accept.trim() === "") {
            return true;
        }
        const patterns = accept
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        return patterns.some((pattern) => {
            if (pattern.endsWith("/*")) {
                // e.g: image/* -> image/
                const prefix = pattern.slice(0, -1);
                return f.type.startsWith(prefix);
            }
            return f.type === pattern;
        });
    }, [accept]);
    const addLocal = useCallback((fileList) => {
        const incoming = [...fileList];
        const accepted = incoming.filter((f) => matchesAccept(f));
        if (incoming.length && accepted.length === 0) {
            onError?.({
                code: "accept",
                message: "No files match the accepted types.",
            });
            return;
        }
        const withinSize = (f) => (maxFileSize ? f.size <= maxFileSize : true);
        const sized = accepted.filter(withinSize);
        if (accepted.length > 0 && sized.length === 0) {
            onError?.({
                code: "max_file_size",
                message: "All files exceed the maximum size.",
            });
            return;
        }
        setItems((prev) => {
            const capacity = typeof maxFiles === "number" ? Math.max(0, maxFiles - prev.length) : undefined;
            const capped = typeof capacity === "number" ? sized.slice(0, capacity) : sized;
            if (typeof capacity === "number" && sized.length > capacity) {
                onError?.({
                    code: "max_files",
                    message: "Too many files. Some were not added.",
                });
            }
            const next = [];
            for (const file of capped) {
                next.push({
                    filename: file.name,
                    id: nanoid(),
                    mediaType: file.type,
                    type: "file",
                    url: URL.createObjectURL(file),
                });
            }
            return [...prev, ...next];
        });
    }, [matchesAccept, maxFiles, maxFileSize, onError]);
    const removeLocal = useCallback((id) => setItems((prev) => {
        const found = prev.find((file) => file.id === id);
        if (found?.url) {
            URL.revokeObjectURL(found.url);
        }
        return prev.filter((file) => file.id !== id);
    }), []);
    // Wrapper that validates files before calling provider's add
    const addWithProviderValidation = useCallback((fileList) => {
        const incoming = [...fileList];
        const accepted = incoming.filter((f) => matchesAccept(f));
        if (incoming.length && accepted.length === 0) {
            onError?.({
                code: "accept",
                message: "No files match the accepted types.",
            });
            return;
        }
        const withinSize = (f) => (maxFileSize ? f.size <= maxFileSize : true);
        const sized = accepted.filter(withinSize);
        if (accepted.length > 0 && sized.length === 0) {
            onError?.({
                code: "max_file_size",
                message: "All files exceed the maximum size.",
            });
            return;
        }
        const currentCount = files.length;
        const capacity = typeof maxFiles === "number" ? Math.max(0, maxFiles - currentCount) : undefined;
        const capped = typeof capacity === "number" ? sized.slice(0, capacity) : sized;
        if (typeof capacity === "number" && sized.length > capacity) {
            onError?.({
                code: "max_files",
                message: "Too many files. Some were not added.",
            });
        }
        if (capped.length > 0) {
            controller?.attachments.add(capped);
        }
    }, [matchesAccept, maxFileSize, maxFiles, onError, files.length, controller]);
    const clearAttachments = useCallback(() => usingProvider
        ? controller?.attachments.clear()
        : setItems((prev) => {
            for (const file of prev) {
                if (file.url) {
                    URL.revokeObjectURL(file.url);
                }
            }
            return [];
        }), [usingProvider, controller]);
    const clearReferencedSources = useCallback(() => setReferencedSources([]), []);
    const add = usingProvider ? addWithProviderValidation : addLocal;
    const remove = usingProvider ? controller.attachments.remove : removeLocal;
    const openFileDialog = usingProvider
        ? controller.attachments.openFileDialog
        : openFileDialogLocal;
    const clear = useCallback(() => {
        clearAttachments();
        clearReferencedSources();
    }, [clearAttachments, clearReferencedSources]);
    // Let provider know about our hidden file input so external menus can call openFileDialog()
    useEffect(() => {
        if (!usingProvider) {
            return;
        }
        controller.__registerFileInput(inputRef, () => inputRef.current?.click());
    }, [usingProvider, controller]);
    // Note: File input cannot be programmatically set for security reasons
    // The syncHiddenInput prop is no longer functional
    useEffect(() => {
        if (syncHiddenInput && inputRef.current && files.length === 0) {
            inputRef.current.value = "";
        }
    }, [files, syncHiddenInput]);
    // Attach drop handlers on nearest form and document (opt-in)
    useEffect(() => {
        const form = formRef.current;
        if (!form) {
            return;
        }
        if (globalDrop) {
            // when global drop is on, let the document-level handler own drops
            return;
        }
        const onDragOver = (e) => {
            if (e.dataTransfer?.types?.includes("Files")) {
                e.preventDefault();
            }
        };
        const onDrop = (e) => {
            if (e.dataTransfer?.types?.includes("Files")) {
                e.preventDefault();
            }
            if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
                add(e.dataTransfer.files);
            }
        };
        form.addEventListener("dragover", onDragOver);
        form.addEventListener("drop", onDrop);
        return () => {
            form.removeEventListener("dragover", onDragOver);
            form.removeEventListener("drop", onDrop);
        };
    }, [add, globalDrop]);
    useEffect(() => {
        if (!globalDrop) {
            return;
        }
        const onDragOver = (e) => {
            if (e.dataTransfer?.types?.includes("Files")) {
                e.preventDefault();
            }
        };
        const onDrop = (e) => {
            if (e.dataTransfer?.types?.includes("Files")) {
                e.preventDefault();
            }
            if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
                add(e.dataTransfer.files);
            }
        };
        document.addEventListener("dragover", onDragOver);
        document.addEventListener("drop", onDrop);
        return () => {
            document.removeEventListener("dragover", onDragOver);
            document.removeEventListener("drop", onDrop);
        };
    }, [add, globalDrop]);
    useEffect(() => () => {
        if (!usingProvider) {
            for (const f of filesRef.current) {
                if (f.url) {
                    URL.revokeObjectURL(f.url);
                }
            }
        }
    }, [usingProvider]);
    const handleChange = useCallback((event) => {
        if (event.currentTarget.files) {
            add(event.currentTarget.files);
        }
        // Reset input value to allow selecting files that were previously removed
        event.currentTarget.value = "";
    }, [add]);
    const attachmentsCtx = useMemo(() => ({
        add,
        clear: clearAttachments,
        fileInputRef: inputRef,
        files: files.map((item) => ({ ...item, id: item.id })),
        openFileDialog,
        remove,
    }), [files, add, remove, clearAttachments, openFileDialog]);
    const refsCtx = useMemo(() => ({
        add: (incoming) => {
            const array = Array.isArray(incoming) ? incoming : [incoming];
            setReferencedSources((prev) => [...prev, ...array.map((s) => ({ ...s, id: nanoid() }))]);
        },
        clear: clearReferencedSources,
        remove: (id) => {
            setReferencedSources((prev) => prev.filter((s) => s.id !== id));
        },
        sources: referencedSources,
    }), [referencedSources, clearReferencedSources]);
    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const text = usingProvider
            ? controller.textInput.value
            : (() => {
                const formData = new FormData(form);
                return formData.get("message") || "";
            })();
        // Reset form immediately after capturing text to avoid race condition
        // where user input during async blob conversion would be lost
        if (!usingProvider) {
            form.reset();
        }
        try {
            // Convert blob URLs to data URLs asynchronously
            const convertedFiles = await Promise.all(files.map(async ({ id: _id, ...item }) => {
                if (item.url?.startsWith("blob:")) {
                    const dataUrl = await convertBlobUrlToDataUrl(item.url);
                    // If conversion failed, keep the original blob URL
                    return {
                        ...item,
                        url: dataUrl ?? item.url,
                    };
                }
                return item;
            }));
            const result = onSubmit({ files: convertedFiles, text }, event);
            // Handle both sync and async onSubmit
            if (result instanceof Promise) {
                try {
                    await result;
                    clear();
                    if (usingProvider) {
                        controller.textInput.clear();
                    }
                }
                catch {
                    // Don't clear on error - user may want to retry
                }
            }
            else {
                // Sync function completed without throwing, clear inputs
                clear();
                if (usingProvider) {
                    controller.textInput.clear();
                }
            }
        }
        catch {
            // Don't clear on error - user may want to retry
        }
    }, [usingProvider, controller, files, onSubmit, clear]);
    // Render with or without local provider
    const inner = (_jsxs(_Fragment, { children: [_jsx("input", { accept: accept, "aria-label": "Upload files", className: "hidden", multiple: multiple, onChange: handleChange, ref: inputRef, title: "Upload files", type: "file" }), _jsx("form", { className: cn("w-full", className), onSubmit: handleSubmit, ref: formRef, ...props, children: _jsx(InputGroup, { className: "overflow-hidden", children: children }) })] }));
    const withReferencedSources = (_jsx(LocalReferencedSourcesContext.Provider, { value: refsCtx, children: inner }));
    // Always provide LocalAttachmentsContext so children get validated add function
    return (_jsx(LocalAttachmentsContext.Provider, { value: attachmentsCtx, children: withReferencedSources }));
};
export const PromptInputBody = ({ className, ...props }) => (_jsx("div", { className: cn("contents", className), ...props }));
export const PromptInputHeader = ({ className, ...props }) => (_jsx(InputGroupAddon, { align: "block-end", className: cn("order-first flex-wrap gap-1", className), ...props }));
export const PromptInputFooter = ({ className, ...props }) => (_jsx(InputGroupAddon, { align: "block-end", className: cn("justify-between gap-1", className), ...props }));
export const PromptInputTools = ({ className, ...props }) => (_jsx("div", { className: cn("flex min-w-0 items-center gap-1", className), ...props }));
// 从 prompt-input-buttons 重新导出 Button / Submit 组件
export * from "./prompt-input-buttons.js";
// 从 prompt-input-actions 重新导出 Action 系列组件
export * from "./prompt-input-actions.js";
// 从 prompt-input-textarea 重新导出 Textarea 组件
export * from "./prompt-input-textarea.js";
// 从 prompt-input-primitives 重新导出 Select / HoverCard / Tabs / Command 系列组件
export * from "./prompt-input-primitives.js";
//# sourceMappingURL=prompt-input.js.map