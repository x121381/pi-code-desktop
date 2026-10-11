interface SearchFields {
    title: string;
    hint: string;
    typeLabel: string;
    all: string;
}
export declare function buildSearchFields(title: string, hint: string, typeLabel: string): SearchFields;
export declare function normalizeSearchQuery(query: string): string[];
export declare function filterAndRankSearchItems<T extends {
    searchFields: SearchFields;
}>(items: T[], queryParts: string[]): T[];
export {};
//# sourceMappingURL=sidePaneTabSearch.d.ts.map