"use client"

import { useState } from "react"

const initialCode = `import React, { useState, useEffect } from 'react';
import { DashboardProps } from './types';

export const CodeEditor = ({ initialCode }: DashboardProps) =>
{
  const [code, setCode] = useState(initialCode);
  const [isValid, setIsValid] = useState(true);

  // Potential performance bottleneck here
  useEffect(() => {
    const handler = setTimeout(() => {
      console.log('Running analysis...');
    }, 500);
    return () => clearTimeout(handler);
  }, [code]);

  return (
    <div className="editor-container">
      <textarea value={code} onChange={(e) =>
setCode(e.target.value)} />
    </div>
  );
};`

export function CodeEditor() {
  const [code, setCode] = useState(initialCode)
  const lines = code.split("\n")

  return (
    <div className="flex h-full w-full overflow-auto bg-[#0A0E14] rounded-lg border border-white/5 font-mono text-sm">
      <div className="select-none py-4 pr-4 pl-4 text-right text-gray-600 leading-6">
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        className="flex-1 resize-none bg-transparent py-4 pr-4 text-gray-300 leading-6 outline-none caret-white"
      />
    </div>
  )
}
