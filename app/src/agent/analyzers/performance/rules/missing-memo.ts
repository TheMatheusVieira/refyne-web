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
          suggestion: 'Envolva o .map() com useMemo() para memorizar o resultado e evitar recálculos.',
          explanation: 'Cada re-render do componente recria o array inteiro via .map(), mesmo que os dados não tenham mudado. Isso causa trabalho desnecessário no React.',
          benefit: 'Com useMemo, o React reutiliza o resultado anterior quando as dependências não mudam, melhorando a performance em listas grandes.',
        });
      }
    },
  });

  return issues;
}