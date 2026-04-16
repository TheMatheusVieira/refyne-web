import { analyzeCleanCode } from './analyzers/clean-code';
import { analyzePerformance } from './analyzers/performance';
import { analyzeSecurity } from './analyzers/security';
import { enrichWithAI } from './llm/enrich';

export async function runAgent(code: string) {
  // 1. Análises locais (rápidas e baratas)
  const performance = analyzePerformance(code);
  const security = analyzeSecurity(code);
  const cleanCode = analyzeCleanCode(code);
 
  let result = {
    performance,
    security,
    cleanCode,
  };

  // 2. (Opcional) Enriquecimento com IA
  result = await enrichWithAI(result);

  return result;
}