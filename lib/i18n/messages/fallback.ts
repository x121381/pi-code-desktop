import { enLocale } from "./en";

/** Build a complete package while allowing focused translations per locale. */
export function withEnglishFallback(overrides: Record<string, string>): Record<string, string> {
  return { ...enLocale.messages, ...overrides };
}
