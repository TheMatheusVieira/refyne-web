import traverse from '@babel/traverse';
import { Issue } from '../../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function noEvalRule(ast: any, code: string): Issue[] {
  const issues: Issue[] = [];
  const lines = code.split('\n');

  traverse(ast, {
    CallExpression(path) {
      if ('name' in path.node.callee && path.node.callee.name === 'eval') {
        const line = path.node.loc?.start.line;
        const sourceLine = line ? lines[line - 1]?.trim() : '';

        issues.push({
          id: `no-eval-L${line}`,
          title: 'Uso de eval()',
          description: sourceLine,
          severity: 'high',
          category: 'security',
          line,
          suggestion: 'Substitua eval() por JSON.parse(), Function constructor controlado, ou lógica específica para o caso de uso.',
          explanation: 'eval() executa qualquer string como código JavaScript. Se essa string for manipulada por um usuário mal-intencionado, ele pode executar código arbitrário no navegador, roubar dados ou comprometer a sessão.',
          benefit: 'Eliminar eval remove um dos vetores de ataque mais perigosos, tornando o código imune a injeção de código via input.',
          fix: {
            description: 'Usar JSON.parse em vez de eval',
            code: sourceLine.replace(/eval\((.+?)\)/, 'JSON.parse($1)'),
          },
        });
      }
    },

    NewExpression(path) {
      if (path.node.callee.type === 'Identifier' && path.node.callee.name === 'Function') {
        const line = path.node.loc?.start.line;
        const sourceLine = line ? lines[line - 1]?.trim() : '';

        issues.push({
          id: `new-function-L${line}`,
          title: 'Uso de new Function()',
          description: sourceLine,
          severity: 'high',
          category: 'security',
          line,
          suggestion: 'Substitua new Function() por uma abordagem segura como um mapa de funções ou lógica condicional.',
          explanation: 'new Function() é equivalente a eval() — compila e executa strings como código. Atacantes podem injetar código malicioso se o argumento vier de input externo.',
          benefit: 'Eliminar new Function() remove um vetor de injeção de código, tornando a aplicação mais segura.',
          fix: {
            description: 'Usar mapa de funções em vez de new Function',
            code: `// Em vez de new Function(code):\nconst actions = {\n  soma: (a, b) => a + b,\n  mult: (a, b) => a * b,\n};\nconst result = actions[actionName]?.(a, b);`,
          },
        });
      }
    },
  });

  return issues;
}