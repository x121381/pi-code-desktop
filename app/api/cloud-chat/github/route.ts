import { NextResponse } from "next/server";
import { parseJsonWithinLimit, RequestBodyTooLargeError } from "@/lib/bounded-form-data";
import { CloudChatError, pollGitHubDeviceLogin, startGitHubDeviceLogin } from "@/lib/cloud-chat";
import { readCloudChatStatus } from "@/lib/cloud-chat-store";
import { hasJsonContentType, isApiRequestAllowed } from "@/lib/request-security";

const MAX_GITHUB_LOGIN_REQUEST_BYTES = 4 * 1024;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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
      { error: "Could not connect GitHub", code: error.code },
      { status: error.status },
    );
  }
  return NextResponse.json(
    { error: "Could not connect GitHub", code: "UPSTREAM_ERROR" },
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

  try {
    const started = await startGitHubDeviceLogin();
    return NextResponse.json({
      loginId: started.loginId,
      userCode: started.userCode,
      verificationUri: started.verificationUri,
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
    const parsedBody = await parseJsonWithinLimit(request, MAX_GITHUB_LOGIN_REQUEST_BYTES);
    const loginId = isRecord(parsedBody) && typeof parsedBody.loginId === "string"
      ? parsedBody.loginId.trim()
      : "";
    if (!loginId) {
      return NextResponse.json(
        { error: "loginId is required", code: "INVALID_CREDENTIALS" },
        { status: 400 },
      );
    }
    const result = await pollGitHubDeviceLogin(loginId);
    if ("pending" in result) {
      return NextResponse.json({
        pending: true,
        ...(result.intervalSeconds ? { intervalSeconds: result.intervalSeconds } : {}),
      });
    }
    const status = await readCloudChatStatus();
    return NextResponse.json({ pending: false, login: result.login, status });
  } catch (error) {
    return errorResponse(error);
  }
}
