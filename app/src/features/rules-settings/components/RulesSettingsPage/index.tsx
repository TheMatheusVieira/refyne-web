"use client";

import { useState } from "react";
import { AppSidebar } from "@/app/src/components/app-sidebar";
import { Header } from "@/app/src/components/header";
import { Card } from "@/app/src/components/ui/card";
import { Progress } from "@/app/src/components/ui/progress";
import { SidebarProvider } from "@/app/src/components/ui/sidebar";
import { BrushCleaning, Gauge, ShieldCheck } from "lucide-react";
import { Severity } from "@/app/src/agent/types";
import { getRulesByCategory } from "../../schemas/rules-registry";
import {
  loadRulesSettings,
  saveRulesSettings,
  RulesSettings,
} from "../../services/storage";
import { rulesRegistry } from "../../schemas/rules-registry";
import { RuleSection } from "../RuleSection";

const performanceRules = getRulesByCategory("performance");
const cleanCodeRules = getRulesByCategory("clean-code");
const securityRules = getRulesByCategory("security");

export default function RulesSettingsPage() {
  const [settings, setSettings] = useState<RulesSettings>(() =>
    loadRulesSettings()
  );

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

  const totalRules = rulesRegistry.length;
  const activeRules = Object.values(settings).filter((s) => s.enabled).length;
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
            />

            <RuleSection
              icon={BrushCleaning}
              title="Clean Code"
              category="clean-code"
              rules={cleanCodeRules}
              settings={settings}
              onToggle={handleToggle}
              onSeverityChange={handleSeverityChange}
            />

            <RuleSection
              icon={ShieldCheck}
              title="Security"
              category="security"
              rules={securityRules}
              settings={settings}
              onToggle={handleToggle}
              onSeverityChange={handleSeverityChange}
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
              </div>
            </div>
          </Card>
        </div>
      </SidebarProvider>
    </div>
  );
}
