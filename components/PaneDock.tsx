"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { hitTestDockSlot, type DockPane, type DockSlot } from "@/lib/workspace-layout";

export { hitTestDockSlot };

export type PaneDragState = {
  pane: DockPane;
  x: number;
  y: number;
} | null;

export function PaneDockHandle({
  pane,
  label,
  disabled,
  onDragChange,
  onDrop,
}: {
  pane: DockPane;
  label: string;
  disabled?: boolean;
  onDragChange: (state: PaneDragState) => void;
  onDrop: (pane: DockPane, x: number, y: number) => void;
}) {
  const draggingRef = useRef(false);

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    if (disabled || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    onDragChange({ pane, x: event.clientX, y: event.clientY });
  }, [disabled, onDragChange, pane]);

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current) return;
    onDragChange({ pane, x: event.clientX, y: event.clientY });
  }, [onDragChange, pane]);

  const endDrag = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onDrop(pane, event.clientX, event.clientY);
    onDragChange(null);
  }, [onDragChange, onDrop, pane]);

  return (
    <button
      type="button"
      className="pane-dock-handle"
      data-pane={pane}
      aria-label={label}
      title={label}
      disabled={disabled}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor" aria-hidden="true">
        <circle cx="3" cy="3" r="1.1" />
        <circle cx="7" cy="3" r="1.1" />
        <circle cx="3" cy="7" r="1.1" />
        <circle cx="7" cy="7" r="1.1" />
        <circle cx="3" cy="11" r="1.1" />
        <circle cx="7" cy="11" r="1.1" />
      </svg>
      <span>{label}</span>
    </button>
  );
}

export function DockDropOverlay({
  drag,
  labels,
  workspaceRef,
}: {
  drag: PaneDragState;
  labels: Record<DockSlot, string>;
  workspaceRef: RefObject<HTMLElement | null>;
}) {
  const [slot, setSlot] = useState<DockSlot | null>(null);

  useEffect(() => {
    if (!drag) {
      setSlot(null);
      return;
    }
    const bounds = workspaceRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setSlot(hitTestDockSlot(drag.x, drag.y, bounds));
  }, [drag, workspaceRef]);

  if (!drag) return null;

  return (
    <div className="dock-drop-overlay" aria-hidden="true">
      {(["left", "center", "right", "bottom"] as const).map((item) => (
        <div
          key={item}
          className={`dock-drop-zone dock-drop-zone-${item}${slot === item ? " is-active" : ""}`}
        >
          {labels[item]}
        </div>
      ))}
    </div>
  );
}

export function DockSlotFrame({
  slot,
  children,
  className,
}: {
  slot: DockSlot;
  children: ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return (
    <div className={`dock-slot dock-slot-${slot}${className ? ` ${className}` : ""}`} data-dock-slot={slot}>
      {children}
    </div>
  );
}
