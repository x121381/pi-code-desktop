import { TopicWireFrameAssembler, type TopicWireAssemblyFault, type TopicFrameDeliveryKind, type TopicWireFrameCandidate } from "@zcode/shared/zcode-protocol-v4";
export interface TopicWireDecoder {
    accept(wire: TopicWireFrameCandidate): void;
    /** same-sub recovery：只清 fail-closed flag，保留 assembler ordinal tombstone。 */
    recover(topic: string, subscriptionId: string): void;
    discard(topic: string, subscriptionId: string): void;
    clear(): void;
}
/**
 * renderer 侧 physical → logical 原子边界。assembler 只在齐片且校验通过时
 * 产出 logical frame；30s timeout 用单个最近到期 timer 驱动，避免每片建 timer。
 */
export declare function createTopicWireDecoder<F extends {
    topic: string;
    subscriptionId: string;
}>(assembler: TopicWireFrameAssembler<F>, deliver: (frame: F, deliveryKind: TopicFrameDeliveryKind) => void, onFault?: (fault: TopicWireAssemblyFault) => void): TopicWireDecoder;
//# sourceMappingURL=topicWireDecoder.d.ts.map