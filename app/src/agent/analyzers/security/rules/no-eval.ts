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
          title: 'Uso de eval',
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
  });

  return issues;
}