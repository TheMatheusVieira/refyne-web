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
          suggestion: 'Substitua eval() por JSON.parse(), Function constructor controlado, ou lógica específica para o caso de uso.',
          explanation: 'eval() executa qualquer string como código JavaScript. Se essa string for manipulada por um usuário mal-intencionado, ele pode executar código arbitrário no navegador, roubar dados ou comprometer a sessão.',
          benefit: 'Eliminar eval remove um dos vetores de ataque mais perigosos, tornando o código imune a injeção de código via input.',
        });
      }
    },
  });

  return issues;
}