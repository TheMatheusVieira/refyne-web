import traverse from '@babel/traverse';
import { Issue } from '../../../types';

// Rule 8: Never manipulate sensitive cookies on the client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function unsafeCookieRule(ast: any, code: string): Issue[] {
  const issues: Issue[] = [];
  const lines = code.split('\n');

  traverse(ast, {
    AssignmentExpression(path) {
      const left = path.node.left;

      if (
        left.type === 'MemberExpression' &&
        left.object.type === 'Identifier' &&
        left.object.name === 'document' &&
        'name' in left.property &&
        left.property.name === 'cookie'
      ) {
        const line = path.node.loc?.start.line;
        const sourceLine = line ? lines[line - 1]?.trim() : '';

        issues.push({
          id: `unsafe-cookie-L${line}`,
          title: 'Manipulação de cookie sensível no client',
          description: sourceLine,
          severity: 'high',
          category: 'security',
          line,
          suggestion: 'Gerencie cookies sensíveis (tokens, sessão) apenas no servidor com flags HttpOnly e Secure.',
          explanation: 'document.cookie é acessível por qualquer script na página, incluindo scripts injetados via XSS. Cookies de sessão manipulados no client podem ser roubados ou alterados.',
          benefit: 'Cookies HttpOnly ficam invisíveis ao JavaScript, eliminando o risco de roubo via XSS.',
          fix: {
            description: 'Mover para server-side',
            code: `// No server (API route / middleware):\nres.setHeader('Set-Cookie', [\n  \`token=\${value}; HttpOnly; Secure; SameSite=Strict; Path=/\`\n]);`,
          },
        });
      }
    },

    MemberExpression(path) {
      // Also detect reading document.cookie
      if (
        path.node.object.type === 'Identifier' &&
        path.node.object.name === 'document' &&
        'name' in path.node.property &&
        path.node.property.name === 'cookie' &&
        path.parent.type !== 'AssignmentExpression'
      ) {
        const line = path.node.loc?.start.line;
        const sourceLine = line ? lines[line - 1]?.trim() : '';

        issues.push({
          id: `read-cookie-client-L${line}`,
          title: 'Leitura de cookie no client-side',
          description: sourceLine,
          severity: 'medium',
          category: 'security',
          line,
          suggestion: 'Evite ler cookies sensíveis no client. Use cookies HttpOnly acessíveis apenas pelo servidor.',
          explanation: 'Se cookies de sessão são legíveis via document.cookie, um ataque XSS pode roubar tokens de autenticação e comprometer a sessão do usuário.',
          benefit: 'Acessar cookies apenas no servidor garante que scripts maliciosos não consigam extraí-los.',
          fix: {
            description: 'Ler cookie no servidor',
            code: `// Em uma API route:\nconst token = req.cookies.get('token');\n// Ou via middleware Next.js:\nconst token = request.cookies.get('token');`,
          },
        });
      }
    },
  });

  return issues;
}
