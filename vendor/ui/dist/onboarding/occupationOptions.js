import { Code2, ShieldCheck, PanelsTopLeft, PenTool, GraduationCap, Video, Store, Megaphone, BriefcaseBusiness, Rocket, Scale, Ellipsis, } from "lucide-react";
export const occupations = [
    "developer",
    "independent",
    "infrastructure",
    "product",
    "design",
    "student",
    "finance",
    "creator",
    "operations",
    "marketing",
    "legal",
    "other",
];
/** 步骤 2 模式选择用的图标：coding / office。 */
export const modeOptionIcons = {
    coding: Code2,
    office: PanelsTopLeft,
};
const occupationIcons = [
    Code2,
    Rocket,
    ShieldCheck,
    PanelsTopLeft,
    PenTool,
    GraduationCap,
    BriefcaseBusiness,
    Video,
    Store,
    Megaphone,
    Scale,
    Ellipsis,
];
export function getOccupationIcon(index) {
    return occupationIcons[index] ?? Ellipsis;
}
//# sourceMappingURL=occupationOptions.js.map