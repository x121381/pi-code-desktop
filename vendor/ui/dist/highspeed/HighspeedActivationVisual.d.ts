/**
 * 仅渲染 Highspeed 输入壳的视觉层；激活资格、有效期和模型仍由外部卡片快照决定。
 */
export declare const HighspeedComposerBackground: import("react").MemoExoticComponent<({ animated, onModelTransitionStart, }: {
    /**
     * 是否为 draw 新命中的激活入场。恢复入场直接从 stable 挂载，不挂载扩散 Canvas；
     * 入场方式只在挂载时生效，宿主以 cardId 作 key。
     */
    animated: boolean;
    onModelTransitionStart: () => void;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=HighspeedActivationVisual.d.ts.map