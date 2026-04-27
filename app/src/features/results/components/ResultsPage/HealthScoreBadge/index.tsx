import { Verified } from "lucide-react";

interface HealthScoreBadgeProps {
  score: number;
}

export function HealthScoreBadge({ score }: HealthScoreBadgeProps) {
  const color =
    score >= 80 ? "#00E475" : score >= 50 ? "#FFB3AE" : "#A90219";

  return (
    <div className="bg-[#181C22] p-4 rounded-md w-max mt-6 flex items-center gap-10">
      <div className="flex flex-col">
        <span className="text-[#8B90A0] text-sm">HEALTH SCORE</span>
        <h1 className="text-3xl font-bold" style={{ color }}>
          {score}%
        </h1>
      </div>
      <div
        className="border-4 p-2 rounded-lg"
        style={{ borderColor: color }}
      >
        <Verified style={{ color }} />
      </div>
    </div>
  );
}
