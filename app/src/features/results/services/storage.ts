import type { Issue } from "@/app/src/agent/types";

const RESULT_KEY = "refyne:latest-result";

export interface CategoryResult {
  issues: Issue[];
  score: number;
}

export interface AnalysisResult {
  performance: CategoryResult;
  security: CategoryResult;
  cleanCode: CategoryResult;
}

export interface StoredResult {
  code: string;
  project: string;
  result: AnalysisResult;
  date: string;
  durationMs: number;
}

export function saveResult(data: StoredResult): void {
  localStorage.setItem(RESULT_KEY, JSON.stringify(data));
}

export function getResult(): StoredResult | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(RESULT_KEY);
  return raw ? JSON.parse(raw) : null;
}

const DISMISSED_KEY = "refyne:dismissed-issues";

export type IssueAction = "ignored" | "applied";

export function getIssueActions(): Record<string, IssueAction> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(DISMISSED_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function setIssueAction(issueId: string, action: IssueAction): void {
  const actions = getIssueActions();
  actions[issueId] = action;
  localStorage.setItem(DISMISSED_KEY, JSON.stringify(actions));
}
