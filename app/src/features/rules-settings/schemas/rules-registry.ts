import { Category, Severity } from "@/app/src/agent/types";

export interface RuleDefinition {
  id: string;
  name: string;
  description: string;
  category: Category;
  defaultSeverity: Severity;
}

export const rulesRegistry: RuleDefinition[] = [
  // Performance
  {
    id: "no-index-key",
    name: "no-index-key",
    description:
      "Detects the use of array index as key in JSX lists, which can cause bugs with dynamic reordering.",
    category: "performance",
    defaultSeverity: "medium",
  },
  {
    id: "no-inline-functions",
    name: "no-inline-functions",
    description:
      "Discourages arrow functions directly in JSX props to prevent unnecessary memory allocations on every render.",
    category: "performance",
    defaultSeverity: "medium",
  },
  {
    id: "missing-memo",
    name: "missing-memo",
    description:
      "Detects .map() calls inside render without useMemo, causing unnecessary re-computations on each render cycle.",
    category: "performance",
    defaultSeverity: "medium",
  },

  // Clean Code
  {
    id: "bad-naming",
    name: "bad-naming",
    description:
      "Flags single-letter variable names that lack descriptive intent, reducing code readability.",
    category: "clean-code",
    defaultSeverity: "low",
  },
  {
    id: "large-function",
    name: "large-function",
    description:
      "Detects functions exceeding 30 lines, indicating they should be split into smaller, focused units.",
    category: "clean-code",
    defaultSeverity: "medium",
  },

  // Security
  {
    id: "no-eval",
    name: "no-eval",
    description:
      "Flags eval() calls that execute arbitrary strings as code, opening severe injection vulnerabilities.",
    category: "security",
    defaultSeverity: "high",
  },
  {
    id: "dangerous-html",
    name: "dangerous-html",
    description:
      "Detects dangerouslySetInnerHTML usage that can expose the application to XSS attacks.",
    category: "security",
    defaultSeverity: "high",
  },
];

export function getRulesByCategory(category: Category): RuleDefinition[] {
  return rulesRegistry.filter((r) => r.category === category);
}
