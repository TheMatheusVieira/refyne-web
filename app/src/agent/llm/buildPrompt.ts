// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildPrompt(data: any) {
  return `
Analise os seguintes problemas encontrados em um código frontend:

${JSON.stringify(data, null, 2)}

Responda em JSON com o seguinte formato:

{
  "summary": "resumo geral",
  "priorityFixes": ["correção 1", "correção 2"],
  "suggestions": ["melhoria 1", "melhoria 2"],
  "issueEnrichments": {
    "<issue.id>": {
      "explanation": "Explicação detalhada de por que esse problema é ruim e o que pode causar no código/app",
      "suggestion": "Sugestão concreta de como corrigir o problema com exemplo se possível",
      "benefit": "O que melhora após aplicar essa correção (performance, legibilidade, segurança, etc)"
    }
  }
}

Para cada issue encontrada, preencha "issueEnrichments" usando o "id" da issue como chave.
- "explanation": explique o impacto real do problema (ex: "Funções longas dificultam testes, aumentam bugs...")
- "suggestion": dê uma sugestão prática e acionável de correção
- "benefit": descreva o que o desenvolvedor ganha ao corrigir

Seja direto, técnico e objetivo. Responda em português.
`;
}