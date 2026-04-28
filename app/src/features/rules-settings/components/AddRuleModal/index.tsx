"use client";

import { useState } from "react";
import { Button } from "@/app/src/components/ui/button";
import { Input } from "@/app/src/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/src/components/ui/select";
import { Sparkles, Loader2, X } from "lucide-react";
import { Category, Severity } from "@/app/src/agent/types";
import { callLLM } from "@/app/src/agent/llm/client";
import { buildRuleGenerationPrompt } from "@/app/src/agent/llm/buildRulePrompt";
import { safeParse } from "@/app/src/agent/llm/safeParse";
import {
  addCustomRule,
  CustomRule,
} from "@/app/src/features/rules-settings/services/custom-rules-storage";

interface AddRuleModalProps {
  open: boolean;
  onClose: () => void;
  onRuleCreated: (rule: CustomRule) => void;
}

export function AddRuleModal({ open, onClose, onRuleCreated }: AddRuleModalProps) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("performance");
  const [severity, setSeverity] = useState<Severity>("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!description.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const prompt = buildRuleGenerationPrompt({
        description: description.trim(),
        category,
        severity,
      });

      const raw = await callLLM(prompt);
      const parsed = safeParse(raw);

      if (!parsed?.name || !parsed?.code) {
        setError("A IA não conseguiu gerar a regra. Tente descrever de forma mais específica.");
        return;
      }

      const rule: CustomRule = {
        id: `custom-${parsed.name}-${Date.now()}`,
        name: parsed.name,
        description: parsed.description || description.trim(),
        category,
        severity,
        prompt: description.trim(),
        code: parsed.code,
        createdAt: new Date().toISOString(),
        enabled: true,
      };

      addCustomRule(rule);
      onRuleCreated(rule);
      handleClose();
    } catch (err) {
      console.error(err);
      setError("Falha ao gerar a regra. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setDescription("");
    setCategory("performance");
    setSeverity("medium");
    setError(null);
    setLoading(false);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg bg-[#1C2026] border border-white/10 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00E475]/10">
              <Sparkles className="h-5 w-5 text-[#00E475]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create Custom Rule</h2>
              <p className="text-xs text-[#8B90A0]">
                Descreva a regra em linguagem natural — a IA gera o código.
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="text-[#8B90A0] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="text-sm font-medium text-[#8B90A0] mb-1.5 block">
            Descrição da regra
          </label>
          <textarea
            className="w-full h-28 rounded-md bg-[#0A0E14] border border-white/10 text-white text-sm p-3 resize-none focus:outline-none focus:ring-1 focus:ring-[#9ECAFF] placeholder:text-[#4A4F5C]"
            placeholder='Ex: "Detectar quando useState é chamado dentro de loops ou condicionais, o que quebra as regras dos hooks do React"'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Category + Severity */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1">
            <label className="text-sm font-medium text-[#8B90A0] mb-1.5 block">
              Categoria
            </label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as Category)}
              disabled={loading}
            >
              <SelectTrigger className="w-full h-10 bg-[#0A0E14] border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1C2026] border-white/10">
                <SelectItem value="performance" className="text-white focus:bg-white/10 focus:text-white">
                  Performance
                </SelectItem>
                <SelectItem value="security" className="text-white focus:bg-white/10 focus:text-white">
                  Security
                </SelectItem>
                <SelectItem value="clean-code" className="text-white focus:bg-white/10 focus:text-white">
                  Clean Code
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-[#8B90A0] mb-1.5 block">
              Severidade
            </label>
            <Select
              value={severity}
              onValueChange={(v) => setSeverity(v as Severity)}
              disabled={loading}
            >
              <SelectTrigger className="w-full h-10 bg-[#0A0E14] border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1C2026] border-white/10">
                <SelectItem value="low" className="text-white focus:bg-white/10 focus:text-white">
                  Low
                </SelectItem>
                <SelectItem value="medium" className="text-white focus:bg-white/10 focus:text-white">
                  Medium
                </SelectItem>
                <SelectItem value="high" className="text-white focus:bg-white/10 focus:text-white">
                  High
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-md bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-10 bg-transparent border-white/10 text-[#8B90A0] hover:text-white hover:bg-white/5"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1 h-10 bg-[#00E475] text-[#0A0E14] font-bold hover:bg-[#00E475]/90 disabled:opacity-40"
            onClick={handleGenerate}
            disabled={!description.trim() || loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Rule
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
