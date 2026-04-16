import { parseCode } from '../../utils/ast';
import { Issue } from '../../types';

import { noIndexKeyRule } from './rules/no-index-key';
import { missingMemoRule } from './rules/missing-memo';
import { noInlineFunctionsRule } from './rules/no-inline-functions';

export function analyzePerformance(code: string) {
  const ast = parseCode(code);

  const issues: Issue[] = [
    ...noIndexKeyRule(ast),
    ...noInlineFunctionsRule(ast),
    ...missingMemoRule(ast),
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
  });

  return Math.max(score, 0);
}