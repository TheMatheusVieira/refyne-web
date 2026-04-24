import { Severity } from "@/app/src/agent/types";
import { rulesRegistry } from "../schemas/rules-registry";

const STORAGE_KEY = "refyne-rules-settings";

export interface RuleSetting {
  enabled: boolean;
  severity: Severity;
}

export type RulesSettings = Record<string, RuleSetting>;

function getDefaultSettings(): RulesSettings {
  const settings: RulesSettings = {};
  for (const rule of rulesRegistry) {
    settings[rule.id] = {
      enabled: true,
      severity: rule.defaultSeverity,
    };
  }
  return settings;
}

export function loadRulesSettings(): RulesSettings {
  if (typeof window === "undefined") return getDefaultSettings();

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return getDefaultSettings();

  try {
    const saved: RulesSettings = JSON.parse(raw);
    const defaults = getDefaultSettings();

    // Merge: keep saved values but ensure new rules get defaults
    for (const id of Object.keys(defaults)) {
      if (!saved[id]) {
        saved[id] = defaults[id];
      }
    }

    return saved;
  } catch {
    return getDefaultSettings();
  }
}

export function saveRulesSettings(settings: RulesSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
