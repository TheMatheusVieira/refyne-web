"use client";

import { useEffect, useState } from "react";
import { getScoreColor } from "@/app/src/components/ResultCard";
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAnalyses, type AnalysisRun } from "@/app/src/features/history/services/storage";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 6;

export function TableDemo() {
  const [analyses, setAnalyses] = useState<AnalysisRun[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnalyses(getAnalyses());
  }, []);

  const totalPages = Math.max(1, Math.ceil(analyses.length / PAGE_SIZE));
  const pageData = analyses.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const emptyRows = PAGE_SIZE - pageData.length;

  return (
    <div>
    <Table>
      <TableHeader>
        <TableRow className="bg-[#1C2026]">
          <TableHead className="w-40 rounded-tl-sm font-normal text-[#8B90A0]">DATE / TIME</TableHead>
          <TableHead className="font-normal text-[#8B90A0]">PROJECT NAME</TableHead>
          <TableHead className="font-normal text-[#8B90A0]">EFFICIENCY SCORE</TableHead>
          <TableHead className="font-normal text-[#8B90A0]">ISSUES DETECTED</TableHead>
          <TableHead className="text-right rounded-tr-sm font-normal text-[#8B90A0]">ACTION</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pageData.map((run) => {
          const colors = getScoreColor(run.efficiencyScore);
          const formattedDate = new Date(run.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          const formattedTime = new Date(run.date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });

          const issueLabel = run.issuesDetected === 0
            ? "0 Issues"
            : run.issuesDetected === 1
              ? "1 Issue"
              : `${run.issuesDetected} Issues`;

          return (
            <TableRow key={run.id} className="bg-[#181C22] h-12">
              <TableCell className="font-medium flex flex-col gap-[0.5px]">
                {formattedDate}
                <span className="text-[#8B90A0] font-normal text-xs">
                  {formattedTime}
                  </span>
              </TableCell>
              <TableCell>{run.project}</TableCell>
              <TableCell className={colors.text}>
                <Progress
                  value={run.efficiencyScore}
                  className="w-18 h-2 items-center inline-block mr-2 bg-[#31353C] rounded-full"
                />
                {run.efficiencyScore}
              </TableCell>
              <TableCell className={colors.text}>
                <span className={`${colors.bg} p-1 rounded-sm`}>{issueLabel}</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                <Button
                 className="bg-[#31353C]/20 text-white rounded-sm"
                 onClick={() => {
                  if (confirm("Are you sure you want to delete this analysis run? This action cannot be undone.")) {
                    const updated = analyses.filter((a) => a.id !== run.id);
                    setAnalyses(updated);
                    localStorage.setItem("refyne:analyses", JSON.stringify(updated));
                    if (page > 0 && page * PAGE_SIZE >= updated.length) {
                      setPage(page - 1);
                    }
                  }
                  }}><Trash2/>
                  </Button>
                <Button className="bg-[#31353C] text-[#9ECAFF] border-[0.5px] border-[#9ECAFF] rounded-sm">
                  View Report
                </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
        {Array.from({ length: emptyRows }).map((_, i) => (
          <TableRow key={`empty-${i}`} className="bg-[#181C22] h-12">
            <TableCell colSpan={5}>&nbsp;</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    {totalPages > 1 && (
      <div className="flex items-center justify-center gap-3 mt-3">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="p-1.5 rounded-md bg-[#1C2026] text-[#8B90A0] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm text-[#8B90A0]">
          {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className="p-1.5 rounded-md bg-[#1C2026] text-[#8B90A0] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    )}
    </div>
  )
}
