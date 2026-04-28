import { ScrollArea } from "@/components/ui/scroll-area";
import { Category, Severity } from "@/app/src/agent/types";
import { RuleDefinition } from "../../schemas/rules-registry";
import { RuleSetting } from "../../services/storage";
import { CustomRule } from "../../services/custom-rules-storage";
import { RuleCard } from "../RuleCard";
import { CustomRuleCard } from "../CustomRuleCard";
import { LucideIcon } from "lucide-react";

interface RuleSectionProps {
  icon: LucideIcon;
  title: string;
  category: Category;
  rules: RuleDefinition[];
  settings: Record<string, RuleSetting>;
  onToggle: (ruleId: string, enabled: boolean) => void;
  onSeverityChange: (ruleId: string, severity: Severity) => void;
  customRules?: CustomRule[];
  onCustomToggle?: (id: string, enabled: boolean) => void;
  onCustomRemove?: (id: string) => void;
}

export function RuleSection({
  icon: Icon,
  title,
  rules,
  settings,
  onToggle,
  onSeverityChange,
  customRules = [],
  onCustomToggle,
  onCustomRemove,
}: RuleSectionProps) {
  const activeBuiltIn = rules.filter((r) => settings[r.id]?.enabled).length;
  const activeCustom = customRules.filter((r) => r.enabled).length;
  const activeCount = activeBuiltIn + activeCustom;

  return (
    <section className="flex-1 min-h-0 flex flex-col mb-8">
      <div className="flex flex-row gap-2 items-center mb-4 border-b border-[#282C34] pb-2">
        <Icon className="text-[#9ECAFF]" />
        <h1 className="text-2xl font-medium">{title}</h1>
        <div className="ml-auto flex justify-center">
          <span className="bg-[#1C2026] text-[#94A3B8] font-light p-1 text-sm items-center rounded-sm">
            {activeCount} RULES ACTIVE
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0 border border-[#282C34] rounded-md">
        {rules.map((rule) => (
          <RuleCard
            key={rule.id}
            rule={rule}
            enabled={settings[rule.id]?.enabled ?? true}
            severity={settings[rule.id]?.severity ?? rule.defaultSeverity}
            onToggle={onToggle}
            onSeverityChange={onSeverityChange}
          />
        ))}
        {customRules.map((rule) => (
          <CustomRuleCard
            key={rule.id}
            rule={rule}
            onToggle={onCustomToggle!}
            onRemove={onCustomRemove!}
          />
        ))}
      </ScrollArea>
    </section>
  );
}
