export async function callLLM(prompt: string) {
  const res = await fetch("/api/llm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "LLM request failed");
  }

  const data = await res.json();
  return data.content;
}