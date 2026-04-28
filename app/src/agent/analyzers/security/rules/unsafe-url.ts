import traverse from '@babel/traverse';
import { Issue } from '../../../types';

// Rules 2, 5, 9: Unsafe URLs - template literals in fetch, window.location assignment, HTTP URLs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function unsafeUrlRule(ast: any, code: string): Issue[] {
  const issues: Issue[] = [];
  const lines = code.split('\n');

  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;

      // Rule 9: fetch("http://...") — insecure HTTP
      if (
        (callee.type === 'Identifier' && callee.name === 'fetch') ||
        (callee.type === 'MemberExpression' && 'name' in callee.property && callee.property.name === 'fetch')
      ) {
        const firstArg = path.node.arguments[0];
        if (firstArg?.type === 'StringLiteral' && firstArg.value.startsWith('http://')) {
          const line = path.node.loc?.start.line;
          const sourceLine = line ? lines[line - 1]?.trim() : '';

          issues.push({
            id: `insecure-http-L${line}`,
            title: 'Chamada HTTP insegura',
            description: sourceLine,
            severity: 'high',
            category: 'security',
            line,
            suggestion: 'Use HTTPS em todas as chamadas de API.',
            explanation: 'Requisições HTTP transmitem dados em texto plano. Qualquer intermediário (proxy, Wi-Fi público) pode interceptar e modificar os dados, incluindo tokens de autenticação.',
            benefit: 'HTTPS garante criptografia de ponta a ponta, protegendo dados em trânsito.',
            fix: {
              description: 'Trocar HTTP por HTTPS',
              code: sourceLine.replace('http://', 'https://'),
            },
          });
        }

        // Rule 2: fetch(`/api?id=${userInput}`) — template literal in URL
        if (firstArg?.type === 'TemplateLiteral' && firstArg.expressions.length > 0) {
          const line = path.node.loc?.start.line;
          const sourceLine = line ? lines[line - 1]?.trim() : '';

          issues.push({
            id: `unsanitized-url-L${line}`,
            title: 'Input não sanitizado em URL',
            description: sourceLine,
            severity: 'high',
            category: 'security',
            line,
            suggestion: 'Sanitize inputs com encodeURIComponent() ou use URLSearchParams para construir queries.',
            explanation: 'Interpolar variáveis diretamente na URL permite injeção de parâmetros ou manipulação de path. Um atacante pode alterar a URL para acessar dados de outros usuários.',
            benefit: 'Sanitizar parâmetros de URL previne injection attacks e garante que a requisição vai para o destino correto.',
            fix: {
              description: 'Usar URLSearchParams',
              code: `const params = new URLSearchParams({ id: userInput });\nfetch(\`/api?\${params}\`);`,
            },
          });
        }
      }
    },

    AssignmentExpression(path) {
      const left = path.node.left;

      // Rule 5: window.location = userInput (open redirect)
      if (
        left.type === 'MemberExpression' &&
        left.object.type === 'Identifier' &&
        left.object.name === 'window' &&
        'name' in left.property &&
        (left.property.name === 'location' || left.property.name === 'href')
      ) {
        const right = path.node.right;
        // Flag if the right side is a variable (not a string literal)
        if (right.type !== 'StringLiteral') {
          const line = path.node.loc?.start.line;
          const sourceLine = line ? lines[line - 1]?.trim() : '';

          issues.push({
            id: `open-redirect-L${line}`,
            title: 'Possível Open Redirect',
            description: sourceLine,
            severity: 'high',
            category: 'security',
            line,
            suggestion: 'Valide a URL contra uma whitelist de domínios permitidos antes de redirecionar.',
            explanation: 'Atribuir input do usuário a window.location permite redirecionamento para sites maliciosos (phishing). O atacante pode criar um link que parece legítimo mas redireciona para uma página falsa.',
            benefit: 'Validar URLs de redirecionamento protege usuários contra phishing e ataques de engenharia social.',
            fix: {
              description: 'Validar URL antes de redirecionar',
              code: `const ALLOWED_HOSTS = ['app.exemplo.com'];\nconst url = new URL(target, window.location.origin);\nif (ALLOWED_HOSTS.includes(url.hostname)) {\n  window.location.href = url.toString();\n}`,
            },
          });
        }
      }
    },
  });

  return issues;
}
