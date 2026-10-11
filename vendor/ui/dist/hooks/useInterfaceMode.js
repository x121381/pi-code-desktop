import { useZCodeStoreWithDefault } from "../store/StoreProvider.js";
export function useIsOfficeMode() {
    return useZCodeStoreWithDefault((state) => state.interfaceMode === "office", false);
}
//# sourceMappingURL=useInterfaceMode.js.map