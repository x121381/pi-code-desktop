import { NextResponse } from "next/server";
import { parseJsonWithinLimit, RequestBodyTooLargeError } from "@/lib/bounded-form-data";
import { hasJsonContentType, isApiRequestAllowed } from "@/lib/request-security";
import { shutdownAllRpcSessionsForMigration } from "@/lib/rpc-manager";
import {
  ensureSessionStorageRecovered,
  getSessionStorageState,
  migrateSessionStorage,
  SessionStorageError,
} from "@/lib/session-storage";

const MAX_SESSION_STORAGE_REQUEST_BYTES = 16 * 1024;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function GET(request: Request) {
  if (!isApiRequestAllowed(request)) {
    return NextResponse.json(
      { error: "Untrusted API request", code: "UNTRUSTED_REQUEST" },
      { status: 403 },
    );
  }

  try {
    await ensureSessionStorageRecovered();
    return NextResponse.json(getSessionStorageState());
  } catch (error) {
    if (error instanceof SessionStorageError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error), code: "STORAGE_READ_FAILED" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!isApiRequestAllowed(request)) {
    return NextResponse.json(
      { error: "Untrusted API request", code: "UNTRUSTED_REQUEST" },
      { status: 403 },
    );
  }
  if (!hasJsonContentType(request)) {
    return NextResponse.json(
      { error: "Content-Type must be application/json", code: "INVALID_CONTENT_TYPE" },
      { status: 415 },
    );
  }

  try {
    const parsedBody = await parseJsonWithinLimit(request, MAX_SESSION_STORAGE_REQUEST_BYTES);
    if (!isRecord(parsedBody)) {
      return NextResponse.json(
        { error: "Request body must be valid JSON", code: "INVALID_JSON" },
        { status: 400 },
      );
    }
    if (typeof parsedBody.targetRoot !== "string" || !parsedBody.targetRoot.trim()) {
      throw new SessionStorageError("targetRoot is required", "INVALID_TARGET");
    }

    const migration = await migrateSessionStorage(
      parsedBody.targetRoot,
      async () => { await shutdownAllRpcSessionsForMigration(); },
    );
    return NextResponse.json({ ok: true, storage: getSessionStorageState(), migration });
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json(
        { error: "Request body was too large", code: "REQUEST_TOO_LARGE" },
        { status: 413 },
      );
    }
    if (error instanceof SessionStorageError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error), code: "MIGRATION_FAILED" },
      { status: 500 },
    );
  }
}
