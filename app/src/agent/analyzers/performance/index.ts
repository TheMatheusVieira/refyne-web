import { parseCode } from '../../utils/ast';
import { Issue } from '../../types';

import { noIndexKeyRule } from './rules/no-index-key';
import { missingMemoRule } from './rules/missing-memo';
import { noInlineFunctionsRule } from './rules/no-inline-functions';
import { nestedIterationRule } from './rules/nested-iteration';
import { inlineObjectPropsRule } from './rules/inline-object-props';
import { heavyComputationRule } from './rules/heavy-computation';
import { conditionalRemountRule } from './rules/conditional-remount';

export function analyzePerformance(code: string) {
  const ast = parseCode(code);

  const issues: Issue[] = [
    ...noIndexKeyRule(ast, code),
    ...noInlineFunctionsRule(ast, code),
    ...missingMemoRule(ast, code),
    ...nestedIterationRule(ast, code),
    ...inlineObjectPropsRule(ast, code),
    ...heavyComputationRule(ast, code),
    ...conditionalRemountRule(ast, code),
  ];

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