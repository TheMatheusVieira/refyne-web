import { enrichWithAI } from "./enrich";
import { analyzePerformance } from "../analyzers/performance";
import { analyzeSecurity } from "../analyzers/security";
import { analyzeCleanCode } from "../analyzers/clean-code";
import { analyzeCustomRules } from "../analyzers/custom";
import { CustomRule } from "@/app/src/features/rules-settings/services/custom-rules-storage";


export async function runAgent(
  code: string,
  enabledRules?: Set<string>,
  customRules?: CustomRule[]
) {
  const performance = analyzePerformance(code, enabledRules);
  const security = analyzeSecurity(code, enabledRules);
  const cleanCode = analyzeCleanCode(code, enabledRules);

  // Run custom rules and merge issues into matching categories
  const custom = analyzeCustomRules(code, customRules ?? []);
  for (const issue of custom.issues) {
    if (issue.category === "performance") {
      performance.issues.push(issue);
      performance.score = Math.max(performance.score - (issue.severity === "high" ? 15 : issue.severity === "medium" ? 10 : 5), 0);
    } else if (issue.category === "security") {
      security.issues.push(issue);
      security.score = Math.max(security.score - (issue.severity === "high" ? 20 : issue.severity === "medium" ? 10 : 5), 0);
    } else {
      cleanCode.issues.push(issue);
      cleanCode.score = Math.max(cleanCode.score - (issue.severity === "high" ? 15 : issue.severity === "medium" ? 10 : 5), 0);
    }
  }

  let result = {
    performance,
    security,
    cleanCode,
  };

  // 🔥 AQUI entra a IA
  try {
    result = await enrichWithAI(result);
  } catch (err) {
    console.warn("AI enrichment failed, returning static analysis only:", err);
  }

  return result;
}