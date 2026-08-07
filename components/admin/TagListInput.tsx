"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TagListInputProps {
  label: string;
  placeholder?: string;
  values: string[];
  onChange: (values: string[]) => void;
}

export function TagListInput({ label, placeholder, values, onChange }: TagListInputProps) {
  const [draft, setDraft] = useState("");

  const inputCls =
    "w-full rounded-md border border-border bg-surface-light px-3 py-2 text-sm text-foreground placeholder:text-text-muted/60 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30";

  function add() {
    const value = draft.trim();
    if (!value || values.includes(value)) {
      setDraft("");
      return;
    }
    onChange([...values, value]);
    setDraft("");
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-text-muted">{label}</label>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className={inputCls}
        />
        <Button type="button" variant="outline" onClick={add}>
          <Plus className="h-3.5 w-3.5" /> Add
        </Button>
      </div>
      {values.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {values.map((value) => (
            <span
              key={value}
              className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground"
            >
              {value}
              <button
                type="button"
                aria-label={`Remove ${value}`}
                onClick={() => onChange(values.filter((v) => v !== value))}
                className="text-text-muted hover:text-error"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
