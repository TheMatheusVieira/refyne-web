import { CodeEditor } from "@/app/src/components/code-editor";
import { Button } from "@/app/src/components/ui/button";
import type { Issue } from "@/app/src/agent/types";
import { getIssueActions, setIssueAction, type IssueAction } from "@/app/src/features/results/services/storage";
import { Stars, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

const severityColors: Record<string, { bar: string; bg: string; border: string; text: string; label: string }> = {
  high: { bar: "bg-red-500", bg: "bg-[#A90219]/20", border: "border-[#A90219]/30", text: "text-[#A90219]", label: "HIGH SEVERITY" },
  medium: { bar: "bg-[#FFB3AE]", bg: "bg-[#FFB3AE]/20", border: "border-[#FFB3AE]/30", text: "text-[#FFB3AE]", label: "MEDIUM SEVERITY" },
  low: { bar: "bg-green-500", bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400", label: "LOW SEVERITY" },
};

function extractLine(source: string, line?: number): string {
  if (!line || !source) return "";
  const lines = source.split("\n");
  const idx = line - 1;
  if (idx < 0 || idx >= lines.length) return "";
  return `${line}  ${lines[idx]}`;
}

interface IssueCardProps {
  issue: Issue;
  sourceCode: string;
}

export function IssueCard({ issue, sourceCode }: IssueCardProps) {
  const [action, setAction] = useState<IssueAction | null>(() => {
    const saved = getIssueActions();
    return saved[issue.id] ?? null;
  });
  const style = severityColors[issue.severity] ?? severityColors.low;

  const originalCode = extractLine(sourceCode, issue.line);
  const fixCode = issue.fix?.code ?? issue.suggestion ?? "";

  function handleIgnore() {
    setIssueAction(issue.id, "ignored");
    setAction("ignored");
  }

  function handleApply() {
    setIssueAction(issue.id, "applied");
    setAction("applied");
  }

  const isResolved = action !== null;

  return (
    <div className={`flex flex-row bg-[#181C22] rounded-sm transition-opacity ${isResolved ? "opacity-60" : ""}`}>
      <span className={`${style.bar} w-2 rounded-l-sm shrink-0`} />

      <div className="flex flex-col p-4 w-full">
        <div className="flex flex-row justify-between items-start">
          <div>
            <h2 className="text-2xl font-medium mb-2">{issue.title}</h2>
            <p className="text-sm text-[#8B90A0] mb-4 uppercase">
              {issue.category}
            </p>
          </div>

          <div className={`${style.bg} p-2 w-40 flex items-center justify-center border ${style.border} rounded-sm`}>
            <span className={`${style.text} font-bold text-sm`}>{style.label}</span>
          </div>
        </div>

        <p className="text-[#C1C6D7]">
          {issue.explanation ?? issue.description}
        </p>

        <div className="flex flex-row justify-between gap-10">
          <div className="w-full">
            <label className="block text-sm font-medium mt-8 mb-4 text-[#8B90A0]">
              {issue.line ? `FOUND AT LINE ${issue.line}` : "ORIGINAL CODE"}
            </label>
            <div className="h-22">
              <CodeEditor value={originalCode} onChange={() => {}} />
            </div>
          </div>

          <div className="w-full">
            <div className="flex flex-row items-center gap-2 mt-8 mb-4">
              <Stars className="text-[#00E475]" size={16} />
              <label className="block text-sm font-medium text-[#00E475]">RECOMMENDED FIX</label>
            </div>
            <div className="h-22">
              <CodeEditor value={fixCode} onChange={() => {}} />
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4 mt-6 pb-2 justify-end items-center">
          {action === "ignored" && (
            <span className="flex items-center gap-1 text-sm text-[#8B90A0]">
              <XCircle size={14} /> Ignored
            </span>
          )}
          {action === "applied" && (
            <span className="flex items-center gap-1 text-sm text-[#00E475]">
              <CheckCircle size={14} /> Fix Applied
            </span>
          )}
          {!isResolved && (
            <>
              <Button
                className="h-10 text-sm font-medium rounded-sm bg-transparent text-[#8B90A0] border hover:bg-[#8B90A0]/10"
                onClick={handleIgnore}
              >
                Ignore Issue
              </Button>
              <Button
                className="h-10 text-sm font-medium rounded-md bg-linear-to-r from-[#9ECAFF] to-[#1E95F2] text-[#002B4D] hover:bg-[#9ECAFF]/80 hover:cursor-pointer"
                onClick={handleApply}
              >
                Apply Hotfix
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
