import { NextResponse } from "next/server";
import { parseJsonWithinLimit, RequestBodyTooLargeError } from "@/lib/bounded-form-data";
import { CloudChatError, connectFeishuAccount } from "@/lib/cloud-chat";
import { readCloudChatStatus, type FeishuMode, type FeishuReceiveIdType } from "@/lib/cloud-chat-store";
import { hasJsonContentType, isApiRequestAllowed } from "@/lib/request-security";

const MAX_FEISHU_LOGIN_REQUEST_BYTES = 8 * 1024;
const FEISHU_RECEIVE_ID_TYPES = new Set<FeishuReceiveIdType>([
  "open_id",
  "user_id",
  "union_id",
  "email",
  "chat_id",
]);

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
      { error: "Could not connect Feishu", code: error.code },
      { status: error.status },
    );
  }
  return NextResponse.json(
    { error: "Could not connect Feishu", code: "UPSTREAM_ERROR" },
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
    const parsedBody = await parseJsonWithinLimit(request, MAX_FEISHU_LOGIN_REQUEST_BYTES);
    if (!isRecord(parsedBody)) {
      return NextResponse.json(
        { error: "Request body must be valid JSON", code: "INVALID_JSON" },
        { status: 400 },
      );
    }
    const mode: FeishuMode = parsedBody.mode === "bot" ? "bot" : "webhook";
    const receiveIdType = typeof parsedBody.receiveIdType === "string"
      && FEISHU_RECEIVE_ID_TYPES.has(parsedBody.receiveIdType as FeishuReceiveIdType)
      ? parsedBody.receiveIdType as FeishuReceiveIdType
      : undefined;
    const linked = await connectFeishuAccount({
      mode,
      webhookUrl: optionalString(parsedBody.webhookUrl) || undefined,
      appId: optionalString(parsedBody.appId) || undefined,
      appSecret: optionalString(parsedBody.appSecret) || undefined,
      receiveId: optionalString(parsedBody.receiveId) || undefined,
      receiveIdType,
    });
    const status = await readCloudChatStatus();
    return NextResponse.json({ mode: linked.mode, status });
  } catch (error) {
    return errorResponse(error);
  }
}
