import traverse from '@babel/traverse';
import { Issue } from '../../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function noInlineFunctionsRule(ast: any, code: string): Issue[] {
  const issues: Issue[] = [];
  const lines = code.split('\n');

  traverse(ast, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    JSXAttribute(path: any) {
      const value = path.node.value;
      if (
        value?.type === 'JSXExpressionContainer' &&
        (value.expression.type === 'ArrowFunctionExpression' ||
          value.expression.type === 'FunctionExpression')
      ) {
        const line = path.node.loc?.start.line;
        const sourceLine = line ? lines[line - 1]?.trim() : '';
        const propName = path.node.name?.name ?? 'handler';

        issues.push({
          id: `no-inline-functions-L${line}`,
          title: 'Função inline em JSX',
          description: sourceLine,
          severity: 'medium',
          category: 'performance',
          line,
          suggestion: 'Extraia a função para uma variável fora do return ou use useCallback para estabilizar a referência.',
          explanation: 'Arrow functions declaradas diretamente em props JSX geram uma nova referência a cada render. Isso quebra a otimização do React.memo e causa re-renders desnecessários em componentes filhos.',
          benefit: 'Referências estáveis evitam re-renders de componentes filhos otimizados com memo, melhorando a performance geral.',
          fix: {
            description: 'Extrair para useCallback',
            code: `const ${propName}Handler = useCallback(() => {\n  // lógica aqui\n}, []);\n\n// No JSX:\n${propName}={${propName}Handler}`,
          },
        });
      }
    },
  });

  return issues;
}
