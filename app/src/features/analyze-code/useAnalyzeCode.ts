import { useState } from 'react';
import { runAgent } from '../../agent/llm/runAgent';

export function useAnalyzeCode() {
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);

  async function analyze(code: string) {
    setLoading(true);

    try {
      const res = await runAgent(code);
      setResult(res);
      return res;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    analyze,
    loading,
    result,
  };
}