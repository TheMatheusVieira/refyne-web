import {parseCode } from '../../utils/ast';
import { Issue } from '../../types';
import { badNamingRule } from './rules/bad-naming';
import { largeFunctionRule } from './rules/large-function';


export function analyzeCleanCode(code: string) {
  const ast = parseCode(code);

  const issues: Issue[] = [
    ...badNamingRule(ast),
    ...largeFunctionRule(ast),
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