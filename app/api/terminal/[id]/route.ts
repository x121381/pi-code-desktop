import { NextResponse } from "next/server";
import { isApiRequestAllowed } from "@/lib/request-security";
import {
  getTerminalSession,
  resizeTerminal,
  writeTerminalInput,
  type TerminalEvent,
} from "@/lib/terminal-registry";

export const dynamic = "force-dynamic";

// GET /api/terminal/[id] — SSE stream of pty output (data/exit events).
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isApiRequestAllowed(req)) {
    return NextResponse.json({ error: "Untrusted API request" }, { status: 403 });
  }
  const { id } = await params;
  const session = getTerminalSession(id);
  if (!session) return NextResponse.json({ error: "session not found" }, { status: 404 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      let closed = false;
      const send = (event: TerminalEvent) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
          if (event.type === "exit") {
            closed = true;
            controller.close();
          }
        } catch {
          closed = true;
        }
      };

      session.listeners.add(send);
      req.signal.addEventListener("abort", () => {
        session.listeners.delete(send);
        if (!closed) {
          closed = true;
          try { controller.close(); } catch { /* already closed */ }
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

// POST /api/terminal/[id]  body: { input?: string; resize?: { cols: number; rows: number } }
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isApiRequestAllowed(req)) {
    return NextResponse.json({ error: "Untrusted API request" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({})) as {
    input?: string;
    resize?: { cols?: number; rows?: number };
  };
  if (typeof body.input === "string" && body.input) {
    if (!writeTerminalInput(id, body.input)) {
      return NextResponse.json({ error: "session not found or exited" }, { status: 404 });
    }
  }
  if (body.resize && typeof body.resize.cols === "number" && typeof body.resize.rows === "number") {
    resizeTerminal(id, body.resize.cols, body.resize.rows);
  }
  return NextResponse.json({ success: true });
}
