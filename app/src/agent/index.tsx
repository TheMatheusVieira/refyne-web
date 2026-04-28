import { analyzeCleanCode } from './analyzers/clean-code';
import { analyzePerformance } from './analyzers/performance';
import { analyzeSecurity } from './analyzers/security';
import { analyzeCustomRules } from './analyzers/custom';
import { enrichWithAI } from './llm/enrich';
import { CustomRule } from '@/app/src/features/rules-settings/services/custom-rules-storage';

export async function runAgent(
  code: string,
  enabledRules?: Set<string>,
  customRules?: CustomRule[]
) {
  // 1. Análises locais (rápidas e baratas)
  const performance = analyzePerformance(code, enabledRules);
  const security = analyzeSecurity(code, enabledRules);
  const cleanCode = analyzeCleanCode(code, enabledRules);

  // 2. Custom rules (geradas por IA)
  const custom = analyzeCustomRules(code, customRules ?? []);
  for (const issue of custom.issues) {
    if (issue.category === 'performance') {
      performance.issues.push(issue);
    } else if (issue.category === 'security') {
      security.issues.push(issue);
    } else {
      cleanCode.issues.push(issue);
    }
  }
 
  let result = {
    performance,
    security,
    cleanCode,
  };

  // 3. (Opcional) Enriquecimento com IA
  result = await enrichWithAI(result);

  return result;
}