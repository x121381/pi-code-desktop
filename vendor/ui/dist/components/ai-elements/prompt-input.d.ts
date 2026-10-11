import { InputGroupAddon } from "../ui/input-group.js";
import type { FileUIPart, SourceDocumentUIPart } from "ai";
import type { ComponentProps, FormEvent, HTMLAttributes, PropsWithChildren, RefObject } from "react";
export interface AttachmentsContext {
    files: (FileUIPart & {
        id: string;
    })[];
    add: (files: File[] | FileList) => void;
    remove: (id: string) => void;
    clear: () => void;
    openFileDialog: () => void;
    fileInputRef: RefObject<HTMLInputElement | null>;
}
export interface TextInputContext {
    value: string;
    setInput: (v: string) => void;
    clear: () => void;
}
export interface PromptInputControllerProps {
    textInput: TextInputContext;
    attachments: AttachmentsContext;
    /** INTERNAL: Allows PromptInput to register its file textInput + "open" callback */
    __registerFileInput: (ref: RefObject<HTMLInputElement | null>, open: () => void) => void;
}
export declare const usePromptInputController: () => PromptInputControllerProps;
export declare const useOptionalPromptInputController: () => PromptInputControllerProps | null;
export declare const useProviderAttachments: () => AttachmentsContext;
export type PromptInputProviderProps = PropsWithChildren<{
    initialInput?: string;
}>;
/**
 * Optional global provider that lifts PromptInput state outside of PromptInput.
 * If you don't use it, PromptInput stays fully self-managed.
 */
export declare const PromptInputProvider: ({ initialInput: initialTextInput, children, }: PromptInputProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare const usePromptInputAttachments: () => AttachmentsContext;
export interface ReferencedSourcesContext {
    sources: (SourceDocumentUIPart & {
        id: string;
    })[];
    add: (sources: SourceDocumentUIPart[] | SourceDocumentUIPart) => void;
    remove: (id: string) => void;
    clear: () => void;
}
export declare const LocalReferencedSourcesContext: import("react").Context<ReferencedSourcesContext | null>;
export declare const usePromptInputReferencedSources: () => ReferencedSourcesContext;
export interface PromptInputMessage {
    text: string;
    files: FileUIPart[];
}
export type PromptInputProps = Omit<HTMLAttributes<HTMLFormElement>, "onSubmit" | "onError"> & {
    accept?: string;
    multiple?: boolean;
    globalDrop?: boolean;
    syncHiddenInput?: boolean;
    maxFiles?: number;
    maxFileSize?: number;
    onError?: (err: {
        code: "max_files" | "max_file_size" | "accept";
        message: string;
    }) => void;
    onSubmit: (message: PromptInputMessage, event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};
export declare const PromptInput: ({ className, accept, multiple, globalDrop, syncHiddenInput, maxFiles, maxFileSize, onError, onSubmit, children, ...props }: PromptInputProps) => import("react/jsx-runtime").JSX.Element;
export type PromptInputBodyProps = HTMLAttributes<HTMLDivElement>;
export declare const PromptInputBody: ({ className, ...props }: PromptInputBodyProps) => import("react/jsx-runtime").JSX.Element;
export type PromptInputHeaderProps = Omit<ComponentProps<typeof InputGroupAddon>, "align">;
export declare const PromptInputHeader: ({ className, ...props }: PromptInputHeaderProps) => import("react/jsx-runtime").JSX.Element;
export type PromptInputFooterProps = Omit<ComponentProps<typeof InputGroupAddon>, "align">;
export declare const PromptInputFooter: ({ className, ...props }: PromptInputFooterProps) => import("react/jsx-runtime").JSX.Element;
export type PromptInputToolsProps = HTMLAttributes<HTMLDivElement>;
export declare const PromptInputTools: ({ className, ...props }: PromptInputToolsProps) => import("react/jsx-runtime").JSX.Element;
export * from "./prompt-input-buttons.js";
export * from "./prompt-input-actions.js";
export * from "./prompt-input-textarea.js";
export * from "./prompt-input-primitives.js";
//# sourceMappingURL=prompt-input.d.ts.map