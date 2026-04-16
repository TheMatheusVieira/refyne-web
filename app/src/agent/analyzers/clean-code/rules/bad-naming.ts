import traverse from '@babel/traverse';
import { Issue } from '../../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function badNamingRule(ast: any): Issue[] {
  const issues: Issue[] = [];

  traverse(ast, {
    Identifier(path) {
      const name = path.node.name;

      if (name.length === 1) {
        issues.push({
          id: `bad-naming-${name}-L${path.node.loc?.start.line}`,
          title: 'Variável pouco descritiva',
          description: `O nome "${name}" não é descritivo.`,
          severity: 'low',
          category: 'clean-code',
          line: path.node.loc?.start.line,
          suggestion: 'Use nomes mais claros e significativos.',
        });
      }
    },
  });

  return issues;
}