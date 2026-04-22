"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Header } from "./components/header";
import { ChartRadialText } from "./components/radial-chart";
import { CodeEditor } from "./components/code-editor";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { EmptyInfos } from "./components/empty-infos";

import { useAnalyzeCode } from "./src/features/analyze-code/useAnalyzeCode";
import { ResultCard } from "./src/components/ResultCard";


export default function Home() {
  const [code, setCode] = useState("");
  const { analyze, loading, result } = useAnalyzeCode();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <SidebarProvider className="flex-1 min-h-0">
        <AppSidebar />
        <main className="flex flex-1 overflow-hidden bg-[#181C22] p-6 gap-6">
          <div className="flex-1 min-w-0 min-h-0">
            <CodeEditor value={code} onChange={setCode} />
          </div>

            <div className="shrink-0 w-40px overflow-auto">
            <ChartRadialText
              score={result?.performance?.score ?? 0}
              description={
                result?.performance?.issues?.length
                  ? `${result.performance.issues.length} issue(s) found`
                  : undefined
              }
              issue={result?.performance?.issues?.[0]}
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
            onClick={() => analyze(code)}
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
