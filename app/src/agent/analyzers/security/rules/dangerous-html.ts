import traverse from '@babel/traverse';
import { Issue } from '../../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dangerousHtmlRule(ast: any, code: string): Issue[] {
  const issues: Issue[] = [];
  const lines = code.split('\n');

  traverse(ast, {
    JSXAttribute(path) {
      if (path.node.name.name === 'dangerouslySetInnerHTML') {
        const line = path.node.loc?.start.line;
        const sourceLine = line ? lines[line - 1]?.trim() : '';

        issues.push({
          id: `dangerous-html-L${line}`,
          title: 'Uso de dangerouslySetInnerHTML',
          description: sourceLine,
          severity: 'high',
          category: 'security',
          line,
          suggestion: 'Use uma biblioteca de sanitização como DOMPurify antes de injetar HTML: DOMPurify.sanitize(html).',
          explanation: 'dangerouslySetInnerHTML injeta HTML diretamente no DOM sem sanitização. Se o conteúdo vier de input do usuário ou API externa, um atacante pode injetar scripts maliciosos (XSS).',
          benefit: 'Sanitizar o HTML previne ataques XSS, protegendo dados dos usuários e a integridade da aplicação.',
          fix: {
            description: 'Sanitizar com DOMPurify',
            code: `import DOMPurify from 'dompurify';\n\n<div\n  dangerouslySetInnerHTML={{\n    __html: DOMPurify.sanitize(html)\n  }}\n/>`,
          },
        });
      }
    },
  });

  return issues;
}