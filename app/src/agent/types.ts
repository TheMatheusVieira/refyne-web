// 🔹 Severidade dos problemas
export type Severity = 'low' | 'medium' | 'high';

// 🔹 Categoria do analyzer
export type Category =
  | 'performance'
  | 'security'
  | 'clean-code'
  | 'ux';

// 🔹 Issue detectada no código
export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  category: Category;

  line?: number;
  column?: number;

  suggestion?: string;

  // 🔥 futuro: auto-fix
  fix?: {
    description: string;
    code?: string;
  };
}

// 🔹 Resultado de um analyzer específico
export interface AnalyzerResult {
  category: Category;
  issues: Issue[];
  score: number; // 0 - 100
}

// 🔹 Resultado completo do agent
export interface AgentResult {
  performance: AnalyzerResult;
  security: AnalyzerResult;
  cleanCode: AnalyzerResult;

  // 🔥 Score geral
  overallScore: number;

  // 🔥 Classificação (A, B, C...)
  grade: 'A' | 'B' | 'C' | 'D' | 'E';

  // 🔥 Insights da IA
  ai?: AIInsights;
}

// 🔹 Resposta da LLM
export interface AIInsights {
  summary: string;

  priorityFixes: string[];

  suggestions: string[];

  // 🔥 futuro: código corrigido
  improvedCode?: string;
}

// 🔹 Input do agent (pra evoluir depois)
export interface AgentInput {
  code: string;
  language?: 'javascript' | 'typescript';

  // 🔥 contexto futuro
  framework?: 'react' | 'react-native' | 'angular';
}