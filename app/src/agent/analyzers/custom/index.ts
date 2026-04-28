import { parseCode } from "../../utils/ast";
import { Issue } from "../../types";
import { CustomRule } from "@/app/src/features/rules-settings/services/custom-rules-storage";
import { executeCustomRule } from "./executor";

export function analyzeCustomRules(code: string, customRules: CustomRule[]) {
  const enabledRules = customRules.filter((r) => r.enabled);
  if (enabledRules.length === 0) return { issues: [], score: 100 };

  const ast = parseCode(code);
  const issues: Issue[] = [];

  for (const rule of enabledRules) {
    issues.push(...executeCustomRule(rule, ast, code));
  }

  return {
    issues,
    score: calculateScore(issues),
  };
}

function calculateScore(issues: Issue[]) {
  let score = 100;

  issues.forEach((i) => {
    if (i.severity === "high") score -= 15;
    else if (i.severity === "medium") score -= 10;
    else if (i.severity === "low") score -= 5;
  });

  return Math.max(score, 0);
}
