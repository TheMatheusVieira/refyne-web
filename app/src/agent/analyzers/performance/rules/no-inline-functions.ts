import traverse from '@babel/traverse';
import { Issue } from '../../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function noInlineFunctionsRule(ast: any): Issue[] {
  const issues: Issue[] = [];

  traverse(ast, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    JSXAttribute(path: any) {
      const value = path.node.value;
      if (
        value?.type === 'JSXExpressionContainer' &&
        (value.expression.type === 'ArrowFunctionExpression' ||
          value.expression.type === 'FunctionExpression')
      ) {
        issues.push({
          id: 'no-inline-functions',
          title: 'Função inline em JSX',
          description: 'Funções inline em props de JSX criam novas referências a cada render.',
          severity: 'medium',
          category: 'performance',
          line: path.node.loc?.start.line,
          suggestion: 'Extraia a função para fora do JSX ou use useCallback.',
        });
      }
    },
  });

  return issues;
}
