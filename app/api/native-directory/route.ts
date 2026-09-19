import { NextResponse } from "next/server";
import { parseJsonWithinLimit, RequestBodyTooLargeError } from "@/lib/bounded-form-data";
import {
  NativeDirectoryDialogError,
  selectNativeDirectory,
} from "@/lib/native-directory-dialog";
import { hasJsonContentType, isApiRequestAllowed } from "@/lib/request-security";

const MAX_NATIVE_DIRECTORY_REQUEST_BYTES = 4 * 1024;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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
    const parsedBody = await parseJsonWithinLimit(request, MAX_NATIVE_DIRECTORY_REQUEST_BYTES);
    if (!isRecord(parsedBody)) {
      return NextResponse.json(
        { error: "Request body must be valid JSON", code: "INVALID_JSON" },
        { status: 400 },
      );
    }
    const defaultPath = typeof parsedBody.defaultPath === "string" ? parsedBody.defaultPath : undefined;
    const title = typeof parsedBody.title === "string" ? parsedBody.title : undefined;
    const path = await selectNativeDirectory({ defaultPath, title });
    return NextResponse.json({ path, cancelled: path === null });
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json(
        { error: "Request body was too large", code: "REQUEST_TOO_LARGE" },
        { status: 413 },
      );
    }
    if (error instanceof NativeDirectoryDialogError) {
      return NextResponse.json(
        { error: "Could not open the system folder dialog", code: error.code },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { error: "Could not open the system folder dialog", code: "DIALOG_FAILED" },
      { status: 500 },
    );
  }
}
