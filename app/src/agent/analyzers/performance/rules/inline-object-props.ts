import traverse from '@babel/traverse';
import { Issue } from '../../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function inlineObjectPropsRule(ast: any, code: string): Issue[] {
  const issues: Issue[] = [];
  const lines = code.split('\n');

  traverse(ast, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    JSXAttribute(path: any) {
      const value = path.node.value;
      if (value?.type !== 'JSXExpressionContainer') return;

      const expr = value.expression;
      const propName = path.node.name?.name ?? 'prop';
      if (propName === 'style') return;
      if (propName === 'key') return;

      let issueType: string | null = null;
      let fixSuggestion = '';

      if (expr.type === 'ObjectExpression') {
        issueType = 'Objeto inline';
        fixSuggestion = `const ${propName}Config = useMemo(\n  () => (${getSourceLine(lines, expr.loc?.start.line)}),\n  [/* deps */]\n);`;
      } else if (expr.type === 'ArrayExpression' && expr.elements.length > 0) {
        issueType = 'Array inline';
        fixSuggestion = `const ${propName}Items = useMemo(\n  () => ${getSourceLine(lines, expr.loc?.start.line)},\n  [/* deps */]\n);`;
      } else if (expr.type === 'NewExpression') {
        issueType = 'Instância inline (new)';
        fixSuggestion = `const ${propName}Instance = useMemo(\n  () => new ${expr.callee?.name ?? 'Class'}(...),\n  []\n);`;
      }

      if (!issueType) return;

      const line = path.node.loc?.start.line;
      const sourceLine = line ? lines[line - 1]?.trim() : '';

      issues.push({
        id: `inline-object-prop-L${line}`,
        title: `${issueType} em prop JSX`,
        description: sourceLine,
        severity: 'medium',
        category: 'performance',
        line,
        suggestion: `Extraia o valor para uma constante ou use useMemo para estabilizar a referência.`,
        explanation: `Criar ${issueType.toLowerCase()} diretamente em props JSX gera uma nova referência a cada render. Isso invalida React.memo e causa re-renders desnecessários em componentes filhos.`,
        benefit: 'Referências estáveis preservam memoização de componentes filhos, evitando re-renders em cascata.',
        fix: {
          description: 'Estabilizar referência',
          code: fixSuggestion,
        },
      });
    },
  });

  return issues;
}

function getSourceLine(lines: string[], line?: number): string {
  if (!line) return '{ /* ... */ }';
  return lines[line - 1]?.trim() ?? '{ /* ... */ }';
}
