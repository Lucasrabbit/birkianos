"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-birk-text"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-3 rounded-2xl border border-birk-border bg-white text-birk-text placeholder:text-birk-muted",
            "focus:outline-none focus:ring-2 focus:ring-birk-yellow/50 focus:border-birk-yellow",
            "transition-all duration-200 text-sm",
            error && "border-red-300 focus:ring-red-200 focus:border-red-400",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-birk-muted">{hint}</p>
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-birk-text"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={3}
          className={cn(
            "w-full px-4 py-3 rounded-2xl border border-birk-border bg-white text-birk-text placeholder:text-birk-muted",
            "focus:outline-none focus:ring-2 focus:ring-birk-yellow/50 focus:border-birk-yellow",
            "transition-all duration-200 text-sm resize-none",
            error && "border-red-300",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-birk-muted">{hint}</p>
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export default Input;
