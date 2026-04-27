import traverse from '@babel/traverse';
import { Issue } from '../../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function largeFunctionRule(ast: any, code: string): Issue[] {
  const issues: Issue[] = [];
  const lines = code.split('\n');

  traverse(ast, {
    Function(path) {
      const body = path.node.body;
      const fnLength = body.loc ? body.loc.end.line - body.loc.start.line : 0;

      if (body.loc && fnLength > 30) {
        const line = path.node.loc?.start.line;
        const sourceLine = line ? lines[line - 1]?.trim() : '';

        issues.push({
          id: `large-function-L${line}`,
          title: 'Função muito longa',
          description: sourceLine,
          severity: 'medium',
          category: 'clean-code',
          line,
          suggestion: 'Divida em funções menores com responsabilidades únicas.',
          explanation: `Função na linha ${line} tem ${fnLength} linhas. Funções longas são difíceis de entender, testar e manter.`,
          benefit: 'Funções menores são mais legíveis, reutilizáveis e fáceis de testar unitariamente.',
          fix: {
            description: 'Dividir em funções menores',
            code: `${sourceLine}\n  // Extrair blocos de lógica:\n  const result = processStep1();\n  const output = processStep2(result);\n  return formatOutput(output);\n}`,
          },
        });
      }
    },
  });

  return issues;
}