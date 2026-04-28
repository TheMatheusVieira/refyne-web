/* eslint-disable @typescript-eslint/no-explicit-any */
import traverse from '@babel/traverse';
import { Issue } from '../../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function missingMemoRule(ast: any, code: string): Issue[] {
  const issues: Issue[] = [];
  const lines = code.split('\n');

  function isInsideReactComponent(path: any): boolean {
    let current = path;

    while (current) {
      if (
        current.isFunctionDeclaration() ||
        current.isArrowFunctionExpression()
      ) {
        const body = current.node.body;
        if (body && JSON.stringify(body).includes('JSXElement')) {
          return true;
        }
      }

      current = current.parentPath;
    }

    return false;
  }

  function returnsJSX(mapCallback: any): boolean {
    if (!mapCallback) return false;

    if (mapCallback.body?.type === 'JSXElement') return true;

    if (mapCallback.body?.type === 'BlockStatement') {
      return mapCallback.body.body.some(
        (stmt: any) =>
          stmt.type === 'ReturnStatement' &&
          stmt.argument &&
          stmt.argument.type === 'JSXElement'
      );
    }

    return false;
  }

  function isTrivialArray(node: any): boolean {
    return node.type === 'ArrayExpression';
  }

  function isAlreadyMemoized(path: any): boolean {
    let current = path.parentPath;

    while (current) {
      if (
        current.node?.type === 'CallExpression' &&
        current.node.callee?.name === 'useMemo'
      ) {
        return true;
      }
      current = current.parentPath;
    }

    return false;
  }

  function estimateComplexity(node: any): number {
    if (!node || typeof node !== 'object') return 0;
    let score = 0;

    if (node.type === 'JSXElement') score += 10;
    if (node.type === 'CallExpression') score += 5;
    if (node.type === 'ConditionalExpression') score += 3;
    if (node.type === 'LogicalExpression') score += 2;

    for (const key of Object.keys(node)) {
      if (key === 'loc' || key === 'start' || key === 'end') continue;
      const child = node[key];
      if (Array.isArray(child)) {
        for (const item of child) {
          if (item && typeof item.type === 'string') {
            score += estimateComplexity(item);
          }
        }
      } else if (child && typeof child.type === 'string') {
        score += estimateComplexity(child);
      }
    }

    return score;
  }

  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;

      if (
        callee.type === 'MemberExpression' &&
        'name' in callee.property &&
        callee.property.name === 'map'
      ) {
        const mapCallback = path.node.arguments[0];
        const arraySource = callee.object;

        const insideReact = isInsideReactComponent(path);
        const jsxReturn = returnsJSX(mapCallback);
        const trivial = isTrivialArray(arraySource);
        const memoized = isAlreadyMemoized(path);
        const complexity = estimateComplexity(mapCallback);

        let score = 0;

        if (insideReact) score += 20;
        if (jsxReturn) score += 30;
        if (!trivial) score += 20;
        if (!memoized) score += 20;
        if (complexity > 15) score += 10;

        // Só alerta se realmente suspeito
        if (score >= 60) {
          const line = path.node.loc?.start.line;
          const sourceLine = line ? lines[line - 1]?.trim() : '';

          const objName =
            arraySource.type === 'Identifier'
              ? arraySource.name
              : 'data';

          issues.push({
            id: `expensive-map-L${line}`,
            title: 'Map potencialmente custoso sem otimização',
            description: sourceLine,
            severity: score > 75 ? 'high' : 'medium',
            category: 'performance',
            line,

            suggestion:
              'Considere memoizar o resultado com useMemo ou reduzir re-renders do componente pai.',

            explanation:
              'Este .map() está dentro de um componente React, retorna JSX e pode ser executado a cada render. Dependendo do tamanho da lista e frequência de renderização, isso pode gerar custo desnecessário.',

            benefit:
              'Reduz renderizações repetidas, melhora tempo de resposta da UI e evita trabalho redundante.',

            fix: {
              description: 'Memoizar resultado do map (se aplicável)',
              code: `const memoizedList = useMemo(() => 
  ${objName}.map((item) => (
    // render item
  )),
  [${objName}]
);`,
            },
          });
        }
      }
    },
  });

  return issues;
}