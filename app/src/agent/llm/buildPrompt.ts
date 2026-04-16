// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildPrompt(data: any) {
  return `
Analise os seguintes problemas encontrados em um código frontend:

${JSON.stringify(data, null, 2)}

Responda em JSON com o seguinte formato:

{
  "summary": "resumo geral",
  "priorityFixes": ["correção 1", "correção 2"],
  "suggestions": ["melhoria 1", "melhoria 2"]
}

Seja direto, técnico e objetivo.
`;
}