import { resolveBigModelApiOrigin, resolveZaiBusinessBaseUrl, } from "@zcode/shared";
/** 仅供旧连接导入：只读 OAuth 用户信息，不依赖当前 Provider，也不申请团队 Key。退役旧版后删除。 */
export function createLegacyTeamOrganizationResolver(dependencies) {
    return async ({ family, projectId }) => {
        const tokens = await dependencies.loadOAuthTokenSet(family);
        const token = tokens?.accessToken.trim();
        if (!token || (family === "bigmodel" && token === tokens?.zcodeJwtToken))
            return null;
        const origin = family === "zai"
            ? resolveZaiBusinessBaseUrl(process.env)
            : resolveBigModelApiOrigin(process.env);
        const response = await dependencies.apiClient.request(`${origin}/api/biz/customer/getCustomerInfo`, {
            method: "GET",
            timeoutMs: 15_000,
            // 两个业务域都使用原始 OAuth token；不能添加 Bearer 或使用模型 API Key。
            headers: { Authorization: token, "Content-Type": "application/json" },
        });
        if (!response.ok)
            return null;
        const payload = (await response.json());
        if (payload.code !== undefined && payload.code !== 0 && payload.code !== 200)
            return null;
        // 账号切换使旧查询失去权威，即使项目 ID 碰巧相同也不能把组织写给新账号。
        if ((await dependencies.loadOAuthTokenSet(family))?.accessToken.trim() !== token)
            return null;
        const organizations = new Set((payload.data?.organizations ?? [])
            .filter((org) => org.projects?.some((project) => project.projectId?.trim() === projectId))
            .map((org) => org.organizationId?.trim())
            .filter((id) => Boolean(id)));
        return organizations.size === 1 ? [...organizations][0] : null;
    };
}
//# sourceMappingURL=legacyTeamOrganizationResolver.js.map