import { readFileSync, writeFileSync } from "fs";
import { invalidateScannedSession, readSessionHeader } from "./session-reader";
import { sessionPathKey } from "./session-path";
import { scanSessionFilesAcrossRoots } from "./session-scan";

/** Re-attach every direct child of a session, including retained-root copies. */
export async function reparentDirectChildSessions(
  filePath: string,
  parentSessionPath?: string,
): Promise<number> {
  const targetPathKey = sessionPathKey(filePath);
  const sessions = await scanSessionFilesAcrossRoots();
  let rewritten = 0;

  for (const session of sessions) {
    if (
      sessionPathKey(session.path) === targetPathKey ||
      !session.parentSessionPath ||
      sessionPathKey(session.parentSessionPath) !== targetPathKey
    ) {
      continue;
    }

    try {
      const header = readSessionHeader(session.path);
      if (
        !header?.parentSession ||
        sessionPathKey(header.parentSession) !== targetPathKey
      ) {
        continue;
      }
      const content = readFileSync(session.path, "utf8");
      const newlineIdx = content.indexOf("\n");
      const rest = newlineIdx === -1 ? "" : content.slice(newlineIdx);
      writeFileSync(
        session.path,
        JSON.stringify({ ...header, parentSession: parentSessionPath }) + rest,
      );
      invalidateScannedSession(session.path);
      rewritten++;
    } catch {
      // A malformed or concurrently removed session must not block deletion.
    }
  }

  return rewritten;
}
