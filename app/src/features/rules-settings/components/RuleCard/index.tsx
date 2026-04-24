import { Card } from "@/app/src/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Severity } from "@/app/src/agent/types";
import { RuleDefinition } from "../../schemas/rules-registry";

interface RuleCardProps {
  rule: RuleDefinition;
  enabled: boolean;
  severity: Severity;
  onToggle: (ruleId: string, enabled: boolean) => void;
  onSeverityChange: (ruleId: string, severity: Severity) => void;
}

export function RuleCard({
  rule,
  enabled,
  severity,
  onToggle,
  onSeverityChange,
}: RuleCardProps) {
  return (
    <Card className="w-full bg-transparent rounded-none ring-0">
      <div className="flex flex-col pl-2">
        <div className="flex flex-col gap-1 mb-5">
          <span className="text-lg">{rule.name}</span>
          <p className="text-[#C1C6D7]">{rule.description}</p>
        </div>
        <div className="flex justify-between items-center">
          <Switch
            id={rule.id}
            checked={enabled}
            onCheckedChange={(checked) => onToggle(rule.id, !!checked)}
          />
          <select
            className="bg-[#1C2026] text-[#94A3B8] px-2 py-1 rounded flex justify-end ml-auto"
            value={severity}
            onChange={(e) =>
              onSeverityChange(rule.id, e.target.value as Severity)
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </Card>
  );
}
