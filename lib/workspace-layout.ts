export const DOCK_SLOTS = ["left", "center", "right", "bottom"] as const;
export const DOCK_PANES = ["chat", "preview", "files"] as const;

export type DockSlot = (typeof DOCK_SLOTS)[number];
export type DockPane = (typeof DOCK_PANES)[number];

export type WorkspaceLayout = Record<DockPane, DockSlot>;

export const DEFAULT_WORKSPACE_LAYOUT: WorkspaceLayout = {
  chat: "center",
  preview: "right",
  files: "right",
};

function isDockSlot(value: unknown): value is DockSlot {
  return typeof value === "string" && (DOCK_SLOTS as readonly string[]).includes(value);
}

export function parseWorkspaceLayout(value: unknown): WorkspaceLayout {
  if (typeof value !== "object" || value === null) return { ...DEFAULT_WORKSPACE_LAYOUT };
  const record = value as Record<string, unknown>;
  return {
    chat: isDockSlot(record.chat) ? record.chat : DEFAULT_WORKSPACE_LAYOUT.chat,
    preview: isDockSlot(record.preview) ? record.preview : DEFAULT_WORKSPACE_LAYOUT.preview,
    files: isDockSlot(record.files) ? record.files : DEFAULT_WORKSPACE_LAYOUT.files,
  };
}

export function movePaneToSlot(
  layout: WorkspaceLayout,
  pane: DockPane,
  slot: DockSlot,
): WorkspaceLayout {
  if (layout[pane] === slot) return layout;
  const next: WorkspaceLayout = { ...layout, [pane]: slot };
  const occupied = DOCK_PANES.some((item) => next[item] === "center");
  if (!occupied && pane !== "chat") next.chat = "center";
  return next;
}

export function panesInSlot(layout: WorkspaceLayout, slot: DockSlot): DockPane[] {
  return DOCK_PANES.filter((pane) => layout[pane] === slot);
}

export function filesShareSlot(layout: WorkspaceLayout): boolean {
  return layout.preview === layout.files;
}

export function hitTestDockSlot(
  x: number,
  y: number,
  bounds: { left: number; right: number; top: number; bottom: number; width: number; height: number },
): DockSlot {
  const edge = Math.max(72, Math.min(160, bounds.width * 0.18));
  const bottom = Math.max(72, Math.min(140, bounds.height * 0.22));
  if (y > bounds.bottom - bottom) return "bottom";
  if (x < bounds.left + edge) return "left";
  if (x > bounds.right - edge) return "right";
  return "center";
}
