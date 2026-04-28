import traverse from "@babel/traverse";
import { Issue } from "../../types";
import { CustomRule } from "@/app/src/features/rules-settings/services/custom-rules-storage";

/**
 * Executes a custom rule's generated code against an AST.
 * The code is expected to define a `rule(ast, code)` function.
 * We provide `traverse` in scope so the generated code can use it.
 */
export function executeCustomRule(
  customRule: CustomRule,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ast: any,
  code: string
): Issue[] {
  try {
    // Create a function that has `traverse` in scope and defines+calls `rule`
    const fn = new Function(
      "traverse",
      "ast",
      "code",
      `${customRule.code}\nreturn rule(ast, code);`
    );

    const result = fn(traverse, ast, code);

    // Validate output is an array of issues
    if (!Array.isArray(result)) return [];

    // Sanitize: ensure each issue has required fields
    return result
      .filter(
        (item: unknown) =>
          typeof item === "object" && item !== null && "id" in item && "title" in item
      )
      .map((item: Record<string, unknown>) => ({
        id: String(item.id ?? ""),
        title: String(item.title ?? ""),
        description: String(item.description ?? ""),
        severity: customRule.severity,
        category: customRule.category,
        line: typeof item.line === "number" ? item.line : undefined,
        suggestion: typeof item.suggestion === "string" ? item.suggestion : undefined,
        explanation: typeof item.explanation === "string" ? item.explanation : undefined,
        benefit: typeof item.benefit === "string" ? item.benefit : undefined,
        fix:
          typeof item.fix === "object" && item.fix !== null
            ? {
                description: String((item.fix as Record<string, unknown>).description ?? ""),
                code:
                  typeof (item.fix as Record<string, unknown>).code === "string"
                    ? String((item.fix as Record<string, unknown>).code)
                    : undefined,
              }
            : undefined,
      }));
  } catch (err) {
    console.warn(`Custom rule "${customRule.name}" failed:`, err);
    return [];
  }
}
