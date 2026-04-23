export interface AnalysisRun {
  id: string;
  date: string;
  project: string;
  efficiencyScore: number;
  issuesDetected: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any;
}

const PROJECTS_KEY = "refyne:projects";
const ANALYSES_KEY = "refyne:analyses";

export function getProjects(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(PROJECTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addProject(name: string): string[] {
  const projects = getProjects();
  if (!projects.includes(name)) {
    projects.push(name);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }
  return projects;
}

export function getAnalyses(): AnalysisRun[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ANALYSES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveAnalysis(run: AnalysisRun): void {
  const analyses = getAnalyses();
  analyses.unshift(run);
  localStorage.setItem(ANALYSES_KEY, JSON.stringify(analyses));
}

export function clearHistory(): void {
  localStorage.removeItem(ANALYSES_KEY);
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface DailyEfficiency {
  day: string;
  score: number;
}

export function getLast7DaysEfficiency(): DailyEfficiency[] {
  const analyses = getAnalyses();
  const now = new Date();
  const result: DailyEfficiency[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const dayRuns = analyses.filter((r) => {
      const t = new Date(r.date).getTime();
      return t >= dayStart.getTime() && t < dayEnd.getTime();
    });

    const avg =
      dayRuns.length > 0
        ? Math.round(
            dayRuns.reduce((sum, r) => sum + r.efficiencyScore, 0) / dayRuns.length
          )
        : 0;

    result.push({ day: DAY_LABELS[dayStart.getDay()], score: avg });
  }

  return result;
}