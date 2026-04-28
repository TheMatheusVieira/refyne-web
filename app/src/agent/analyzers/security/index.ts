import { parseCode } from '../../utils/ast';
import { Issue } from '../../types';
import { noEvalRule } from './rules/no-eval';
import { dangerousHtmlRule } from './rules/dangerous-html';
import { hardcodedSecretsRule } from './rules/hardcoded-secrets';
import { unsafeUrlRule } from './rules/unsafe-url';
import { unsafeLinkRule } from './rules/unsafe-link';
import { unsafeCookieRule } from './rules/unsafe-cookie';
import { unsafeJsonParseRule } from './rules/unsafe-json-parse';
import { unsafeLocalstorageRule } from './rules/unsafe-localstorage';
import { noExhibitionsRule } from './rules/no-exhibitions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RULE_MAP: Record<string, (ast: any, code: string) => Issue[]> = {
  'no-eval': noEvalRule,
  'dangerous-html': dangerousHtmlRule,
  'hardcoded-secrets': hardcodedSecretsRule,
  'unsafe-url': unsafeUrlRule,
  'unsafe-link': unsafeLinkRule,
  'unsafe-cookie': unsafeCookieRule,
  'unsafe-json-parse': unsafeJsonParseRule,
  'unsafe-localstorage': unsafeLocalstorageRule,
  'no-exhibitions': noExhibitionsRule,
};

export function analyzeSecurity(code: string, enabledRules?: Set<string>) {
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
    if (i.severity === 'high') score -= 20;
    else if (i.severity === 'medium') score -= 10;
    else if (i.severity === 'low') score -= 5;
  });

  return Math.max(score, 0);
}