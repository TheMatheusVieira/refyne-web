import { Category, Severity } from "@/app/src/agent/types";

export function buildRuleGenerationPrompt(input: {
  description: string;
  category: Category;
  severity: Severity;
}) {
  return `Você é um gerador de regras de análise estática para código frontend (React/TypeScript/JavaScript).

O usuário descreveu uma regra em linguagem natural. Gere o código JavaScript de uma função que analisa um AST (Babel) e retorna issues encontradas.

## Descrição do usuário:
"${input.description}"

## Categoria: ${input.category}
## Severidade: ${input.severity}

## Formato obrigatório da função:
A função recebe (ast, code) e retorna um array de issues.
- "ast" é o resultado de @babel/parser (Program node)
- "code" é o código fonte como string
- Use traverse(ast, { ... }) para percorrer o AST
- Cada issue deve ter: id, title, description, severity, category, line, suggestion, explanation, benefit, fix

## Exemplo de regra existente:
\`\`\`javascript
function rule(ast, code) {
  const issues = [];
  const lines = code.split('\\n');

  traverse(ast, {
    CallExpression(path) {
      if ('name' in path.node.callee && path.node.callee.name === 'eval') {
        const line = path.node.loc?.start.line;
        const sourceLine = line ? lines[line - 1]?.trim() : '';
        issues.push({
          id: \`no-eval-L\${line}\`,
          title: 'Uso de eval()',
          description: sourceLine,
          severity: 'high',
          category: 'security',
          line,
          suggestion: 'Substitua eval() por JSON.parse().',
          explanation: 'eval() executa qualquer string como código.',
          benefit: 'Elimina injeção de código.',
          fix: { description: 'Usar JSON.parse', code: sourceLine.replace(/eval\\((.+?)\\)/, 'JSON.parse($1)') }
        });
      }
    }
  });

  return issues;
}
\`\`\`

## REGRAS IMPORTANTES:
1. NÃO use import/export — a função será executada com eval e "traverse" será passado como variável do escopo
2. A função DEVE se chamar exatamente "rule"
3. A função DEVE receber (ast, code) como parâmetros
4. A categoria DEVE ser "${input.category}" e severity "${input.severity}"
5. O id de cada issue deve incluir o número da linha: \`custom-rule-L\${line}\`
6. Sempre extraia a sourceLine do código para mostrar ao usuário
7. Sempre forneça suggestion, explanation, benefit e fix
8. Textos em português brasileiro

## Responda APENAS com um JSON no formato:
{
  "name": "nome-da-regra-kebab-case",
  "title": "Título curto da regra",
  "description": "Descrição de 1-2 frases da regra para exibir na UI",
  "code": "function rule(ast, code) { ... }"
}

Responda SOMENTE o JSON, sem markdown, sem explicações.`;
}
