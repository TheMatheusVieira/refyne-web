import { parseCode } from '../../utils/ast';
import { Issue } from '../../types';
import { noEvalRule } from './rules/no-eval';
import { dangerousHtmlRule } from './rules/dangerous-html';



export function analyzeSecurity(code: string) {
  const ast = parseCode(code);

  const issues: Issue[] = [
    ...noEvalRule(ast),
    ...dangerousHtmlRule(ast),
  ];

  return {
    issues,
    score: calculateScore(issues),
  };
}

function calculateScore(issues: Issue[]) {
  let score = 100;

  issues.forEach((i) => {
    if (i.severity === 'high') score -= 20;
  });

  return Math.max(score, 0);
}