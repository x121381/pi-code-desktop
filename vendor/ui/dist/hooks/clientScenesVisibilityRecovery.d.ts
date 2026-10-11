type VisibilityDocument = Pick<Document, "visibilityState" | "addEventListener" | "removeEventListener">;
/** Page Visibility 恢复协调器：同一 authority 可有多个 React 消费方，每次重开只执行一个回调。 */
export declare function createClientScenesVisibilityRecovery(documentTarget: VisibilityDocument): {
    subscribe(authority: object, revalidate: () => void): () => void;
};
export {};
//# sourceMappingURL=clientScenesVisibilityRecovery.d.ts.map