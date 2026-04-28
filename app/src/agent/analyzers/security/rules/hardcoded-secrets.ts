import traverse from '@babel/traverse';
import { Issue } from '../../../types';

const SECRET_PATTERNS = [
  /api[_-]?key/i,
  /secret/i,
  /token/i,
  /password/i,
  /passwd/i,
  /auth/i,
  /private[_-]?key/i,
  /access[_-]?key/i,
  /client[_-]?secret/i,
  /bearer/i,
];

// Rule 4: Never expose secrets in frontend code
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hardcodedSecretsRule(ast: any, code: string): Issue[] {
  const issues: Issue[] = [];
  const lines = code.split('\n');

  traverse(ast, {
    VariableDeclarator(path) {
      const id = path.node.id;
      if (id.type !== 'Identifier') return;

      const init = path.node.init;
      if (!init || init.type !== 'StringLiteral') return;

      // Check if variable name looks like a secret
      const varName = id.name;
      const matchesPattern = SECRET_PATTERNS.some(p => p.test(varName));
      if (!matchesPattern) return;

      // Skip short values (unlikely to be real secrets)
      if (init.value.length < 8) return;

      const line = path.node.loc?.start.line;
      const sourceLine = line ? lines[line - 1]?.trim() : '';

      issues.push({
        id: `hardcoded-secret-L${line}`,
        title: 'Segredo hardcoded no código',
        description: sourceLine,
        severity: 'high',
        category: 'security',
        line,
        suggestion: 'Mova o segredo para variáveis de ambiente (process.env) e nunca comite no repositório.',
        explanation: `A variável "${varName}" parece conter um segredo (token, API key, senha). Código frontend é público — qualquer pessoa pode inspecionar e extrair esse valor.`,
        benefit: 'Segredos em variáveis de ambiente ficam protegidos do código-fonte e podem ser rotacionados sem deploy.',
        fix: {
          description: 'Usar variável de ambiente',
          code: `// .env.local\n${varName.toUpperCase()}=seu_valor_aqui\n\n// No código:\nconst ${varName} = process.env.${varName.toUpperCase()};`,
        },
      });
    },
  });

  return issues;
}
