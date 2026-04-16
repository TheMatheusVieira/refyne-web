import traverse from '@babel/traverse';
import { Issue } from '../../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function largeFunctionRule(ast: any): Issue[] {
  const issues: Issue[] = [];

  traverse(ast, {
    Function(path) {
      const body = path.node.body;

      if (body.loc && body.loc.end.line - body.loc.start.line > 30) {
        issues.push({
          id: `large-function-L${path.node.loc?.start.line}`,
          title: 'Função muito longa',
          description: `Função na linha ${path.node.loc?.start.line} tem ${body.loc.end.line - body.loc.start.line} linhas.`,
          severity: 'medium',
          category: 'clean-code',
          line: path.node.loc?.start.line,
          suggestion: 'Divida em funções menores.',
        });
      }
    },
  });

  return issues;
}