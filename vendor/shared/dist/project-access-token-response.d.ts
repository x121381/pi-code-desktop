import { z } from "zod";
/** BigModel/Z.AI 管理及 PAT 签发共用的成功 envelope 码；不放宽 Token 内容校验。 */
export declare const projectTokenSuccessCodeSchema: z.ZodUnion<readonly [z.ZodLiteral<200>, z.ZodLiteral<0>, z.ZodLiteral<"200">, z.ZodLiteral<"0">]>;
//# sourceMappingURL=project-access-token-response.d.ts.map