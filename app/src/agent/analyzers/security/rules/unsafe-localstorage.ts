import traverse from '@babel/traverse';
import { Issue } from '../../../types';

const SENSITIVE_KEYS = [
  /token/i,
  /auth/i,
  /session/i,
  /role/i,
  /admin/i,
  /permission/i,
  /is[_-]?admin/i,
  /access/i,
  /credential/i,
];

// Rule 12: Never trust localStorage for auth/access control
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function unsafeLocalstorageRule(ast: any, code: string): Issue[] {
  const issues: Issue[] = [];
  const lines = code.split('\n');

  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;

      if (
        callee.type !== 'MemberExpression' ||
        callee.object.type !== 'Identifier' ||
        callee.object.name !== 'localStorage' ||
        !('name' in callee.property) ||
        callee.property.name !== 'getItem'
      ) {
        return;
      }

      const firstArg = path.node.arguments[0];
      if (!firstArg || firstArg.type !== 'StringLiteral') return;

      const key = firstArg.value;
      const isSensitive = SENSITIVE_KEYS.some(p => p.test(key));
      if (!isSensitive) return;

      const line = path.node.loc?.start.line;
      const sourceLine = line ? lines[line - 1]?.trim() : '';

      issues.push({
        id: `unsafe-localstorage-L${line}`,
        title: 'Dado sensível lido do localStorage',
        description: sourceLine,
        severity: 'high',
        category: 'security',
        line,
        suggestion: 'Não use localStorage para dados de autenticação ou controle de acesso. Use cookies HttpOnly gerenciados pelo servidor.',
        explanation: `A chave "${key}" parece conter dados sensíveis de auth/acesso. localStorage é acessível por qualquer script (incluindo XSS) e pode ser livremente editado pelo usuário via DevTools, permitindo escalação de privilégios.`,
        benefit: 'Mover autenticação para cookies HttpOnly elimina o risco de roubo de tokens via XSS e impede manipulação pelo usuário.',
        fix: {
          description: 'Usar cookie HttpOnly gerenciado pelo servidor',
          code: `// Em vez de localStorage.getItem("${key}"):\n// 1. Armazene o token em cookie HttpOnly (server-side)\n// 2. Valide a sessão no servidor:\nconst res = await fetch('/api/me');\nconst user = await res.json();`,
        },
      });
    },
  });

  return issues;
}
