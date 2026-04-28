import { Category, Severity } from "@/app/src/agent/types";

const STORAGE_KEY = "refyne-custom-rules";

export interface CustomRule {
  id: string;
  name: string;
  description: string;
  category: Category;
  severity: Severity;
  /** The user's original natural language prompt */
  prompt: string;
  /** Generated rule function body (JavaScript) */
  code: string;
  createdAt: string;
  enabled: boolean;
}

export function loadCustomRules(): CustomRule[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomRules(rules: CustomRule[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
}

export function addCustomRule(rule: CustomRule): void {
  const rules = loadCustomRules();
  rules.push(rule);
  saveCustomRules(rules);
}

export function removeCustomRule(id: string): void {
  const rules = loadCustomRules().filter((r) => r.id !== id);
  saveCustomRules(rules);
}

export function toggleCustomRule(id: string, enabled: boolean): void {
  const rules = loadCustomRules().map((r) =>
    r.id === id ? { ...r, enabled } : r
  );
  saveCustomRules(rules);
}
