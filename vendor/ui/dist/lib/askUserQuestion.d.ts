type ZCodeUserQuestionAnswers = Record<string, unknown>;
type AskUserQuestionType = "single" | "multiple";
interface AskUserQuestionOption {
    id: string;
    label: string;
    description?: string;
    placeholder?: string;
    requiresInput: boolean;
}
interface AskUserQuestionItem {
    id: string;
    question: string;
    type: AskUserQuestionType;
    options: AskUserQuestionOption[];
    customInput?: AskUserQuestionOption;
}
interface AskUserQuestionData {
    questions: AskUserQuestionItem[];
    answers?: ZCodeUserQuestionAnswers;
}
export declare function normalizeAskUserQuestionInput(input: unknown): AskUserQuestionData;
export declare function readAskUserQuestionInput(value: {
    input?: unknown;
    output?: unknown;
    raw?: unknown;
}): unknown;
export declare function readAskUserQuestionAnswers(value: {
    input?: unknown;
    output?: unknown;
    raw?: unknown;
}): ZCodeUserQuestionAnswers | undefined;
export declare function getAskUserQuestionAnswerText(question: AskUserQuestionItem, answers: ZCodeUserQuestionAnswers | undefined, noAnswerText: string): string;
export {};
//# sourceMappingURL=askUserQuestion.d.ts.map