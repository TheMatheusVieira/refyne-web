import traverse from '@babel/traverse';
import { Issue } from '../../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function noEvalRule(ast: any): Issue[] {
  const issues: Issue[] = [];

  traverse(ast, {
    CallExpression(path) {
      if ('name' in path.node.callee && path.node.callee.name === 'eval') {
        issues.push({
          id: 'no-eval',
          title: 'Uso de eval',
          description: 'eval pode abrir brechas de segurança.',
          severity: 'high',
          category: 'security',
          line: path.node.loc?.start.line,
          suggestion: 'Evite eval. Use alternativas seguras.',
        });
      }
    },
  });

  return issues;
}