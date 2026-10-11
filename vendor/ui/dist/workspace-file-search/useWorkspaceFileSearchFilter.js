import { useEffect, useRef, useState } from "react";
import { createWorkerWorkspaceFileSearchFilterBackend, } from "./workspaceFileSearchFilterBackend.js";
/**
 * 工作区文件搜索过滤的共享入口：候选打分在 Web Worker 执行（降级为主线程同步），
 * 返回映射回的 entry 列表。@ 文件候选与文件树搜索共用同一语义。
 *
 * 时序契约：
 * - entries 变化（索引重建）先清空 items 再异步过滤，旧结果不会泄漏到新索引；
 * - query 变化触发的过期结果由 backend 的 seq 机制丢弃（resolve null）；
 * - 主线程不做全量 Map/候选构建（曾在 37 万 entries 下实测 ~630ms 同步阻塞，
 *   已全部移入 worker），组件卸载 dispose worker。
 */
export function useWorkspaceFileSearchFilterEntries(packed, query, options, rootPath) {
    const backendRef = useRef(null);
    if (backendRef.current === null) {
        backendRef.current = createWorkerWorkspaceFileSearchFilterBackend();
    }
    const [items, setItems] = useState([]);
    const [filtering, setFiltering] = useState(false);
    useEffect(() => {
        const backend = backendRef.current;
        if (!backend) {
            return;
        }
        // 索引重建：清空旧结果（新索引的过滤尚未发生），再推送全量候选（packed 直透）。
        setItems([]);
        backend.setPacked(packed, rootPath);
    }, [backendRef, packed, rootPath]);
    useEffect(() => {
        const backend = backendRef.current;
        if (!backend) {
            return;
        }
        let cancelled = false;
        setFiltering(true);
        void backend.filter(query, options).then((result) => {
            if (cancelled) {
                return;
            }
            setFiltering(false);
            if (result === null) {
                // 过期结果（索引重建或更新的 filter 之后），保持当前 items 不动。
                return;
            }
            setItems(result);
        });
        return () => {
            cancelled = true;
        };
        // entries 必须在依赖里：索引重建（setEntries）后要重新发起过滤，否则结果
        // 停留在旧索引的空列表（曾在删除 entryMap 时误删此触发链）。
        // options 每次渲染都是新对象字面量；按字段展开为依赖避免每帧重过滤。
    }, [backendRef, options.limit, options.requireQuery, packed, query, rootPath]);
    useEffect(() => {
        return () => {
            backendRef.current?.dispose();
            backendRef.current = null;
        };
    }, [backendRef]);
    return { items, filtering };
}
//# sourceMappingURL=useWorkspaceFileSearchFilter.js.map