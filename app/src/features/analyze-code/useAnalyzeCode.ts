import { useState } from 'react';
import { runAgent } from '../../agent/llm/runAgent';
import { loadRulesSettings } from '../rules-settings/services/storage';
import { loadCustomRules } from '../rules-settings/services/custom-rules-storage';

export function useAnalyzeCode() {
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);

  async function analyze(code: string) {
    setLoading(true);

    try {
      // Load enabled rules from settings
      const settings = loadRulesSettings();
      const enabledRules = new Set(
        Object.entries(settings)
          .filter(([, s]) => s.enabled)
          .map(([id]) => id)
      );

      // Load custom rules
      const customRules = loadCustomRules();

      const res = await runAgent(code, enabledRules, customRules);
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