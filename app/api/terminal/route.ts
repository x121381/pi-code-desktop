import { NextResponse } from "next/server";
import { homedir } from "os";
import { existsSync } from "fs";
import { getAllowedFileRoots, isExistingFilePathAllowed } from "@/lib/file-access";
import { isApiRequestAllowed } from "@/lib/request-security";
import {
  createTerminalSession,
  killTerminalSession,
  TerminalUnavailableError,
} from "@/lib/terminal-registry";

export const dynamic = "force-dynamic";

// POST /api/terminal  body: { cwd?: string; cols?: number; rows?: number }
// Spawns an interactive PTY for the embedded terminal pane. Creating a shell
// is privileged: only allowed file roots may be used as the working directory
// and the request must carry the desktop/server auth token.
export async function POST(req: Request) {
  if (!isApiRequestAllowed(req)) {
    return NextResponse.json({ error: "Untrusted API request" }, { status: 403 });
  }
  try {
    const body = await req.json().catch(() => ({})) as { cwd?: string; cols?: number; rows?: number };
    const allowedRoots = await getAllowedFileRoots();
    let cwd = typeof body.cwd === "string" && body.cwd ? body.cwd : homedir();
    if (!existsSync(cwd) || !isExistingFilePathAllowed(cwd, allowedRoots)) {
      // Fall back to home rather than failing: the terminal is a general
      // surface and the server's home dir is always an allowed root.
      cwd = homedir();
    }

    const session = await createTerminalSession({
      cwd,
      cols: typeof body.cols === "number" ? body.cols : undefined,
      rows: typeof body.rows === "number" ? body.rows : undefined,
    });
    return NextResponse.json({ id: session.id, cwd: session.cwd, pid: session.pty.pid });
  } catch (error) {
    if (error instanceof TerminalUnavailableError) {
      return NextResponse.json(
        { error: "Terminal backend unavailable on this platform", detail: String(error.message) },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE /api/terminal?id=<id>
export async function DELETE(req: Request) {
  if (!isApiRequestAllowed(req)) {
    return NextResponse.json({ error: "Untrusted API request" }, { status: 403 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  return NextResponse.json({ success: killTerminalSession(id) });
}
