import traverse from '@babel/traverse';
import { Issue } from '../../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function noIndexKeyRule(ast: any): Issue[] {
  const issues: Issue[] = [];

  traverse(ast, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    JSXAttribute(path: any) {
      if (
        path.node.name.name === 'key' &&
        path.node.value?.type === 'JSXExpressionContainer'
      ) {
        const expr = path.node.value.expression;
        if (expr.type === 'Identifier' && (expr.name === 'index' || expr.name === 'i')) {
          issues.push({
            id: 'no-index-key',
            title: 'Uso de index como key',
            description: 'Usar index como key pode causar bugs em listas dinâmicas.',
            severity: 'medium',
            category: 'performance',
            line: path.node.loc?.start.line,
            suggestion: 'Use um identificador único (ex: item.id) como key em vez do index do array.',
            explanation: 'Quando itens são reordenados, adicionados ou removidos, o React usa a key para identificar cada elemento. Com index, o React pode reutilizar o DOM errado, causando bugs visuais e perda de estado.',
            benefit: 'Keys únicas permitem ao React rastrear cada item corretamente, evitando bugs de estado e melhorando a reconciliação do virtual DOM.',
          });
        }
      }
    },
  });

  return issues;
}
