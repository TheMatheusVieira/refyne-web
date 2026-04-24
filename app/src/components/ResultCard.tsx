import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/src/components/ui/alert-dialog";
import {
  AlertCircle,
  ChevronRight,
  Lightbulb,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function getScoreColor(score: number) {
  if (score >= 80) return { text: "text-emerald-400", bg: "bg-emerald-400/10", fill: "text-emerald-400" };
  if (score >= 50) return { text: "text-yellow-400", bg: "bg-yellow-400/10", fill: "text-yellow-400" };
  return { text: "text-red-400", bg: "bg-red-400/10", fill: "text-red-400" };
}

export function ResultCard({ title, issues, score }: any) {
  const hasIssues = issues && issues.length > 0;
  const colors = getScoreColor(score);

  return (
    <div className="bg-[#0A0E14] rounded-md p-4 mb-3 flex flex-row items-center gap-4">
      <div className={`rounded-full w-10 h-10 justify-center flex items-center ${colors.bg}`}>
        <AlertCircle className={`size-6 ${colors.fill}`} />
      </div>
      <div>
        <h3 className="text-xl font-normal">{title}</h3>
        <p className={`text-md font-medium ${colors.text}`}>Score: {score}</p>
        {hasIssues && (
          <p className={`text-sm font-medium ${colors.text}`}>
            {issues
              .filter(
                (issue: any, index: number, arr: any[]) =>
                  arr.findIndex((i: any) => i.title === issue.title) === index,
              )
              .map((issue: any) => issue.title)
              .join(", ")}
          </p>
        )}
      </div>

      {hasIssues ? (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="ml-auto text-sm text-white hover:underline">
            <ChevronRight />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#0A0E14] border border-white/5 rounded-md min-w-2xl max-w-2xl max-h-[50vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">
              {title} — Análise detalhada
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="flex flex-col gap-5 mt-2">
                {issues.map((issue: any) => (
                  <div
                    key={issue.id}
                    className="rounded-lg border border-white/5 bg-[#0e121a] p-4 flex flex-col gap-3"
                  >
                    {/* Header da issue */}
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-white">
                        {issue.title}
                      </h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          issue.severity === "high"
                            ? "bg-red-500/20 text-red-400"
                            : issue.severity === "medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {issue.severity}
                      </span>
                    </div>

                    {issue.line && (
                      <p className="text-xs text-gray-600">
                        Linha {issue.line}
                      </p>
                    )}

                    {/* Descrição */}
                    <p className="text-sm text-gray-400">{issue.description}</p>

                    {/* Explicação do impacto */}
                    {issue.explanation && (
                      <div className="flex gap-2 items-start rounded-md bg-red-500/5 border border-red-500/10 p-3">
                        <ShieldAlert className="size-4 text-red-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-red-400 mb-1">
                            Por que isso é um problema?
                          </p>
                          <p className="text-sm text-gray-400">
                            {issue.explanation}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Sugestão */}
                    {issue.suggestion && (
                      <div className="flex gap-2 items-start rounded-md bg-yellow-500/5 border border-yellow-500/10 p-3">
                        <Lightbulb className="size-4 text-yellow-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-yellow-400 mb-1">
                            Como corrigir?
                          </p>
                          <p className="text-sm text-gray-400">
                            {issue.suggestion}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Benefício */}
                    {issue.benefit && (
                      <div className="flex gap-2 items-start rounded-md bg-emerald-500/5 border border-emerald-500/10 p-3">
                        <Sparkles className="size-4 text-emerald-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-emerald-400 mb-1">
                            Após a correção
                          </p>
                          <p className="text-sm text-gray-400">
                            {issue.benefit}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="justify-end bg-[#0e121a]">
            <AlertDialogCancel className="rounded-sm">Fechar</AlertDialogCancel>
            <AlertDialogAction className="rounded-sm">
              Entendi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      ) : (
        <div className="ml-auto">
          <ChevronRight className="text-gray-700" />
        </div>
      )}
    </div>
  );
}

{
  /* 
      <h3 className="text-lg font-medium">{title}</h3>
      <p>Score: {score}</p>

      {issues.map((issue: any) => (
        
        <div className="flex flex-row items-center gap-2" key={issue.id}>
      
                <AlertCircle className="size-4 text-gray-500" />
    
          <strong>{issue.title}</strong>
          <p>{issue.description}</p>
        </div>
      ))} */
}
