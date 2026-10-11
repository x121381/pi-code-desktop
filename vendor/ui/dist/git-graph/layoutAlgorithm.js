const MISSING_PARENT_ID = -1;
class LayoutBranch {
    colourIndex;
    lines = [];
    endRowIndex = 0;
    constructor(colourIndex) {
        this.colourIndex = colourIndex;
    }
    addLine(from, to, sourceHash, targetHash, lockedFirst) {
        this.lines.push({ from, to, laneIndex: this.colourIndex, sourceHash, targetHash, lockedFirst });
    }
}
export class LayoutVertex {
    id;
    hash;
    parents = [];
    nextParentIndex = 0;
    laneIndex = null;
    branch = null;
    nextLaneIndex = 0;
    connections = [];
    constructor(id, hash) {
        this.id = id;
        this.hash = hash;
    }
    addParent(vertex) {
        this.parents.push(vertex);
    }
    getNextParent() {
        return this.nextParentIndex < this.parents.length
            ? this.parents[this.nextParentIndex]
            : null;
    }
    registerParentProcessed() {
        this.nextParentIndex++;
    }
    isMerge() {
        return this.parents.length > 1;
    }
    isNotOnBranch() {
        return this.branch === null || this.laneIndex === null;
    }
    addToBranch(branch, laneIndex) {
        if (this.branch === null) {
            this.branch = branch;
            this.laneIndex = laneIndex;
        }
    }
    getBranch() {
        return this.branch;
    }
    getLaneIndex() {
        return this.laneIndex ?? 0;
    }
    getPoint() {
        return { laneIndex: this.getLaneIndex(), rowIndex: this.id };
    }
    getNextPoint() {
        return { laneIndex: this.nextLaneIndex, rowIndex: this.id };
    }
    getPointConnectingTo(target, branch) {
        const connectionIndex = this.connections.findIndex((connection) => connection?.target === target && connection.branch === branch);
        return connectionIndex >= 0
            ? { laneIndex: connectionIndex, rowIndex: this.id }
            : null;
    }
    reservePoint(laneIndex, target, branch) {
        if (laneIndex === this.nextLaneIndex) {
            this.connections[laneIndex] = { target, branch };
            this.nextLaneIndex = laneIndex + 1;
        }
    }
    getWidthLaneIndex() {
        return this.nextLaneIndex;
    }
}
function createVertices(commits) {
    const missingParent = new LayoutVertex(MISSING_PARENT_ID, "__zcode_missing_parent__");
    const vertices = commits.map((commit, index) => new LayoutVertex(index, commit.hash));
    const vertexByHash = new Map(vertices.map((vertex) => [vertex.hash, vertex]));
    for (const [index, commit] of commits.entries()) {
        const vertex = vertices[index];
        for (const parentHash of commit.parents) {
            const parent = vertexByHash.get(parentHash) ?? missingParent;
            vertex.addParent(parent);
        }
    }
    return { missingParent, vertices, vertexByHash };
}
function getAvailableColour(startAt, availableColours) {
    const reusableColour = availableColours.findIndex((endAt) => startAt > endAt);
    if (reusableColour >= 0)
        return reusableColour;
    availableColours.push(0);
    return availableColours.length - 1;
}
function determineMergePath(startAt, vertices, vertex, parentVertex) {
    const parentBranch = parentVertex.getBranch();
    let lastPoint = vertex.getPoint();
    let foundConnectionToParent = false;
    for (let rowIndex = startAt + 1; rowIndex < vertices.length; rowIndex++) {
        const currentVertex = vertices[rowIndex];
        const existingPoint = currentVertex.getPointConnectingTo(parentVertex, parentBranch);
        const currentPoint = existingPoint ?? currentVertex.getNextPoint();
        foundConnectionToParent = existingPoint !== null;
        parentBranch.addLine(lastPoint, currentPoint, vertex.hash, parentVertex.hash, !foundConnectionToParent && currentVertex !== parentVertex
            ? lastPoint.laneIndex < currentPoint.laneIndex
            : true);
        currentVertex.reservePoint(currentPoint.laneIndex, parentVertex, parentBranch);
        lastPoint = currentPoint;
        if (foundConnectionToParent) {
            vertex.registerParentProcessed();
            break;
        }
    }
}
function determineNormalPath(params) {
    const { startAt, vertices, branches, availableColours, missingParent } = params;
    let rowIndex = startAt;
    let vertex = vertices[rowIndex];
    let parentVertex = vertex.getNextParent();
    let lastPoint = vertex.isNotOnBranch() ? vertex.getNextPoint() : vertex.getPoint();
    const branch = new LayoutBranch(getAvailableColour(startAt, availableColours));
    vertex.addToBranch(branch, lastPoint.laneIndex);
    vertex.reservePoint(lastPoint.laneIndex, vertex, branch);
    for (rowIndex = startAt + 1; rowIndex < vertices.length; rowIndex++) {
        if (parentVertex === null || parentVertex === missingParent)
            break;
        const currentVertex = vertices[rowIndex];
        const currentPoint = parentVertex === currentVertex && !parentVertex.isNotOnBranch()
            ? currentVertex.getPoint()
            : currentVertex.getNextPoint();
        branch.addLine(lastPoint, currentPoint, vertex.hash, parentVertex.hash, lastPoint.laneIndex < currentPoint.laneIndex);
        currentVertex.reservePoint(currentPoint.laneIndex, parentVertex, branch);
        lastPoint = currentPoint;
        if (parentVertex === currentVertex) {
            vertex.registerParentProcessed();
            const parentWasAlreadyOnBranch = !parentVertex.isNotOnBranch();
            parentVertex.addToBranch(branch, currentPoint.laneIndex);
            vertex = parentVertex;
            parentVertex = vertex.getNextParent();
            if (parentVertex === missingParent) {
                // 分页窗口外的 parent 没有可见节点，不能继续把线画到窗口底部。
                vertex.registerParentProcessed();
                break;
            }
            if (parentVertex === null || parentWasAlreadyOnBranch)
                break;
        }
    }
    branch.endRowIndex = rowIndex;
    branches.push(branch);
    availableColours[branch.colourIndex] = rowIndex;
}
function determinePath(params) {
    const vertex = params.vertices[params.startAt];
    const parentVertex = vertex.getNextParent();
    if (parentVertex === params.missingParent) {
        vertex.registerParentProcessed();
        return;
    }
    if (parentVertex !== null &&
        vertex.isMerge() &&
        !vertex.isNotOnBranch() &&
        !parentVertex.isNotOnBranch()) {
        determineMergePath(params.startAt, params.vertices, vertex, parentVertex);
        return;
    }
    determineNormalPath(params);
}
export function createGitGraphLayoutModel(commits) {
    const { missingParent, vertices, vertexByHash } = createVertices(commits);
    const branches = [];
    const availableColours = [];
    let index = 0;
    while (index < vertices.length) {
        const vertex = vertices[index];
        if (vertex.getNextParent() !== null || vertex.isNotOnBranch()) {
            determinePath({ startAt: index, vertices, branches, availableColours, missingParent });
        }
        else {
            index++;
        }
    }
    return {
        vertices,
        vertexByHash,
        branchLines: branches.flatMap((branch) => branch.lines),
    };
}
//# sourceMappingURL=layoutAlgorithm.js.map