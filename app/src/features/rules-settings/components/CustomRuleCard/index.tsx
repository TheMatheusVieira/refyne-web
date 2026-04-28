import { Switch } from "@/components/ui/switch";
import { CustomRule } from "../../services/custom-rules-storage";
import { Trash2, Sparkles } from "lucide-react";

interface CustomRuleCardProps {
  rule: CustomRule;
  onToggle: (id: string, enabled: boolean) => void;
  onRemove: (id: string) => void;
}

export function CustomRuleCard({ rule, onToggle, onRemove }: CustomRuleCardProps) {
  const severityColors: Record<string, string> = {
    low: "text-[#94A3B8]",
    medium: "text-[#FACC15]",
    high: "text-[#F87171]",
  };

  return (
    <div className="w-full bg-transparent border-b border-[#282C34] px-2 py-4">
      <div className="flex flex-col pl-2">
        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#00E475]" />
            <span className="text-lg">{rule.name}</span>
            <span className={`text-xs uppercase font-medium ${severityColors[rule.severity] ?? "text-[#94A3B8]"}`}>
              {rule.severity}
            </span>
          </div>
          <p className="text-[#C1C6D7] text-sm">{rule.description}</p>
          <p className="text-[#4A4F5C] text-xs italic mt-1">
            Prompt: &ldquo;{rule.prompt}&rdquo;
          </p>
        </div>
        <div className="flex justify-between items-center">
          <Switch
            id={rule.id}
            checked={rule.enabled}
            onCheckedChange={(checked) => onToggle(rule.id, !!checked)}
          />
          <button
            onClick={() => onRemove(rule.id)}
            className="text-[#4A4F5C] hover:text-[#F87171] transition-colors p-1"
            title="Remover regra"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
