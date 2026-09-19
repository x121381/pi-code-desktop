import { NextResponse } from "next/server";
import { parseJsonWithinLimit, RequestBodyTooLargeError } from "@/lib/bounded-form-data";
import { CloudChatError, publishCloudChat } from "@/lib/cloud-chat";
import { isCloudDestination } from "@/lib/cloud-chat-store";
import { hasJsonContentType, isApiRequestAllowed } from "@/lib/request-security";

const MAX_CLOUD_PUBLISH_REQUEST_BYTES = 4 * 1024;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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
    const { id } = await params;
    const parsedBody = await parseJsonWithinLimit(request, MAX_CLOUD_PUBLISH_REQUEST_BYTES);
    if (!isRecord(parsedBody) || !isCloudDestination(parsedBody.destination)) {
      return NextResponse.json(
        { error: "destination is required", code: "INVALID_DESTINATION" },
        { status: 400 },
      );
    }
    const result = await publishCloudChat(id, parsedBody.destination);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json(
        { error: "Request body was too large", code: "REQUEST_TOO_LARGE" },
        { status: 413 },
      );
    }
    if (error instanceof CloudChatError) {
      return NextResponse.json(
        { error: "Could not publish this chat", code: error.code },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { error: "Could not publish this chat", code: "UPSTREAM_ERROR" },
      { status: 500 },
    );
  }
}
