import { createHmac } from "node:crypto";
import { realpathSync } from "node:fs";
import { NextRequest, NextResponse } from "next/server";
import {
  parseJsonWithinLimit,
  RequestBodyTooLargeError,
} from "@/lib/bounded-form-data";
import { isDesktopApiRequestAllowed } from "@/lib/desktop-api-auth";
import { isCwdAllowed } from "@/lib/file-access";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 8 * 1024;
const AUTHORIZATION_TTL_SECONDS = 30;
const TERMINAL_AUTHORIZATION_TOKEN_ENV = "PI_TERMINAL_AUTHORIZATION_TOKEN";

export async function POST(request: NextRequest) {
  if (!isDesktopApiRequestAllowed(request)) {
    return NextResponse.json({ error: "Desktop authorization required" }, { status: 403 });
  }

  try {
    const body = await parseJsonWithinLimit(request, MAX_REQUEST_BYTES) as { cwd?: unknown } | null;
    if (typeof body?.cwd !== "string") {
      return NextResponse.json({ error: "cwd is required" }, { status: 400 });
    }

    const requestedCwd = body.cwd.trim();
    if (!requestedCwd || requestedCwd.includes("\0") || !await isCwdAllowed(requestedCwd)) {
      return NextResponse.json({ error: "Terminal working directory is not allowed" }, { status: 403 });
    }
    const cwd = realpathSync.native(requestedCwd);

    const secret = process.env[TERMINAL_AUTHORIZATION_TOKEN_ENV]?.trim();
    if (!secret || secret.length < 32) {
      return NextResponse.json({ error: "Terminal authorization is unavailable" }, { status: 503 });
    }

    const expiresAt = Math.floor(Date.now() / 1000) + AUTHORIZATION_TTL_SECONDS;
    const authorization = createHmac("sha256", secret)
      .update(`${cwd}\n${expiresAt}`, "utf8")
      .digest("hex");

    return NextResponse.json({ cwd, expiresAt, authorization });
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ error: "Request body is too large" }, { status: 413 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 },
    );
  }
}
