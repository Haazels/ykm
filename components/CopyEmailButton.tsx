"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { NAV_EMAIL } from "@/lib/content";

export default function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(NAV_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`relative flex items-center gap-1.5 overflow-hidden rounded-lg border px-[18px] py-2.5 text-[13px] transition-[border-color,transform] hover:-translate-y-0.5 ${
        copied ? "border-green-500 bg-green-500 text-black" : "border-[#333] bg-[#1e1e1e] text-white hover:border-accent"
      }`}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied!" : "Copy Email"}
    </button>
  );
}
