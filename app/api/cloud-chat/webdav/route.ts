import { NextResponse } from "next/server";
import { parseJsonWithinLimit, RequestBodyTooLargeError } from "@/lib/bounded-form-data";
import {
  CloudChatError,
  connectWebDavAccount,
  pollWebDavAccountLogin,
  startWebDavAccountLogin,
} from "@/lib/cloud-chat";
import { readCloudChatStatus } from "@/lib/cloud-chat-store";
import { hasJsonContentType, isApiRequestAllowed } from "@/lib/request-security";

const MAX_WEBDAV_LOGIN_REQUEST_BYTES = 8 * 1024;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function errorResponse(error: unknown): NextResponse {
  if (error instanceof RequestBodyTooLargeError) {
    return NextResponse.json(
      { error: "Request body was too large", code: "REQUEST_TOO_LARGE" },
      { status: 413 },
    );
  }
  if (error instanceof CloudChatError) {
    return NextResponse.json(
      { error: "Could not connect cloud drive", code: error.code },
      { status: error.status },
    );
  }
  return NextResponse.json(
    { error: "Could not connect cloud drive", code: "UPSTREAM_ERROR" },
    { status: 500 },
  );
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
    const parsedBody = await parseJsonWithinLimit(request, MAX_WEBDAV_LOGIN_REQUEST_BYTES);
    const url = isRecord(parsedBody) ? optionalString(parsedBody.url) : "";
    if (!url) {
      return NextResponse.json(
        { error: "url is required", code: "INVALID_CREDENTIALS" },
        { status: 400 },
      );
    }
    const started = await startWebDavAccountLogin(url);
    return NextResponse.json({
      loginId: started.loginId,
      loginUrl: started.loginUrl,
      expiresInSeconds: started.expiresInSeconds,
      intervalSeconds: started.intervalSeconds,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request) {
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
    const parsedBody = await parseJsonWithinLimit(request, MAX_WEBDAV_LOGIN_REQUEST_BYTES);
    if (!isRecord(parsedBody)) {
      return NextResponse.json(
        { error: "Request body must be valid JSON", code: "INVALID_JSON" },
        { status: 400 },
      );
    }
    const loginId = optionalString(parsedBody.loginId);
    if (loginId) {
      const result = await pollWebDavAccountLogin(loginId);
      if ("pending" in result) {
        return NextResponse.json({
          pending: true,
          ...(result.intervalSeconds ? { intervalSeconds: result.intervalSeconds } : {}),
        });
      }
      const status = await readCloudChatStatus();
      return NextResponse.json({ pending: false, username: result.username, status });
    }
    const url = optionalString(parsedBody.url);
    const username = optionalString(parsedBody.username);
    const password = optionalString(parsedBody.password);
    if (!url || !username || !password) {
      return NextResponse.json(
        { error: "url, username, and password are required", code: "MISSING_CREDENTIALS" },
        { status: 400 },
      );
    }
    const linked = await connectWebDavAccount({ url, username, password });
    const status = await readCloudChatStatus();
    return NextResponse.json({ pending: false, username: linked.username, status });
  } catch (error) {
    return errorResponse(error);
  }
}
