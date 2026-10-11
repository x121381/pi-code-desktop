/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  V4_WIRE_PROTOCOL_VERSION,
  conversationDeltaSchema,
  conversationRowSchema,
  conversationSnapshotSchema,
  topicWireFrameCandidateSchema,
} from "@zcode/shared/zcode-protocol-v4";
import { forgeMinimal, forgeValidated } from "./v4-forge";
import { Emitter } from "@zcode/rpc";

/**
 * Bridges ZCode's V4 conversation protocol onto the Pi backend:
 *  - subscribe → Pi session context becomes a schema-forged snapshot frame;
 *  - Pi SSE events stream in as row.appended / row.upserted / row.delta deltas;
 *  - sendText/stop commands map to Pi prompt/abort.
 *
 * Frames ride the same `onDynamicConversationFrame` wire-candidate channel the
 * real zcode-cli host uses, so the UI's decoder/store stay untouched.
 */

type WireCandidate = ReturnType<typeof topicWireFrameCandidateSchema.parse>;
type FrameEmitter = Emitter<WireCandidate>;

interface V4CommandEnvelope {
  commandId: string;
  clientId?: string;
  sessionId: string;
  type: string;
  payload?: { text?: string; [key: string]: unknown };
  [key: string]: unknown;
}

interface PiAgentMessage {
  role: string;
  content?: string | Array<{ type: string; text?: string; [key: string]: unknown }>;
  timestamp?: number;
  [key: string]: unknown;
}

interface PiSessionContext {
  context?: { messages?: PiAgentMessage[]; [key: string]: unknown };
  [key: string]: unknown;
}

export interface PiAgentServiceOptions {
  /** Working directory used when creating new sessions from the UI. */
  cwd: string;
}

function timestampOf(value: unknown): number {
  return typeof value === "number" ? value : Date.now();
}

/** Map Pi messages to V4 conversation rows (turnHeader + typed content rows). */
export function buildRowsFromPiMessages(messages: PiAgentMessage[]): unknown[] {
  const rows: unknown[] = [];
  let rowId = 1;
  for (const message of messages) {
    const turnId = `pi-turn-${rowId}`;
    const startedAt = timestampOf(message.timestamp);
    rows.push({
      kind: "turnHeader",
      rowId: rowId++,
      turnId,
      createdAt: startedAt,
      createdAtSeq: rowId,
      origin: "userInput",
      state: "completedSuccess",
      startedAt,
      endedAt: startedAt,
    });
    if (message.role === "user") {
      const text = typeof message.content === "string"
        ? message.content
        : (message.content ?? [])
            .filter((block) => block.type === "text")
            .map((block) => block.text ?? "")
            .join("\n");
      rows.push({
        kind: "userInput",
        rowId: rowId++,
        turnId,
        createdAt: startedAt,
        createdAtSeq: rowId,
        text,
        origin: "realUser",
      });
      continue;
    }
    if (message.role === "assistant" && Array.isArray(message.content)) {
      for (const block of message.content) {
        const createdAt = startedAt;
        const base = { rowId: rowId++, turnId, createdAt, createdAtSeq: rowId };
        if (block.type === "thinking" && block.text) {
          rows.push({ kind: "reasoning", ...base, text: block.text, state: "complete" });
        } else if (block.type === "text" && block.text) {
          rows.push({ kind: "assistantText", ...base, text: block.text, state: "complete" });
        } else if (block.type === "toolCall") {
          const forged = forgeMinimal(conversationRowSchema) as Record<string, unknown>;
          rows.push({
            ...forged,
            kind: "toolCall",
            ...base,
          });
        }
      }
    }
  }
  return rows;
}

function forgeSnapshot(sessionId: string, rows: unknown[]): Record<string, unknown> {
  const snapshot = forgeMinimal(
    conversationSnapshotSchema as unknown as Parameters<typeof forgeMinimal>[0],
    0,
  ) as Record<string, unknown>;
  snapshot.protocolVersion = 1;
  snapshot.sessionId = sessionId;
  snapshot.logEpoch = `pi-${Date.now()}`;
  snapshot.seq = rows.length;
  snapshot.revision = 1;
  snapshot.rows = {
    window: rows,
    totalCount: rows.length,
    firstRowId: rows.length > 0 ? 1 : null,
  };
  return snapshot;
}

