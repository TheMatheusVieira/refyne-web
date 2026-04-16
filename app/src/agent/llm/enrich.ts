import { buildPrompt } from "./buildPrompt";
import { callLLM } from "./client";
import { safeParse } from "./safeParse";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function enrichWithAI(data: any) {
  
    const prompt = buildPrompt(data);
    const res = await callLLM(prompt);
    const parsed = safeParse(res);

  return {
    ...data,
    ai: parsed,
  };
}