/*
 * Derived from vercel/ai-elements (packages/elements/src/prompt-input.tsx).
 * Copyright 2023 Vercel, Inc. Licensed under Apache-2.0.
 * Modified by ZCode: split components and adapt local imports and behavior.
 * See THIRD-PARTY-NOTICES.md in the repository root for license and provenance.
 */
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "../ui/dropdown-menu.js";
import { cn } from "../lib/utils.js";
import { ImageIcon, Monitor, PlusIcon } from "lucide-react";
import { useCallback } from "react";
import { usePromptInputAttachments } from "./prompt-input.js";
import { PromptInputButton } from "./prompt-input-buttons.js";
// ============================================================================
// Helpers
// ============================================================================
const captureScreenshot = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getDisplayMedia) {
        return null;
    }
    let stream = null;
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    try {
        stream = await navigator.mediaDevices.getDisplayMedia({
            audio: false,
            video: true,
        });
        video.srcObject = stream;
        // Video element uses callback-based API, wrapping in Promise is necessary
        // oxlint-disable-next-line eslint-plugin-promise(avoid-new)
        await new Promise((resolve, reject) => {
            // oxlint-disable-next-line eslint-plugin-unicorn(prefer-add-event-listener)
            video.onloadedmetadata = () => resolve();
            // oxlint-disable-next-line eslint-plugin-unicorn(prefer-add-event-listener)
            video.onerror = () => reject(new Error("Failed to load screen stream"));
        });
        await video.play();
        const width = video.videoWidth;
        const height = video.videoHeight;
        if (!width || !height) {
            return null;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) {
            return null;
        }
        context.drawImage(video, 0, 0, width, height);
        // canvas.toBlob uses callback-based API, wrapping in Promise is necessary
        // oxlint-disable-next-line eslint-plugin-promise(avoid-new)
        const blob = await new Promise((resolve) => {
            canvas.toBlob(resolve, "image/png");
        });
        if (!blob) {
            return null;
        }
        const timestamp = new Date()
            .toISOString()
            .replaceAll(/[:.]/g, "-")
            .replace("T", "_")
            .replace("Z", "");
        return new File([blob], `screenshot-${timestamp}.png`, {
            lastModified: Date.now(),
            type: "image/png",
        });
    }
    finally {
        if (stream) {
            for (const track of stream.getTracks()) {
                track.stop();
            }
        }
        video.pause();
        video.srcObject = null;
    }
};
export const PromptInputActionAddAttachments = ({ label = "Add photos or files", ...props }) => {
    const attachments = usePromptInputAttachments();
    const handleSelect = useCallback((e) => {
        e.preventDefault();
        attachments.openFileDialog();
    }, [attachments]);
    return (_jsxs(DropdownMenuItem, { ...props, onSelect: handleSelect, children: [_jsx(ImageIcon, { className: "mr-2 size-4" }), " ", label] }));
};
export const PromptInputActionAddScreenshot = ({ label = "Take screenshot", onSelect, ...props }) => {
    const attachments = usePromptInputAttachments();
    const handleSelect = useCallback(async (event) => {
        onSelect?.(event);
        if (event.defaultPrevented) {
            return;
        }
        try {
            const screenshot = await captureScreenshot();
            if (screenshot) {
                attachments.add([screenshot]);
            }
        }
        catch (error) {
            if (error instanceof DOMException &&
                (error.name === "NotAllowedError" || error.name === "AbortError")) {
                return;
            }
            throw error;
        }
    }, [onSelect, attachments]);
    return (_jsxs(DropdownMenuItem, { ...props, onSelect: handleSelect, children: [_jsx(Monitor, { className: "mr-2 size-4" }), label] }));
};
export const PromptInputActionMenu = (props) => (_jsx(DropdownMenu, { ...props }));
export const PromptInputActionMenuTrigger = ({ className, children, ...props }) => (_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(PromptInputButton, { className: className, ...props, children: children ?? _jsx(PlusIcon, { className: "size-4" }) }) }));
export const PromptInputActionMenuContent = ({ className, ...props }) => (_jsx(DropdownMenuContent, { align: "start", className: cn(className), ...props }));
export const PromptInputActionMenuItem = ({ className, ...props }) => _jsx(DropdownMenuItem, { className: cn(className), ...props });
//# sourceMappingURL=prompt-input-actions.js.map