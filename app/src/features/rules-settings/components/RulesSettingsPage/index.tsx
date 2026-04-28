"use client";

import { useState } from "react";
import { AppSidebar } from "@/app/src/components/app-sidebar";
import { Header } from "@/app/src/components/header";
import { Card } from "@/app/src/components/ui/card";
import { Progress } from "@/app/src/components/ui/progress";
import { SidebarProvider } from "@/app/src/components/ui/sidebar";
import { BrushCleaning, Gauge, ShieldCheck, Sparkles, Plus } from "lucide-react";
import { Button } from "@/app/src/components/ui/button";
import { Severity } from "@/app/src/agent/types";
import { getRulesByCategory } from "../../schemas/rules-registry";
import {
  loadRulesSettings,
  saveRulesSettings,
  RulesSettings,
} from "../../services/storage";
import {
  loadCustomRules,
  saveCustomRules,
  removeCustomRule,
  CustomRule,
} from "../../services/custom-rules-storage";
import { rulesRegistry } from "../../schemas/rules-registry";
import { RuleSection } from "../RuleSection";
import { AddRuleModal } from "../AddRuleModal";

const performanceRules = getRulesByCategory("performance");
const cleanCodeRules = getRulesByCategory("clean-code");
const securityRules = getRulesByCategory("security");

export default function RulesSettingsPage() {
  const [settings, setSettings] = useState<RulesSettings>(() =>
    loadRulesSettings()
  );
  const [customRules, setCustomRules] = useState<CustomRule[]>(() => {
    if (typeof window === "undefined") return [];
    return loadCustomRules();
  });
  const [addModalOpen, setAddModalOpen] = useState(false);

  function handleToggle(ruleId: string, enabled: boolean) {
    setSettings((prev) => {
      const next = { ...prev, [ruleId]: { ...prev[ruleId], enabled } };
      saveRulesSettings(next);
      return next;
    });
  }

  function handleSeverityChange(ruleId: string, severity: Severity) {
    setSettings((prev) => {
      const next = { ...prev, [ruleId]: { ...prev[ruleId], severity } };
      saveRulesSettings(next);
      return next;
    });
  }

  function handleCustomToggle(id: string, enabled: boolean) {
    setCustomRules((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, enabled } : r));
      saveCustomRules(next);
      return next;
    });
  }

  function handleCustomRemove(id: string) {
    removeCustomRule(id);
    setCustomRules((prev) => prev.filter((r) => r.id !== id));
  }

  function handleRuleCreated(rule: CustomRule) {
    setCustomRules((prev) => [...prev, rule]);
  }

  const customByCategory = (cat: string) =>
    customRules.filter((r) => r.category === cat);

  const totalRules = rulesRegistry.length + customRules.length;
  const activeBuiltIn = Object.values(settings).filter((s) => s.enabled).length;
  const activeCustom = customRules.filter((r) => r.enabled).length;
  const activeRules = activeBuiltIn + activeCustom;
  const activePercent = totalRules > 0 ? Math.round((activeRules / totalRules) * 100) : 0;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <SidebarProvider className="flex-1 min-h-0">
        <AppSidebar />
        <main className="flex flex-1 overflow-hidden bg-[#10141A] p-6 gap-6">
          <div className="flex-1 overflow-auto min-w-0 flex flex-col mb-12">
            <div className="flex flex-col gap-2 w-full mb-10">
              <span className="text-[#00E475]">CONFIGURATION ENGINE</span>
              <h1 className="text-4xl font-medium ml-0">Analysis Rules</h1>
              <p className="text-[#C1C6D7]">Configure the tactical boundaries of your codebase. Select which patterns the<br/>
                engine should flag and define the urgency of each detection.</p>
            </div>

            <RuleSection
              icon={Gauge}
              title="Performance"
              category="performance"
              rules={performanceRules}
              settings={settings}
              onToggle={handleToggle}
              onSeverityChange={handleSeverityChange}
              customRules={customByCategory("performance")}
              onCustomToggle={handleCustomToggle}
              onCustomRemove={handleCustomRemove}
            />

            <RuleSection
              icon={BrushCleaning}
              title="Clean Code"
              category="clean-code"
              rules={cleanCodeRules}
              settings={settings}
              onToggle={handleToggle}
              onSeverityChange={handleSeverityChange}
              customRules={customByCategory("clean-code")}
              onCustomToggle={handleCustomToggle}
              onCustomRemove={handleCustomRemove}
            />

            <RuleSection
              icon={ShieldCheck}
              title="Security"
              category="security"
              rules={securityRules}
              settings={settings}
              onToggle={handleToggle}
              onSeverityChange={handleSeverityChange}
              customRules={customByCategory("security")}
              onCustomToggle={handleCustomToggle}
              onCustomRemove={handleCustomRemove}
            />

          </div>
        </main>
        <div className="bg-[#181C22] p-6 border-t border-[#282C34]">
          <span className="text-[#94A3B8]">RULE SUMMARY</span>
          <Card className="mt-4 p-4 bg-[#0A0E14] border-[#282C34] rounded-sm w-80">
            <div className="flex flex-row gap-4">
              <div className="flex flex-col w-full gap-2">
                <div className="flex flex-row items-center justify-between">
                <span>Active rules</span>
                <span className="text-2xl font-medium">{activeRules}</span>
                </div>
                <Progress value={activePercent} className="w-full" />
                {customRules.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Sparkles className="h-3 w-3 text-[#00E475]" />
                    <span className="text-xs text-[#4A4F5C]">
                      {customRules.length} custom rule{customRules.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
          <Button
            className="mt-4 w-80 h-10 bg-[#00E475] text-[#0A0E14] font-bold hover:bg-[#00E475]/90"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Rule
          </Button>
        </div>
      </SidebarProvider>
      <AddRuleModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onRuleCreated={handleRuleCreated}
      />
    </div>
  );
}
