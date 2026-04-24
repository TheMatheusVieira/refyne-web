"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/src/components/ui/button";
import { Input } from "@/app/src/components/ui/input";
import { FolderOpen, Plus, ArrowLeft } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/src/components/ui/select";
import { getProjects, addProject } from "@/app/src/features/history/services/storage";

interface ProjectModalProps {
  open: boolean;
  onConfirm: (projectName: string) => void;
}

export function ProjectModal({ open, onConfirm }: ProjectModalProps) {
  const [view, setView] = useState<"select" | "create">("select");
  const [selected, setSelected] = useState("");
  const [newName, setNewName] = useState("");
  const [projects, setProjects] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProjects(getProjects());
    }
  }, [open]);

  function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    const updated = addProject(name);
    setProjects(updated);
    onConfirm(name);
  }

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg">
      <div className="w-full max-w-sm rounded-lg bg-[#1C2026] border border-white/10 p-6 shadow-2xl">
        <div className="flex flex-col items-center gap-2 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9ECAFF]/10">
            <FolderOpen className="h-5 w-5 text-[#9ECAFF]" />
          </div>
          <h2 className="text-lg font-bold text-white">
            {view === "select" ? "Select project" : "New project"}
          </h2>
          <p className="text-xs text-[#8B90A0] text-center">
            {view === "select"
              ? "Choose a project to start your analysis."
              : "Enter the name for your new project."}
          </p>
        </div>

        {view === "select" ? (
          <>
            <label className="text-sm font-medium text-[#8B90A0] mb-1 block">
              Project
            </label>
            <div className="mb-4">
              {projects.length > 0 ? (
              <Select value={selected} onValueChange={setSelected}>
                <SelectTrigger className="w-full h-10 bg-[#0A0E14] border-white/10 text-white">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent className="bg-[#1C2026] border-white/10">
                  {projects.map((proj) => (
                    <SelectItem key={proj} value={proj} className="text-white focus:bg-white/10 focus:text-white">
                      {proj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              ) : (
                <p className="text-sm text-[#8B90A0] text-center py-3">No projects yet. Create one below.</p>
              )}
            </div>

            <Button
              onClick={() => onConfirm(selected)}
              disabled={!selected}
              className="w-full h-10 text-sm font-bold rounded-sm bg-[#9ECAFF] border-[#9ECAFF] text-[#003258] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Start analysis
            </Button>

            <button
              onClick={() => setView("create")}
              className="w-full mt-3 flex items-center justify-center gap-1.5 text-xs text-[#8B90A0] hover:text-white transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Register new project
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setView("select")}
              className="flex items-center gap-1 text-xs text-[#8B90A0] hover:text-white transition-colors mb-3"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to select
            </button>

            <label className="text-sm font-medium text-[#8B90A0] mb-1 block">
              Project name
            </label>
            <Input
              autoFocus
              placeholder="e.g. my-new-app"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newName.trim()) {
                  handleCreate();
                }
              }}
              className="mb-4 h-10 bg-[#0A0E14] border-white/10 text-white placeholder:text-white/30"
            />

            <Button
              onClick={handleCreate}
              disabled={!newName.trim()}
              className="w-full h-10 text-sm font-bold rounded-sm bg-[#9ECAFF] border-[#9ECAFF] text-[#003258] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Create and start analysis
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
