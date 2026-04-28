import { parseCode } from '../../utils/ast';
import { Issue } from '../../types';
import { badNamingRule } from './rules/bad-naming';
import { largeFunctionRule } from './rules/large-function';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RULE_MAP: Record<string, (ast: any, code: string) => Issue[]> = {
  'bad-naming': badNamingRule,
  'large-function': largeFunctionRule,
};

export function analyzeCleanCode(code: string, enabledRules?: Set<string>) {
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
  });

  return Math.max(score, 0);
}