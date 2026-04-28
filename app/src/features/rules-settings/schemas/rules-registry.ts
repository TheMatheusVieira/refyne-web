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
  {
    id: "nested-iteration",
    name: "nested-iteration",
    description:
      "Detects nested loops (.map/.forEach/.filter inside another) causing O(n²) complexity.",
    category: "performance",
    defaultSeverity: "high",
  },
  {
    id: "inline-object-props",
    name: "inline-object-props",
    description:
      "Flags inline object/array literals in JSX props that create new references every render.",
    category: "performance",
    defaultSeverity: "medium",
  },
  {
    id: "heavy-computation",
    name: "heavy-computation",
    description:
      "Detects heavy computations (sort, reduce, filter chains) inside render without useMemo.",
    category: "performance",
    defaultSeverity: "high",
  },
  {
    id: "conditional-remount",
    name: "conditional-remount",
    description:
      "Flags ternary operators returning different JSX components, causing unnecessary unmount/remount cycles.",
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
      "Flags eval() and new Function() calls that execute arbitrary strings as code, opening severe injection vulnerabilities.",
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
  {
    id: "hardcoded-secrets",
    name: "hardcoded-secrets",
    description:
      "Detects hardcoded tokens, API keys, passwords, and secrets that should be in environment variables.",
    category: "security",
    defaultSeverity: "high",
  },
  {
    id: "unsafe-url",
    name: "unsafe-url",
    description:
      "Detects unsanitized user input in URLs, HTTP calls, and open redirect vulnerabilities.",
    category: "security",
    defaultSeverity: "high",
  },
  {
    id: "unsafe-link",
    name: "unsafe-link",
    description:
      "Flags <a target='_blank'> links without rel='noopener noreferrer', enabling tabnabbing attacks.",
    category: "security",
    defaultSeverity: "medium",
  },
  {
    id: "unsafe-cookie",
    name: "unsafe-cookie",
    description:
      "Detects client-side cookie manipulation via document.cookie that should be server-side with HttpOnly.",
    category: "security",
    defaultSeverity: "high",
  },
  {
    id: "unsafe-json-parse",
    name: "unsafe-json-parse",
    description:
      "Flags JSON.parse() calls without try-catch, which can crash on malformed external input.",
    category: "security",
    defaultSeverity: "medium",
  },
  {
    id: "unsafe-localstorage",
    name: "unsafe-localstorage",
    description:
      "Detects localStorage reads for auth/access control data that can be tampered with by users or stolen via XSS.",
    category: "security",
    defaultSeverity: "high",
  },
  {
    id: "no-exhibitions",
    name: "no-exhibitions",
    description:
      "Detects exposed sensitive data and tokens that should be moved to secure environment variables.",
    category: "security",
    defaultSeverity: "high",
  },
];

export function getRulesByCategory(category: Category): RuleDefinition[] {
  return rulesRegistry.filter((r) => r.category === category);
}
