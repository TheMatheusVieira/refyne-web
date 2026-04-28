import traverse from '@babel/traverse';
import { Issue } from '../../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function conditionalRemountRule(ast: any, code: string): Issue[] {
  const issues: Issue[] = [];
  const lines = code.split('\n');

  traverse(ast, {
    ConditionalExpression(path) {
      const { consequent, alternate } = path.node;

      if (
        consequent.type === 'JSXElement' &&
        alternate &&
        alternate.type === 'JSXElement' &&
        getComponentName(consequent) !== getComponentName(alternate)
      ) {
        const line = path.node.loc?.start.line;
        const sourceLine = line ? lines[line - 1]?.trim() : '';
        const comp1 = getComponentName(consequent) ?? 'ComponentA';
        const comp2 = getComponentName(alternate) ?? 'ComponentB';

        issues.push({
          id: `conditional-remount-L${line}`,
          title: 'Remontagem condicional de componentes',
          description: sourceLine,
          severity: 'medium',
          category: 'performance',
          line,
          suggestion: 'Use CSS (display/visibility) ou renderize ambos com props condicionais em vez de montar/desmontar.',
          explanation: `Alternar entre <${comp1} /> e <${comp2} /> via ternário causa desmontagem completa e remontagem. Todo estado interno é perdido e o DOM é recriado.`,
          benefit: 'Evitar remontagem preserva estado interno, evita layout shifts e reduz trabalho do React.',
          fix: {
            description: 'Usar CSS para esconder',
            code: `<div style={{ display: condition ? 'block' : 'none' }}>\n  <${comp1} />\n</div>\n<div style={{ display: condition ? 'none' : 'block' }}>\n  <${comp2} />\n</div>`,
          },
        });
      }
    },

    LogicalExpression(path) {
      if (
        path.node.operator === '&&' &&
        path.node.right.type === 'JSXElement'
      ) {
        const compName = getComponentName(path.node.right);
        if (!compName || compName[0] !== compName[0].toUpperCase()) return;

        const line = path.node.loc?.start.line;
        const sourceLine = line ? lines[line - 1]?.trim() : '';

        issues.push({
          id: `toggle-remount-L${line}`,
          title: `Toggle mount/unmount de <${compName} />`,
          description: sourceLine,
          severity: 'low',
          category: 'performance',
          line,
          suggestion: `Se <${compName} /> é pesado, considere manter montado e controlar visibilidade via CSS ou prop.`,
          explanation: `O padrão "condition && <${compName} />" desmonta e remonta o componente a cada toggle. Se o componente tem estado interno, efeitos ou é pesado, isso custa caro.`,
          benefit: 'Manter montado evita recriação de DOM e preserva estado interno.',
          fix: {
            description: 'Manter montado com CSS',
            code: `<div style={{ display: condition ? 'block' : 'none' }}>\n  <${compName} />\n</div>`,
          },
        });
      }
    },
  });

  return issues;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getComponentName(jsxElement: any): string | null {
  const opening = jsxElement.openingElement;
  if (!opening) return null;
  const name = opening.name;
  if (name.type === 'JSXIdentifier') return name.name;
  if (name.type === 'JSXMemberExpression') return `${name.object?.name}.${name.property?.name}`;
  return null;
}
