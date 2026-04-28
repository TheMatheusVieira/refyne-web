import traverse from '@babel/traverse';
import { Issue } from '../../../types';

// Rule 10: Unguarded JSON.parse
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function unsafeJsonParseRule(ast: any, code: string): Issue[] {
  const issues: Issue[] = [];
  const lines = code.split('\n');

  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;

      // Match JSON.parse(...)
      if (
        callee.type !== 'MemberExpression' ||
        callee.object.type !== 'Identifier' ||
        callee.object.name !== 'JSON' ||
        !('name' in callee.property) ||
        callee.property.name !== 'parse'
      ) {
        return;
      }

      // Check if already wrapped in try-catch
      let wrapped = false;
      let parent = path.parentPath;
      while (parent) {
        if (parent.node.type === 'TryStatement') {
          wrapped = true;
          break;
        }
        parent = parent.parentPath;
      }

      if (wrapped) return;

      const line = path.node.loc?.start.line;
      const sourceLine = line ? lines[line - 1]?.trim() : '';

      issues.push({
        id: `unsafe-json-parse-L${line}`,
        title: 'JSON.parse sem tratamento de erro',
        description: sourceLine,
        severity: 'medium',
        category: 'security',
        line,
        suggestion: 'Envolva JSON.parse em try-catch para tratar dados malformados ou manipulados.',
        explanation: 'JSON.parse lança uma exceção se o input não for JSON válido. Se os dados vierem de uma fonte externa (API, localStorage, URL), podem ser manipulados para causar crashes ou comportamento inesperado.',
        benefit: 'Try-catch garante que dados malformados sejam tratados graciosamente sem crashar a aplicação.',
        fix: {
          description: 'Usar try-catch',
          code: `let data;\ntry {\n  data = ${sourceLine || 'JSON.parse(input)'};\n} catch {\n  data = null; // ou valor padrão seguro\n}`,
        },
      });
    },
  });

  return issues;
}
