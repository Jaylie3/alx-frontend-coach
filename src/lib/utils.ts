import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CodeFeedback {
  issues: string[];
  suggestions: string[];
  score: number;
}

export function analyzeCode(code: string): CodeFeedback {
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (code.length === 0) {
    return { issues: ["No code provided"], suggestions: ["Add your code for analysis"], score: 0 };
  }

  // Check for common issues
  if (code.includes("console.log")) {
    issues.push("Contains console.log statements - remove in production code");
  }

  // Check for var usage
  if (/\bvar\s/.test(code)) {
    suggestions.push("Consider using 'let' or 'const' instead of 'var'");
  }

  // Check for loose equality
  if (code.includes("==") && !code.includes("===")) {
    suggestions.push("Use strict equality '===' instead of '=='");
  }

  // Check for missing semicolons
  const lines = code.split("\n");
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (
      trimmed &&
      !trimmed.endsWith(";") &&
      !trimmed.endsWith("{") &&
      !trimmed.endsWith("}") &&
      !trimmed.startsWith("//") &&
      !trimmed.startsWith("/*") &&
      !trimmed.endsWith("*/") &&
      (trimmed.includes("let ") || trimmed.includes("const ") || trimmed.includes("var "))
    ) {
      issues.push(`Line ${index + 1}: Missing semicolon`);
    }
  });

  // Check for empty catch blocks
  if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(code)) {
    issues.push("Empty catch block detected - add error handling");
  }

  // Check for TODO comments
  if (/TODO|FIXME|HACK/i.test(code)) {
    suggestions.push("Contains TODO/FIXME comments - address before production");
  }

  // Calculate score (0-100)
  const score = Math.max(0, 100 - issues.length * 15 - suggestions.length * 5);

  return {
    issues,
    suggestions,
    score,
  };
}