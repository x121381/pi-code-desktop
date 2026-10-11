export interface GroupMemberPage {
    items?: Array<{
        member_id?: string;
        name?: string;
    }>;
    has_more?: boolean;
    page_token?: string;
}
export declare function createGroupMemberDirectory(now?: () => number): (key: string, readPage: (cursor?: string) => Promise<GroupMemberPage>) => Promise<Record<string, string>>;
//# sourceMappingURL=groupMemberDirectory.d.ts.map