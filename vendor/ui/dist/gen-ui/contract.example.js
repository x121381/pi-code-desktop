import { collectGenUiSourcePaths, matchesGenUiSourcePath } from "../gen-ui/contract.js";
export const sourceFileExample = matchesGenUiSourcePath("/work/demo.html", collectGenUiSourcePaths('::visualize{"path":"/work/demo.html"}'));
export const example = {
    workspacePath: "/work",
    sessionId: "session",
    path: "/work/demo.html",
    instanceKey: "row:offset",
};
//# sourceMappingURL=contract.example.js.map