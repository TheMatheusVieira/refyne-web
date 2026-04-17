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
          suggestion: 'Use uma biblioteca de sanitização como DOMPurify antes de injetar HTML: DOMPurify.sanitize(html).',
          explanation: 'dangerouslySetInnerHTML injeta HTML diretamente no DOM sem sanitização. Se o conteúdo vier de input do usuário ou API externa, um atacante pode injetar scripts maliciosos (XSS).',
          benefit: 'Sanitizar o HTML previne ataques XSS, protegendo dados dos usuários e a integridade da aplicação.',
        });
      }
    },
  });

  return issues;
}