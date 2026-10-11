import type { WorkflowRunPendingQuestion } from "@zcode/shared/zcode-protocol-v4";
/**
 * 一条升级问题：挂在提问者那一行下面。
 *
 * **只读，v1 没有应答框**：应答者是主代理，不是用户——它拿不准时本就可经 AskUserQuestion
 * 转询用户。qid 是主代理作答时要用的那个 token；用户自己答不了，但把它显示出来，就能指着
 * 某一个问题让主代理去答——这是只读面里唯一可被转达的抓手。
 */
export declare function WorkflowRunQuestionRow({ className, now, question, showAsker, }: {
    /** 落位由调用方给（脊线里挂在提问者下面再退 26px；末尾的孤儿块自己有内缩）。 */
    className?: string;
    /** 由清单的定时器喂进来的"现在"，好让等待时长在没有事件流的时候也照走。 */
    now: number;
    question: WorkflowRunPendingQuestion;
    /** 匹配不上提问者的问题（挂在阶段末尾）要自己报名字；挂在行下的不必重复。 */
    showAsker?: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowRunQuestionRow.d.ts.map