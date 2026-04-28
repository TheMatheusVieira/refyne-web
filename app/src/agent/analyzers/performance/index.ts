import { parseCode } from '../../utils/ast';
import { Issue } from '../../types';

import { noIndexKeyRule } from './rules/no-index-key';
import { missingMemoRule } from './rules/missing-memo';
import { noInlineFunctionsRule } from './rules/no-inline-functions';
import { nestedIterationRule } from './rules/nested-iteration';
import { inlineObjectPropsRule } from './rules/inline-object-props';
import { heavyComputationRule } from './rules/heavy-computation';
import { conditionalRemountRule } from './rules/conditional-remount';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RULE_MAP: Record<string, (ast: any, code: string) => Issue[]> = {
  'no-index-key': noIndexKeyRule,
  'no-inline-functions': noInlineFunctionsRule,
  'missing-memo': missingMemoRule,
  'nested-iteration': nestedIterationRule,
  'inline-object-props': inlineObjectPropsRule,
  'heavy-computation': heavyComputationRule,
  'conditional-remount': conditionalRemountRule,
};

export function analyzePerformance(code: string, enabledRules?: Set<string>) {
  const ast = parseCode(code);

  const issues: Issue[] = [];
  for (const [id, ruleFn] of Object.entries(RULE_MAP)) {
    if (!enabledRules || enabledRules.has(id)) {
      issues.push(...ruleFn(ast, code));
    }
  }

  return {
    issues,
    score: calculateScore(issues),
  };
}

function calculateScore(issues: Issue[]) {
  let score = 100;

  issues.forEach((i) => {
    if (i.severity === 'high') score -= 15;
    if (i.severity === 'medium') score -= 10;
    if (i.severity === 'low') score -= 5;
  });

  return Math.max(score, 0);
}