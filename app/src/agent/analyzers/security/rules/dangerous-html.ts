import traverse from '@babel/traverse';
import { Issue } from '../../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dangerousHtmlRule(ast: any): Issue[] {
  const issues: Issue[] = [];

  traverse(ast, {
    JSXAttribute(path) {
      if (path.node.name.name === 'dangerouslySetInnerHTML') {
        issues.push({
          id: 'dangerous-html',
          title: 'Uso de dangerouslySetInnerHTML',
          description:
            'Pode expor a aplicação a ataques XSS.',
          severity: 'high',
          category: 'security',
          line: path.node.loc?.start.line,
          suggestion: 'Sanitize o conteúdo antes de usar.',
        });
      }
    },
  });

  return issues;
}