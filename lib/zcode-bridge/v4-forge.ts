/* eslint-disable @typescript-eslint/no-explicit-any */
import type { z } from "zod";

/**
 * Runtime-forged minimal instances of ZCode's deep zod schemas (zod v4).
 * ZCode's conversation snapshot/delta schemas are hundreds of fields deep and
 * evolve constantly; instead of hand-maintaining defaults, we walk the schema
 * and produce the smallest value that satisfies it. The result is verified
 * with the schema's own parse during tests.
 */

type AnySchema = any;

function defOf(schema: AnySchema): { type?: string; value?: unknown; innerType?: any; values?: readonly unknown[]; options?: any; entries?: any } | undefined {
  return schema._zod?.def ?? (schema as { def?: any }).def;
}

export function forgeMinimal(schema: AnySchema, depth = 0): unknown {
  if (depth > 24) return undefined;
  // Optional/default/nullable wrappers often accept undefined directly.
  const trial = schema.safeParse(undefined);
  if (trial.success) return undefined;

  const def = defOf(schema);
  const type = def?.type;

  switch (type) {
    case "object":
    case "loose_object":
    case "strict_object": {
      const out: Record<string, unknown> = {};
      const shape = (schema.shape ?? def?.entries ?? {}) as Record<string, AnySchema>;
      for (const [key, field] of Object.entries(shape)) {
        out[key] = forgeMinimal(field, depth + 1);
      }
      return out;
    }
    case "string": {
      // enums: pick the first allowed literal
      const values = def?.values;
      if (Array.isArray(values) && values.length > 0) return values[0];
      const entries = def?.entries;
      if (entries && typeof entries === "object") return Object.keys(entries)[0] ?? "";
      return "";
    }
    case "enum": {
      const entries = def?.entries ?? def?.values;
      if (entries && typeof entries === "object") return Object.keys(entries)[0] ?? "";
      return "";
    }
    case "number":
      return 0;
    case "int":
      return 0;
    case "boolean":
      return false;
    case "bigint":
      return BigInt(0);
    case "array":
    case "tuple":
      return [];
    case "record":
      return {};
    case "nullable":
    case "null":
      return null;
    case "undefined":
    case "void":
      return undefined;
    case "literal":
      return Array.isArray(def?.values) ? def.values[0] : def?.value;
    case "default":
      return forgeMinimal(def?.innerType as AnySchema, depth + 1);
    case "optional":
      return undefined;
    case "catch":
      return forgeMinimal(def?.innerType as AnySchema, depth + 1);
    case "union":
    case "discriminated_union": {
      const options = (def?.options ?? []) as AnySchema[];
      for (const option of options) {
        const candidate = forgeMinimal(option, depth + 1);
        if (option.safeParse(candidate).success) return candidate;
      }
      return options.length > 0 ? forgeMinimal(options[0], depth + 1) : undefined;
    }
    case "pipe": {
      // z.pipe(in, out): forge from the OUTPUT side (what the consumer sees).
      const out = (schema as unknown as { _zod?: { def?: { out?: AnySchema; outType?: AnySchema } } })._zod?.def as
        | { out?: AnySchema }
        | undefined;
      if (out?.out) return forgeMinimal(out.out, depth + 1);
      return undefined;
    }
    case "lazy": {
      const getter = (schema as unknown as { _zod?: { def?: { getter?: () => AnySchema } } })._zod?.def?.getter;
      if (getter) return forgeMinimal(getter(), depth + 1);
      return undefined;
    }
    default:
      return undefined;
  }
}

/** Forge a minimal instance and validate it against the schema; throws with zod details when invalid. */
export function forgeValidated(schema: AnySchema, label: string): any {
  const candidate = forgeMinimal(schema);
  const result = schema.safeParse(candidate);
  if (!result.success) {
    const issues = (result as { error?: { issues?: unknown[] } }).error?.issues
      ?.slice(0, 6)
      .map((issue) => JSON.stringify(issue))
      .join("; ");
    throw new Error(`forgeMinimal(${label}) produced an invalid instance: ${issues}`);
  }
  return result.data;
}
