export function safeParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return {
      summary: text,
      priorityFixes: [],
      suggestions: [],
    };
  }
}