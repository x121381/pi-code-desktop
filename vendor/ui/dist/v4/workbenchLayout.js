/** 分割占比 CSS 变量前缀（每个分割节点一个 `--v4-split-<nodeId>`）。 */
export const SPLIT_VAR_PREFIX = "--v4-split-";
const ROOT_RECT = {
    left: "0%",
    top: "0%",
    width: "100%",
    height: "100%",
};
function collectNode(node, rect, widthFraction, heightFraction, leaves, dividers) {
    if (node.type === "leaf") {
        leaves.push({ paneId: node.paneId, rect });
        return;
    }
    const ratioVar = `var(${SPLIT_VAR_PREFIX}${node.id}, ${node.ratio})`;
    if (node.direction === "row") {
        const boundary = `(${rect.left}) + (${rect.width}) * ${ratioVar}`;
        dividers.push({
            splitId: node.id,
            direction: "row",
            ratio: node.ratio,
            regionFraction: widthFraction,
            boundary,
            crossStart: rect.top,
            crossLength: rect.height,
        });
        collectNode(node.first, { ...rect, width: `(${rect.width}) * ${ratioVar}` }, widthFraction * node.ratio, heightFraction, leaves, dividers);
        collectNode(node.second, { ...rect, left: boundary, width: `(${rect.width}) * (1 - ${ratioVar})` }, widthFraction * (1 - node.ratio), heightFraction, leaves, dividers);
        return;
    }
    const boundary = `(${rect.top}) + (${rect.height}) * ${ratioVar}`;
    dividers.push({
        splitId: node.id,
        direction: "column",
        ratio: node.ratio,
        regionFraction: heightFraction,
        boundary,
        crossStart: rect.left,
        crossLength: rect.width,
    });
    collectNode(node.first, { ...rect, height: `(${rect.height}) * ${ratioVar}` }, widthFraction, heightFraction * node.ratio, leaves, dividers);
    collectNode(node.second, { ...rect, top: boundary, height: `(${rect.height}) * (1 - ${ratioVar})` }, widthFraction, heightFraction * (1 - node.ratio), leaves, dividers);
}
export function collectWorkbenchLayout(root) {
    const leaves = [];
    const dividers = [];
    collectNode(root, ROOT_RECT, 1, 1, leaves, dividers);
    return { leaves, dividers };
}
export function rectStyle(rect) {
    return {
        left: `calc(${rect.left})`,
        top: `calc(${rect.top})`,
        width: `calc(${rect.width})`,
        height: `calc(${rect.height})`,
    };
}
export function dividerStyle(divider) {
    if (divider.direction === "row") {
        return {
            left: `calc(${divider.boundary})`,
            top: `calc(${divider.crossStart})`,
            height: `calc(${divider.crossLength})`,
            width: "9px",
            transform: "translateX(-50%)",
        };
    }
    return {
        top: `calc(${divider.boundary})`,
        left: `calc(${divider.crossStart})`,
        width: `calc(${divider.crossLength})`,
        height: "9px",
        transform: "translateY(-50%)",
    };
}
//# sourceMappingURL=workbenchLayout.js.map