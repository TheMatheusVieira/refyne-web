"use client";

import { useState } from "react";
import { SidebarProvider } from "@/app/src/components/ui/sidebar";
import { AppSidebar } from "./src/components/app-sidebar";
import { Header } from "./src/components/header";
import { ChartRadialText } from "./src/components/radial-chart";
import { CodeEditor } from "./src/components/code-editor";
import { Button } from "@/app/src/components/ui/button";
import { Zap } from "lucide-react";
import { EmptyInfos } from "./src/components/empty-infos";
import { ProjectModal } from "./src/components/project-modal";
import { addProject, saveAnalysis } from "./src/features/history/services/storage";
import { saveResult } from "./src/features/results/services/storage";

import { useAnalyzeCode } from "./src/features/analyze-code/useAnalyzeCode";
import { ResultCard } from "./src/components/ResultCard";


export default function Home() {
  const [code, setCode] = useState("");
  const [projectName, setProjectName] = useState<string | null>(null);
  const { analyze, loading, result } = useAnalyzeCode();

  function handleSelectProject(name: string) {
    addProject(name);
    setProjectName(name);
  }

  async function handleAnalyze() {
    if (!projectName || !code.trim()) return;
    const start = performance.now();
    const res = await analyze(code);
    const durationMs = Math.round(performance.now() - start);
    if (res) {
      const totalIssues =
        (res.performance?.issues?.length ?? 0) +
        (res.security?.issues?.length ?? 0) +
        (res.cleanCode?.issues?.length ?? 0);

      const overallScore = Math.round(
          ((res.performance?.score ?? 0) +
            (res.security?.score ?? 0) +
            (res.cleanCode?.score ?? 0)) / 3
        );

      saveAnalysis({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        project: projectName,
        efficiencyScore: overallScore,
        issuesDetected: totalIssues,
        result: res,
      });

      saveResult({
        code,
        project: projectName,
        result: res,
        date: new Date().toISOString(),
        durationMs,
      });
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <SidebarProvider className="flex-1 min-h-0">
        <AppSidebar />
        <main className="flex flex-1 overflow-hidden bg-[#181C22] p-6 gap-6">
          <div className="relative flex-1 min-w-0 min-h-0">
            <ProjectModal open={!projectName} onConfirm={handleSelectProject} />
            <CodeEditor value={code} onChange={setCode} />
          </div>

            <div className="shrink-0 w-120 overflow-auto">
            <ChartRadialText
              score={
                result
                  ? Math.round(
                      ((result.performance?.score ?? 0) +
                        (result.security?.score ?? 0) +
                        (result.cleanCode?.score ?? 0)) / 3
                    )
                  : 0
              }
              description={
                result
                  ? `${(result.performance?.issues?.length ?? 0) + (result.security?.issues?.length ?? 0) + (result.cleanCode?.issues?.length ?? 0)} issue(s) found`
                  : undefined
              }
            />
            <div className="flex flex-col gap-4 mt-6">
            <h1 className="text-xl font-normal">
              Issue intelligence
            </h1>
            {/* cards */}
            {result ? (
              <>
               <ResultCard title="Performance" {...result.performance} />
          <ResultCard title="Segurança" {...result.security} />
          <ResultCard title="Clean Code" {...result.cleanCode} />
              </>
            ) : (
              <EmptyInfos />
            )}
            </div>
            <Button className="w-full mt-10 h-12 text-xl font-bold rounded-sm bg-[#9ECAFF] border-[#9ECAFF] text-[#003258] disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => handleAnalyze()}
            disabled={!code.trim() || loading}>
              <Zap className="size-5 mr-2" />
              {loading ? 'Analyzing...' : 'RUN DEEP ANALYSIS'}
            </Button>
            </div>

        </main>
      </SidebarProvider>
    </div>
  );
}
