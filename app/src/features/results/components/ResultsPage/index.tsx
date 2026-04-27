"use client";

import { AppSidebar } from "@/app/src/components/app-sidebar";
import { Header } from "@/app/src/components/header";
import { SidebarProvider } from "@/app/src/components/ui/sidebar";
import type { Issue } from "@/app/src/agent/types";
import { getResult, type StoredResult } from "@/app/src/features/results/services/storage";
import { useEffect, useMemo, useState } from "react";
import { HealthScoreBadge } from "./HealthScoreBadge";
import { IssueTabs } from "./IssueTabs";
import { IssueCard } from "./IssueCard";

type Filter = "all" | "high" | "medium" | "low";

function useStoredResult() {
  const [stored, setStored] = useState<StoredResult | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStored(getResult());
  }, []);
  return stored;
}

export default function ResultsPage() {
  const stored = useStoredResult();
  const [filter, setFilter] = useState<Filter>("all");

  const allIssues = useMemo<Issue[]>(() => {
    if (!stored?.result) return [];
    const r = stored.result;
    return [
      ...(r.performance?.issues ?? []),
      ...(r.security?.issues ?? []),
      ...(r.cleanCode?.issues ?? []),
    ];
  }, [stored]);

  const filteredIssues = useMemo(
    () => (filter === "all" ? allIssues : allIssues.filter((i) => i.severity === filter)),
    [allIssues, filter],
  );

  const overallScore = useMemo(() => {
    if (!stored?.result) return 0;
    const r = stored.result;
    const scores = [r.performance?.score, r.security?.score, r.cleanCode?.score].filter(
      (s): s is number => s != null,
    );
    return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  }, [stored]);

  const durationLabel = stored?.durationMs
    ? `${(stored.durationMs / 1000).toFixed(1)}s`
    : "–";

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <SidebarProvider className="flex-1 min-h-0">
        <AppSidebar />
        <main className="flex flex-1 overflow-hidden bg-[#10141A] p-6 gap-6">
          <div className="flex-1 overflow-auto min-w-0 flex flex-col mb-12">
            {!stored ? (
              <div className="flex flex-col items-center justify-center flex-1 text-[#8B90A0]">
                <p className="text-xl">No analysis results yet.</p>
                <p className="text-sm mt-2">Run an analysis from the home page first.</p>
              </div>
            ) : (
              <>
               
                  <div className="w-full flex flex-row justify-between items-start">
                     <div className="flex flex-col gap-2 mb-10">
                  <h1 className="text-4xl font-medium ml-0">Analysis results</h1>
                  <span className="text-[#C1C6D7]">
                    Deep scan completed in {durationLabel}. Found {allIssues.length} potential optimizations and vulnerabilities.
                  </span>
                    </div>
                   <HealthScoreBadge score={overallScore} />
                </div>

                <IssueTabs
                  issues={allIssues}
                  activeFilter={filter}
                  onFilterChange={setFilter}
                />

                <div className="flex flex-col gap-4">
                  {filteredIssues.length === 0 ? (
                    <p className="text-[#8B90A0] mt-4">No issues found for this filter.</p>
                  ) : (
                    filteredIssues.map((issue, index) => (
                      <IssueCard key={`${issue.id}-${index}`} issue={issue} sourceCode={stored.code} />
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
