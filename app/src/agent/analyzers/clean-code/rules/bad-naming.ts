import traverse from '@babel/traverse';
import { Issue } from '../../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function badNamingRule(ast: any, code: string): Issue[] {
  const issues: Issue[] = [];
  const idCounts = new Map<string, number>();

  const lines = code.split('\n');

  traverse(ast, {
    Identifier(path) {
      const name = path.node.name;

      if (name.length === 1) {
        const line = path.node.loc?.start.line;
        const col = path.node.loc?.start.column ?? 0;
        const baseId = `bad-naming-${name}-L${line}`;
        const count = (idCounts.get(baseId) ?? 0) + 1;
        idCounts.set(baseId, count);
        const id = count > 1 ? `${baseId}-${col}` : baseId;
        const sourceLine = line ? lines[line - 1]?.trim() : '';

        issues.push({
          id,
          title: 'Variável pouco descritiva',
          description: sourceLine,
          severity: 'low',
          category: 'clean-code',
          line,
          suggestion: 'Use nomes mais claros e significativos que revelem a intenção da variável.',
          explanation: `O nome "${name}" não é descritivo. Nomes de uma letra não comunicam o propósito da variável.`,
          benefit: 'Código auto-documentado reduz a necessidade de comentários e diminui o tempo de onboarding de novos devs.',
          fix: {
            description: 'Renomear para nome descritivo',
            code: sourceLine.replace(new RegExp(`\\b${name}\\b`), `${name}/* rename to descriptive name */`),
          },
        });
      }
    },
  });

  return issues;
}