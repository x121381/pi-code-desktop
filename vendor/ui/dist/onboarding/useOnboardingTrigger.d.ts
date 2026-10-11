import type { AppSettings } from "@zcode/shared";
import type { useOnboardingRecordService } from "@/hooks/useOnboardingRecordService.js";
/**
 * 引导触发判定：当前用户在本地记录里没有条目时
 * needsOnboarding=true。settings 回填（换号恢复偏好）只在 userId 运行时变化后发生；
 * 手动修改由各入口回写 record（updateRecordPreferences），record 始终等于该用户最新偏好。
 *
 * 返回 [needsOnboarding, markOnboarded]：null 表示异步判定中；markOnboarded 在引导
 * 保存成功后把判定置 false（记录已落盘，本次会话不再触发）。
 */
export declare function useOnboardingTrigger(options: {
    onboardingRecord: ReturnType<typeof useOnboardingRecordService>;
    userId: string | null;
    hasStoredOccupation: boolean;
    loadDeviceMid: () => string;
    update: (patch: Partial<AppSettings>) => Promise<void>;
}): [boolean | null, () => void];
//# sourceMappingURL=useOnboardingTrigger.d.ts.map