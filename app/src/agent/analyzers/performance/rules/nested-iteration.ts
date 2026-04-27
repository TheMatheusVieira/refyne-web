import traverse from '@babel/traverse';
import { Issue } from '../../../types';

const ITERATION_METHODS = ['find', 'filter', 'some', 'every', 'indexOf', 'includes', 'findIndex', 'reduce'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function nestedIterationRule(ast: any, code: string): Issue[] {
  const issues: Issue[] = [];
  const lines = code.split('\n');

  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;
      if (
        callee.type !== 'MemberExpression' ||
        !('name' in callee.property) ||
        callee.property.name !== 'map'
      ) return;

      // Walk the callback body looking for nested iteration calls
      const callback = path.node.arguments[0];
      if (!callback) return;

      findNestedIterations(callback, (methodName, innerLine) => {
        const line = innerLine ?? path.node.loc?.start.line;
        const sourceLine = line ? lines[line - 1]?.trim() : '';

        issues.push({
          id: `nested-iteration-L${line}`,
          title: `O(n²): .${methodName}() dentro de .map()`,
          description: sourceLine,
          severity: 'high',
          category: 'performance',
          line,
          suggestion: `Substitua a iteração aninhada por um Map/Set/objeto de lookup criado antes do .map().`,
          explanation: `Usar .${methodName}() dentro de .map() cria complexidade O(n²). Para cada item da lista, o React percorre outra lista inteira. Em listas grandes isso causa travamentos visíveis.`,
          benefit: 'Lookup com Map/Set reduz para O(n), eliminando lag em listas grandes.',
          fix: {
            description: 'Criar lookup antes do map',
            code: `// Antes do .map(), crie um lookup:\nconst lookup = new Map(\n  items.map(item => [item.id, item])\n);\n\n// Dentro do .map():\nconst found = lookup.get(id); // O(1)`,
          },
        });
      });
    },
  });

  return issues;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findNestedIterations(node: any, onFound: (method: string, line?: number) => void) {
  if (!node || typeof node !== 'object') return;

  if (
    node.type === 'CallExpression' &&
    node.callee?.type === 'MemberExpression' &&
    node.callee.property?.name &&
    ITERATION_METHODS.includes(node.callee.property.name)
  ) {
    onFound(node.callee.property.name, node.loc?.start.line);
  }

  for (const key of Object.keys(node)) {
    if (key === 'loc' || key === 'start' || key === 'end' || key === 'type') continue;
    const child = node[key];
    if (Array.isArray(child)) {
      for (const item of child) {
        if (item && typeof item.type === 'string') {
          findNestedIterations(item, onFound);
        }
      }
    } else if (child && typeof child.type === 'string') {
      findNestedIterations(child, onFound);
    }
  }
}
