import type { Issue } from "@/app/src/agent/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Filter = "all" | "high" | "medium" | "low";

interface IssueTabsProps {
  issues: Issue[];
  activeFilter: Filter;
  onFilterChange: (filter: Filter) => void;
}

export function IssueTabs({ issues, activeFilter, onFilterChange }: IssueTabsProps) {
  const highCount = issues.filter((i) => i.severity === "high").length;
  const mediumCount = issues.filter((i) => i.severity === "medium").length;
  const lowCount = issues.filter((i) => i.severity === "low").length;

  return (
    <Tabs value={activeFilter} onValueChange={(v) => onFilterChange(v as Filter)} className="w-full mt-6">
      <TabsList className="bg-[#0A0E14] p-1 w-max mb-4">
        <TabsTrigger value="all" className="data-[state=active]:bg-[#00E475] text-[#94A3B8] px-3 py-1 rounded-md">
          All issues ({issues.length})
        </TabsTrigger>
        <TabsTrigger value="high" className="data-[state=active]:bg-[#00E475] text-[#94A3B8] px-3 py-1 rounded-md">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          High ({highCount})
        </TabsTrigger>
        <TabsTrigger value="medium" className="data-[state=active]:bg-[#00E475] text-[#94A3B8] px-3 py-1 rounded-md">
          <span className="h-2 w-2 rounded-full bg-[#FFB3AE]" />
          Medium ({mediumCount})
        </TabsTrigger>
        <TabsTrigger value="low" className="data-[state=active]:bg-[#00E475] text-[#94A3B8] px-3 py-1 rounded-md">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Low ({lowCount})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
