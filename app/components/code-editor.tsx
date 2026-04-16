"use client"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  const lines = value.split("\n")

  return (
    <div className="flex h-full w-full overflow-auto bg-[#0A0E14] rounded-lg border border-white/5 font-mono text-sm">
      <div className="select-none py-4 pr-4 pl-4 text-right text-gray-600 leading-6">
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="flex-1 resize-none bg-transparent py-4 pr-4 text-gray-300 leading-6 outline-none caret-white"
      />
    </div>
  )
}
