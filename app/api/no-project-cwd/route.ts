import { NextResponse } from "next/server";
import { mkdirSync } from "fs";
import { join } from "path";
import { getAgentDir } from "@earendil-works/pi-coding-agent";
import { allowFileRoot } from "@/lib/file-access";

export const dynamic = "force-dynamic";

// GET /api/no-project-cwd
// Resolves (creating if needed) the stable working directory used for chat
// sessions started without picking a project — see ProjectPicker's "Continue
// without a project" entry. Idempotent: always returns the same path, inside
// the agent dir this app already owns, so it needs no separate trust prompt.
export async function GET() {
  try {
    const dir = join(getAgentDir(), "workspace");
    mkdirSync(dir, { recursive: true });
    allowFileRoot(dir);
    return NextResponse.json({ cwd: dir });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