function wireFrame(
  topic: string,
  subscriptionId: string,
  ordinal: number,
  frame: unknown,
): WireCandidate {
  return topicWireFrameCandidateSchema.parse({
    wireVersion: V4_WIRE_PROTOCOL_VERSION,
    kind: "complete",
    deliveryKind: "live",
    logicalFrameId: `pi-${ordinal}-${Math.random().toString(36).slice(2, 8)}`,
    logicalFrameOrdinal: ordinal,
    topic,
    subscriptionId,
    frame,
  });
}

export function createPiAgentService(options: PiAgentServiceOptions) {
  const frameEmitter = new Emitter<WireCandidate>();
  const subscriptions = new Map<
    string,
    { subscriptionId: string; source?: EventSource; seq: number; ordinal: number }
  >();
  const streamingRows = new Map<string, { rowId: number; text: string }>();

  const emitFrame = (
    topic: string,
    subscriptionId: string,
    sub: { seq: number; ordinal: number; source?: EventSource },
    payload: { kind: "snapshot" | "deltas"; snapshot?: unknown; deltas?: unknown[] },
  ) => {
    sub.ordinal += 1;
    const fromSeq = payload.kind === "snapshot" ? 0 : sub.seq;
    sub.seq = payload.kind === "deltas" ? sub.seq + (payload.deltas?.length ?? 0) : sub.seq;
    const frame = {
      topic,
      subscriptionId,
      fromSeq,
      toSeq: sub.seq,
      sentAt: Date.now(),
      payload,
    };
    const emitter = frameEmitter;
    if (!emitter) return;
    try {
      emitter.fire(wireFrame(topic, subscriptionId, sub.ordinal, frame));
    } catch {
      // frame validation failure must not kill the stream
    }
  };

  const wirePiEvent = (topic: string, sub: { seq: number; ordinal: number }, event: {
    type: string;
    message?: PiAgentMessage;
    toolCallId?: string;
    toolName?: string;
  }) => {
    const deltas: unknown[] = [];
    const base = { turnId: `pi-live-${event.toolCallId ?? "msg"}`, createdAt: Date.now() };
    if (event.type === "message_end" && event.message?.role === "assistant") {
      const text = Array.isArray(event.message.content)
        ? event.message.content.filter((b) => b.type === "text").map((b) => b.text ?? "").join("\n")
        : "";
      deltas.push({
        op: "row.appended",
        row: conversationRowSchema.parse({
          kind: "assistantText",
          rowId: sub.seq + deltas.length + 1,
          ...base,
          text,
          state: "complete",
        }),
      });
    } else if (event.type === "tool_execution_start") {
      const forged = forgeMinimal(conversationRowSchema) as Record<string, unknown>;
      deltas.push({
        op: "row.appended",
        row: conversationRowSchema.parse({
          ...forged,
          kind: "toolCall",
          rowId: sub.seq + deltas.length + 1,
          ...base,
        }),
      });
    } else if (event.type === "message_update") {
      // Streaming text: append to a virtual row (create on first delta).
      const key = topic;
      let stream = streamingRows.get(key);
      if (!stream) {
        stream = { rowId: sub.seq + 1, text: "" };
        streamingRows.set(key, stream);
        deltas.push({
          op: "row.appended",
          row: conversationRowSchema.parse({
            kind: "assistantText",
            rowId: stream.rowId,
            ...base,
            text: "",
            state: "streaming",
          }),
        });
      }
      const chunk = Array.isArray(event.message?.content)
        ? event.message.content.filter((b) => b.type === "text").map((b) => b.text ?? "").join("")
        : typeof event.message?.content === "string" ? event.message.content : "";
      if (chunk) {
        stream.text += chunk;
        deltas.push({ op: "row.delta", rowId: stream.rowId, path: ["text"], append: chunk });
      }
    }
    if (deltas.length > 0) {
      emitFrame(topic, (subscriptions.get(topic)?.subscriptionId ?? ""), sub as { seq: number; ordinal: number }, {
        kind: "deltas",
        deltas: deltas.map((delta) => conversationDeltaSchema.parse(delta)),
      });
    }
  };

  return {
    async helloConversationV4() {
      return {
        kind: "hello" as const,
        protocolVersion: V4_WIRE_PROTOCOL_VERSION,
        connectionId: `pi-${Math.random().toString(36).slice(2, 10)}`,
        clientMode: "desktop-continuous" as const,
        deliveryProfile: "continuous" as const,
        serverTime: Date.now(),
        capabilities: {
          nativeDialogs: true,
          localTerminal: true,
          binaryFrames: false,
          compression: "none" as const,
          independentPlanState: true,
        },
        auth: {},
      };
    },
    async initializeConversationV4() {
      return undefined;
    },
    onDynamicConversationFrame: frameEmitter.event,
    async subscribeConversationV4(params: { sessionId: string }) {
      const sessionId = params.sessionId;
      const topic = `conversation/${sessionId}`;
      const subscriptionId = `pi-sub-${Math.random().toString(36).slice(2, 10)}`;

      const res = await fetch(`/api/sessions/${encodeURIComponent(sessionId)}/context`);
      const context = res.ok ? ((await res.json()) as PiSessionContext) : {};
      const rows = buildRowsFromPiMessages(context.context?.messages ?? []);
      const sub = { subscriptionId, seq: rows.length, ordinal: 0 };
      subscriptions.set(topic, sub);

      emitFrame(topic, subscriptionId, sub, {
        kind: "snapshot",
        snapshot: forgeSnapshot(sessionId, rows),
      });

      const source = new EventSource(`/api/agent/${encodeURIComponent(sessionId)}/events`);
      source.onmessage = (e) => {
        try {
          wirePiEvent(topic, sub, JSON.parse(e.data));
        } catch {
          // ignore malformed events
        }
      };

      return {
        ack: { subscriptionId, mode: "snapshot" as const, logEpoch: `pi-${Date.now()}` },
      };
    },
    async unsubscribeConversationV4(params: { sessionId?: string; subscriptionId?: string }) {
      const topic = params.sessionId ? `conversation/${params.sessionId}` : undefined;
      const entry = topic ? subscriptions.get(topic) : undefined;
      if (entry) {
        entry.source?.close();
        subscriptions.delete(topic!);
      }
      return undefined;
    },
    async resyncConversationV4(params: { sessionId?: string; [key: string]: unknown }) {
      if (!params.sessionId) return undefined;
      const topic = `conversation/${params.sessionId}`;
      const sub = subscriptions.get(topic);
      if (sub) {
        emitFrame(topic, sub.subscriptionId, sub, { kind: "deltas", deltas: [] });
      }
      return undefined;
    },
    async sendConversationCommandV4(params: { envelope: V4CommandEnvelope }) {
      const envelope = params.envelope;
      const sessionId = envelope.sessionId;
      const commandId = envelope.commandId;
      if (envelope.type === "sendText") {
        await fetch(`/api/agent/${encodeURIComponent(sessionId)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "prompt", message: envelope.payload?.text ?? "" }),
        }).catch(() => {});
      } else if (envelope.type === "stop") {
        await fetch(`/api/agent/${encodeURIComponent(sessionId)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "abort" }),
        }).catch(() => {});
      }
      // Minimal accepted-ack; the UI's optimistic path only needs status + id.
      return {
        status: "accepted" as const,
        commandId,
        revisionAtDecision: 0,
      };
    },
    async queryConversationCommandsV4() {
      return { commands: [] };
    },
    async conversationRowsRangeV4() {
      return { rows: [], totalCount: 0, firstRowId: null };
    },
  };
}
