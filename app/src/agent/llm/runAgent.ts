import { enrichWithAI } from "./enrich";
import { analyzePerformance } from "../analyzers/performance";
import { analyzeSecurity } from "../analyzers/security";
import { analyzeCleanCode } from "../analyzers/clean-code";


export async function runAgent(code: string) {
  const performance = analyzePerformance(code);
  const security = analyzeSecurity(code);
  const cleanCode = analyzeCleanCode(code);

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