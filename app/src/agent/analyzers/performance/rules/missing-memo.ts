import traverse from '@babel/traverse';
import { Issue } from '../../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function missingMemoRule(ast: any): Issue[] {
  const issues: Issue[] = [];

  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;

      if (
        callee.type === 'MemberExpression' &&
        'name' in callee.property &&
        callee.property.name === 'map'
      ) {
        issues.push({
          id: 'missing-memo',
          title: 'Lista não otimizada',
          description:
            'Map dentro do render pode causar re-renderizações desnecessárias.',
          severity: 'medium',
          category: 'performance',
          line: path.node.loc?.start.line,
          suggestion: 'Considere usar useMemo.',
        });
      }
    },
  });

  return issues;
}