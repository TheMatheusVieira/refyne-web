import traverse from '@babel/traverse';
import { Issue } from '../../../types';

const HEAVY_FUNCTIONS = [
  { pattern: 'JSON.parse', fix: 'useMemo(() => JSON.parse(data), [data])' },
  { pattern: 'JSON.stringify', fix: 'useMemo(() => JSON.stringify(data), [data])' },
  { pattern: 'structuredClone', fix: 'useMemo(() => structuredClone(data), [data])' },
];

const HEAVY_CONSTRUCTORS = ['RegExp', 'Date', 'Intl.DateTimeFormat', 'Intl.NumberFormat'];

// Rule 1/11/15: Heavy synchronous work in render path
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function heavyComputationRule(ast: any, code: string): Issue[] {
  const issues: Issue[] = [];
  const lines = code.split('\n');

  traverse(ast, {
    CallExpression(path) {
      // Skip if already inside useMemo/useCallback
      if (isInsideMemo(path)) return;
      // Only flag if inside a component (heuristic: inside a function that contains JSX)
      if (!isInsideComponentRender(path)) return;

      const callee = path.node.callee;
      let matchedPattern: string | null = null;
      let fixCode = '';

      // Check JSON.parse, JSON.stringify, etc.
      if (
        callee.type === 'MemberExpression' &&
        callee.object.type === 'Identifier' &&
        'name' in callee.property
      ) {
        const fullName = `${callee.object.name}.${callee.property.name}`;
        const match = HEAVY_FUNCTIONS.find(h => h.pattern === fullName);
        if (match) {
          matchedPattern = match.pattern;
          fixCode = match.fix;
        }
      }

      // Check new RegExp, new Date, etc. in render
      if (
        callee.type === 'Identifier' &&
        HEAVY_CONSTRUCTORS.includes(callee.name)
      ) {
        matchedPattern = callee.name;
        fixCode = `const cached = useMemo(() => new ${callee.name}(...), [])`;
      }

      if (!matchedPattern) return;

      const line = path.node.loc?.start.line;
      const sourceLine = line ? lines[line - 1]?.trim() : '';

      issues.push({
        id: `heavy-computation-L${line}`,
        title: `${matchedPattern}() no caminho de render`,
        description: sourceLine,
        severity: 'medium',
        category: 'performance',
        line,
        suggestion: `Mova para useMemo ou para fora do componente se não depende de estado/props.`,
        explanation: `${matchedPattern}() é uma operação síncrona pesada. Executar a cada render bloqueia a main thread e pode causar jank visível, especialmente com dados grandes.`,
        benefit: 'Memoizar ou mover para fora do render elimina trabalho redundante, mantendo a UI responsiva.',
        fix: {
          description: 'Memoizar computação pesada',
          code: fixCode,
        },
      });
    },

    NewExpression(path) {
      if (isInsideMemo(path)) return;
      if (!isInsideComponentRender(path)) return;

      const callee = path.node.callee;
      if (callee.type !== 'Identifier') return;
      if (!HEAVY_CONSTRUCTORS.includes(callee.name)) return;

      const line = path.node.loc?.start.line;
      const sourceLine = line ? lines[line - 1]?.trim() : '';

      issues.push({
        id: `heavy-constructor-L${line}`,
        title: `new ${callee.name}() no caminho de render`,
        description: sourceLine,
        severity: 'medium',
        category: 'performance',
        line,
        suggestion: `Instancie fora do componente ou use useMemo para cachear.`,
        explanation: `Criar new ${callee.name}() a cada render é trabalho síncrono repetido. Formatters (Intl) e RegExp são especialmente custosos.`,
        benefit: 'Instância cacheada evita criação repetida de objetos pesados.',
        fix: {
          description: 'Cachear instância',
          code: `const ${callee.name.toLowerCase()} = useMemo(\n  () => new ${callee.name}(...),\n  [] // deps estáveis\n);`,
        },
      });
    },
  });

  return issues;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isInsideMemo(path: any): boolean {
  let current = path.parentPath;
  while (current) {
    if (
      current.node?.type === 'CallExpression' &&
      current.node.callee?.type === 'Identifier' &&
      (current.node.callee.name === 'useMemo' || current.node.callee.name === 'useCallback')
    ) {
      return true;
    }
    current = current.parentPath;
  }
  return false;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isInsideComponentRender(path: any): boolean {
  let current = path.parentPath;
  while (current) {
    // If inside useEffect/useCallback/useMemo callback, not in render path
    if (
      current.node?.type === 'CallExpression' &&
      current.node.callee?.type === 'Identifier' &&
      ['useEffect', 'useLayoutEffect', 'useCallback', 'useMemo'].includes(current.node.callee.name)
    ) {
      return false;
    }
    current = current.parentPath;
  }
  return true;
}
