import { NextResponse } from "next/server";
import { parseJsonWithinLimit, RequestBodyTooLargeError } from "@/lib/bounded-form-data";
import { hasJsonContentType, isApiRequestAllowed } from "@/lib/request-security";
import {
  clearCloudChatDestination,
  isCloudDestination,
  readCloudChatStatus,
  updateCloudChatStore,
  type CloudChatStore,
  type FeishuMode,
  type FeishuReceiveIdType,
} from "@/lib/cloud-chat-store";

const MAX_CLOUD_CHAT_REQUEST_BYTES = 16 * 1024;
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

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value.trim() : undefined;
}

function optionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function parsePatch(body: Record<string, unknown>): Partial<CloudChatStore> {
  const patch: Partial<CloudChatStore> = {};
  if (isRecord(body.github)) {
    patch.github = {
      token: optionalString(body.github.token),
      public: optionalBoolean(body.github.public),
      ...(body.github.token ? { login: "", authMode: "token" as const } : {}),
    };
  }
  if (isRecord(body.webdav)) {
    patch.webdav = {
      url: optionalString(body.webdav.url),
      username: optionalString(body.webdav.username),
      password: optionalString(body.webdav.password),
    };
  }
  if (isRecord(body.feishu)) {
    const mode = body.feishu.mode === "bot" || body.feishu.mode === "webhook"
      ? body.feishu.mode as FeishuMode
      : undefined;
    const receiveIdType = typeof body.feishu.receiveIdType === "string"
      && FEISHU_RECEIVE_ID_TYPES.has(body.feishu.receiveIdType as FeishuReceiveIdType)
      ? body.feishu.receiveIdType as FeishuReceiveIdType
      : undefined;
    patch.feishu = {
      mode,
      webhookUrl: optionalString(body.feishu.webhookUrl),
      appId: optionalString(body.feishu.appId),
      appSecret: optionalString(body.feishu.appSecret),
      receiveId: optionalString(body.feishu.receiveId),
      receiveIdType,
    };
  }
  return patch;
}

export async function GET(request: Request) {
  if (!isApiRequestAllowed(request)) {
    return NextResponse.json(
      { error: "Untrusted API request", code: "UNTRUSTED_REQUEST" },
      { status: 403 },
    );
  }
  return NextResponse.json(await readCloudChatStatus());
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
    const parsedBody = await parseJsonWithinLimit(request, MAX_CLOUD_CHAT_REQUEST_BYTES);
    if (!isRecord(parsedBody)) {
      return NextResponse.json(
        { error: "Request body must be valid JSON", code: "INVALID_JSON" },
        { status: 400 },
      );
    }
    const status = await updateCloudChatStore(parsePatch(parsedBody));
    return NextResponse.json(status);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json(
        { error: "Request body was too large", code: "REQUEST_TOO_LARGE" },
        { status: 413 },
      );
    }
    return NextResponse.json(
      { error: "Could not save cloud chat credentials", code: "CLOUD_SAVE_FAILED" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!isApiRequestAllowed(request)) {
    return NextResponse.json(
      { error: "Untrusted API request", code: "UNTRUSTED_REQUEST" },
      { status: 403 },
    );
  }
  const destination = new URL(request.url).searchParams.get("destination");
  if (!isCloudDestination(destination)) {
    return NextResponse.json(
      { error: "destination is required", code: "INVALID_DESTINATION" },
      { status: 400 },
    );
  }
  return NextResponse.json(await clearCloudChatDestination(destination));
}
