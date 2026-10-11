import { Button } from "../ui/button.js";
import type { ComponentProps } from "react";
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
    onend: ((this: SpeechRecognition, ev: Event) => void) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
}
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}
interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionResult {
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
}
interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}
interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}
declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}
export type SpeechInputProps = ComponentProps<typeof Button> & {
    onTranscriptionChange?: (text: string) => void;
    /**
     * Callback for when audio is recorded using MediaRecorder fallback.
     * This is called in browsers that don't support the Web Speech API (Firefox, Safari).
     * The callback receives an audio Blob that should be sent to a transcription service.
     * Return the transcribed text, which will be passed to onTranscriptionChange.
     */
    onAudioRecorded?: (audioBlob: Blob) => Promise<string>;
    lang?: string;
};
export declare const SpeechInput: ({ className, onTranscriptionChange, onAudioRecorded, lang, ...props }: SpeechInputProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=speech-input.d.ts.map