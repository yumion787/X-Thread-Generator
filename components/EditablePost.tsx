"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface EditablePostProps {
  index: number;
  content: string;
}

export function EditablePost({ index, content }: EditablePostProps) {
  const [text, setText] = useState(content);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex items-start gap-3">
        <span className="shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold mt-1">
          {index}
        </span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={Math.max(3, text.split("\n").length + 1)}
          className="flex-1 text-sm text-gray-800 leading-relaxed resize-none rounded-lg border border-transparent hover:border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 focus:outline-none px-2 py-1 -mx-2 -my-1 transition-colors bg-transparent"
        />
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className={`text-xs ${text.length > 140 ? "text-red-500" : "text-gray-400"}`}>
          {text.length} / 140文字
        </span>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-400 hover:text-blue-500 transition-colors px-2 py-1 rounded hover:bg-blue-50 cursor-pointer flex items-center gap-1"
        >
          {copied ? <><Check size={12} />済み</> : <><Copy size={12} />コピー</>}
        </button>
      </div>
    </div>
  );
}
