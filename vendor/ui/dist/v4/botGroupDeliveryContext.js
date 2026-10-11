import { createContext, useContext } from "react";
export const DeliveryContext = createContext(null);
export function useBotTopicInterruption(sourceCommandIds) {
    const value = useContext(DeliveryContext);
    const group = value?.context?.group;
    return (!!group?.threadId &&
        sourceCommandIds.some((id) => {
            const input = group.inputs?.[id];
            return (input?.taskId === value?.taskId && input?.progress?.interruptionReason === "newMessage");
        }));
}
//# sourceMappingURL=botGroupDeliveryContext.js.map