import { buildPrompt } from "./buildPrompt";
import { callLLM } from "./client";
import { safeParse } from "./safeParse";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function enrichWithAI(data: any) {
  
    const prompt = buildPrompt(data);
    const res = await callLLM(prompt);
    const parsed = safeParse(res);

  // Merge enrichments into individual issues
  const enrichments = parsed?.issueEnrichments ?? {};
  const enriched = { ...data };

  for (const key of ['performance', 'security', 'cleanCode'] as const) {
    if (enriched[key]?.issues) {
      enriched[key] = {
        ...enriched[key],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        issues: enriched[key].issues.map((issue: any) => {
          const e = enrichments[issue.id];
          if (!e) return issue;
          return {
            ...issue,
            explanation: e.explanation ?? issue.explanation,
            suggestion: e.suggestion ?? issue.suggestion,
            benefit: e.benefit ?? issue.benefit,
          };
        }),
      };
    }
  }

  return {
    ...enriched,
    ai: parsed,
  };
}