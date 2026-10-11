import { ProjectAccessTokenClient, type ApiClient } from "@zcode/shared";
import type { ICredentialService } from "#src/credential/credential.js";
/** 本地与旧远程附加入口复用同一 HTTP/ID 存储约束，每个鉴权 owner 只持有一个实例。 */
export declare function createAccountProjectTokenClient(apiClient: ApiClient, credentialService: Pick<ICredentialService, "load" | "save" | "delete">): ProjectAccessTokenClient;
//# sourceMappingURL=accountProjectTokenClient.d.ts.map