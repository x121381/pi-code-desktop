import { createGitGraphLayoutModel, } from "../git-graph/layoutAlgorithm.js";
const DEFAULT_ROW_HEIGHT = 42;
const DEFAULT_LANE_GAP = 18;
const DEFAULT_LANE_PADDING = 16;
const DEFAULT_TOP_PADDING = 20;
const DEFAULT_BOTTOM_PADDING = 18;
function buildEdgePath({ fromX, fromY, toX, toY, lockedFirst, }) {
    if (fromX === toX) {
        return `M ${fromX} ${fromY} L ${toX} ${toY}`;
    }
    const curveOffset = Math.max(14, Math.abs(toY - fromY) * 0.38);
    if (lockedFirst === false) {
        return [
            `M ${fromX} ${fromY}`,
            `C ${fromX} ${toY - curveOffset}, ${toX} ${toY - curveOffset}, ${toX} ${toY}`,
        ].join(" ");
    }
    return [
        `M ${fromX} ${fromY}`,
        `C ${fromX} ${fromY + curveOffset}, ${toX} ${fromY + curveOffset}, ${toX} ${toY}`,
    ].join(" ");
}
function pointToPixels(point, options) {
    return {
        x: options.lanePadding + point.laneIndex * options.laneGap,
        y: options.topPadding + point.rowIndex * options.rowHeight,
    };
}
function createGraphPath(line, lineIndex, pixelOptions) {
    const from = pointToPixels(line.from, pixelOptions);
    const to = pointToPixels(line.to, pixelOptions);
    return {
        id: `${line.sourceHash}:${line.targetHash}:${line.from.rowIndex}:${line.to.rowIndex}:${lineIndex}:path`,
        laneIndex: line.laneIndex,
        path: buildEdgePath({
            fromX: from.x,
            fromY: from.y,
            toX: to.x,
            toY: to.y,
            lockedFirst: line.lockedFirst,
        }),
        relatedHashes: line.sourceHash === line.targetHash
            ? [line.sourceHash]
            : [line.sourceHash, line.targetHash],
    };
}
function createLaneSegment(line, lineIndex, pixelOptions) {
    const from = pointToPixels(line.from, pixelOptions);
    const to = pointToPixels(line.to, pixelOptions);
    return {
        id: `${line.sourceHash}:${line.targetHash}:${line.from.rowIndex}:${line.to.rowIndex}:${lineIndex}:segment`,
        hash: line.targetHash,
        laneIndex: line.to.laneIndex,
        path: buildEdgePath({
            fromX: from.x,
            fromY: from.y,
            toX: to.x,
            toY: to.y,
            lockedFirst: line.lockedFirst,
        }),
    };
}
function createEdges(params) {
    const { commits, rows, vertexByHash, rowByHash, pixelOptions } = params;
    return commits.flatMap((commit, rowIndex) => {
        const fromVertex = vertexByHash.get(commit.hash);
        return commit.parents.map((parentHash, parentIndex) => {
            const parentVertex = vertexByHash.get(parentHash) ?? null;
            const fromLaneIndex = fromVertex.getLaneIndex();
            const toLaneIndex = parentVertex
                ? parentVertex.getLaneIndex()
                : fromLaneIndex + parentIndex;
            const fromRow = rows[rowIndex];
            const toRow = rowByHash.get(parentHash);
            const fromX = pixelOptions.lanePadding + fromLaneIndex * pixelOptions.laneGap;
            const toX = pixelOptions.lanePadding + toLaneIndex * pixelOptions.laneGap;
            return {
                id: `${commit.hash}:${parentHash}:${parentIndex}`,
                fromHash: commit.hash,
                toHash: parentHash,
                fromLaneIndex,
                toLaneIndex,
                path: buildEdgePath({
                    fromX,
                    fromY: fromRow.y,
                    toX,
                    toY: toRow?.y ?? fromRow.y,
                    lockedFirst: fromLaneIndex < toLaneIndex,
                }),
                truncated: !toRow,
            };
        });
    });
}
export function layoutGitGraph(commits, options = {}) {
    const rowHeight = options.rowHeight ?? DEFAULT_ROW_HEIGHT;
    const laneGap = options.laneGap ?? DEFAULT_LANE_GAP;
    const lanePadding = options.lanePadding ?? DEFAULT_LANE_PADDING;
    const topPadding = options.topPadding ?? DEFAULT_TOP_PADDING;
    const bottomPadding = options.bottomPadding ?? DEFAULT_BOTTOM_PADDING;
    const { vertices, vertexByHash, branchLines } = createGitGraphLayoutModel(commits);
    const rows = vertices.map((vertex, rowIndex) => {
        const laneIndex = vertex.getLaneIndex();
        return {
            commit: commits[rowIndex],
            rowIndex,
            laneIndex,
            x: lanePadding + laneIndex * laneGap,
            y: topPadding + rowIndex * rowHeight,
        };
    });
    const rowByHash = new Map(rows.map((row) => [row.commit.hash, row]));
    const maxRowLaneIndex = rows.reduce((max, row) => Math.max(max, row.laneIndex), 0);
    const maxWidthLaneIndex = vertices.reduce((max, vertex) => Math.max(max, vertex.getWidthLaneIndex() - 1), 0);
    const maxLineLaneIndex = branchLines.reduce((max, line) => Math.max(max, line.from.laneIndex, line.to.laneIndex), 0);
    const laneCount = Math.max(1, maxRowLaneIndex + 1, maxWidthLaneIndex + 1, maxLineLaneIndex + 1);
    const height = topPadding + Math.max(0, commits.length - 1) * rowHeight + bottomPadding;
    const width = lanePadding * 2 + (laneCount - 1) * laneGap;
    const pixelOptions = { lanePadding, laneGap, topPadding, rowHeight };
    const verticalLines = branchLines.filter((line) => line.from.laneIndex === line.to.laneIndex);
    return {
        rows,
        edges: createEdges({ commits, rows, vertexByHash, rowByHash, pixelOptions }),
        laneSegments: verticalLines.map((line, index) => createLaneSegment(line, index, pixelOptions)),
        paths: branchLines.map((line, index) => createGraphPath(line, index, pixelOptions)),
        laneCount,
        width,
        height,
        rowHeight,
        laneGap,
    };
}
//# sourceMappingURL=layout.js.map