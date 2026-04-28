import traverse from '@babel/traverse';
import { Issue } from '../../../types';

// Rule 6: External links without rel="noopener noreferrer"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function unsafeLinkRule(ast: any, code: string): Issue[] {
  const issues: Issue[] = [];
  const lines = code.split('\n');

  traverse(ast, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    JSXOpeningElement(path: any) {
      const name = path.node.name;
      if (name.type !== 'JSXIdentifier' || name.name !== 'a') return;

      const attrs = path.node.attributes ?? [];
      const hasTargetBlank = attrs.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (attr: any) =>
          attr.type === 'JSXAttribute' &&
          attr.name?.name === 'target' &&
          attr.value?.type === 'StringLiteral' &&
          attr.value.value === '_blank',
      );

      if (!hasTargetBlank) return;

      const relAttr = attrs.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (attr: any) => attr.type === 'JSXAttribute' && attr.name?.name === 'rel',
      );

      const relValue =
        relAttr?.value?.type === 'StringLiteral' ? relAttr.value.value : '';

      const hasNoopener = relValue.includes('noopener');
      const hasNoreferrer = relValue.includes('noreferrer');

      if (hasNoopener && hasNoreferrer) return;

      const line = path.node.loc?.start.line;
      const sourceLine = line ? lines[line - 1]?.trim() : '';

      issues.push({
        id: `unsafe-link-L${line}`,
        title: 'Link externo sem proteção (tabnabbing)',
        description: sourceLine,
        severity: 'medium',
        category: 'security',
        line,
        suggestion: 'Adicione rel="noopener noreferrer" em links com target="_blank".',
        explanation: 'Sem rel="noopener noreferrer", a página aberta pode acessar window.opener e redirecionar sua aba original para um site malicioso (tabnabbing).',
        benefit: 'noopener impede acesso ao window.opener, noreferrer oculta o referrer. Juntos, eliminam o risco de tabnabbing.',
        fix: {
          description: 'Adicionar rel="noopener noreferrer"',
          code: `<a href="..." target="_blank" rel="noopener noreferrer">`,
        },
      });
    },
  });

  return issues;
}
