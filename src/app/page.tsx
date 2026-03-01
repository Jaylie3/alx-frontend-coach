"use client";

import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCode = () => {
    if (!code.trim()) {
      setFeedback("Please enter some code to analyze.");
      return;
    }

    setIsAnalyzing(true);
    setFeedback(null);

    // Simulate analysis with a small delay
    setTimeout(() => {
      const result = performCodeAnalysis(code);
      setFeedback(result);
      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Alx Frontend Coach
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Code-review and debugging tutor for junior frontend developers.
            </p>
          </div>

          <div className="mt-10 w-full max-w-2xl">
            <div className="overflow-hidden rounded-2xl bg-white/[0.05] shadow-xl ring-1 ring-white/[0.1]">
              <div className="p-8">
                <label className="block text-left text-sm font-medium text-zinc-300 mb-3">
                  Paste your code for review
                </label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// Paste your JavaScript/TypeScript code here..."
                  className="w-full h-64 rounded-lg bg-zinc-800/50 border border-white/10 text-white p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent resize-none placeholder:text-zinc-500"
                />
                <button
                  onClick={analyzeCode}
                  disabled={isAnalyzing}
                  className="mt-4 w-full rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Code"}
                </button>

                {feedback && (
                  <div className="mt-6 rounded-lg bg-zinc-800/50 border border-white/10 p-4">
                    <h3 className="text-sm font-semibold text-amber-400 mb-2">
                      Feedback
                    </h3>
                    <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-mono">
                      {feedback}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function performCodeAnalysis(code: string): string {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check for common issues
  if (code.includes("console.log")) {
    suggestions.push(
      "• Consider removing console.log statements before deployment."
    );
  }

  if (code.includes("var ")) {
    issues.push(
      "• Avoid using 'var' - prefer 'const' or 'let' for better scope management."
    );
  }

  if (code.includes("== ") || code.includes(" = ")) {
    suggestions.push(
      "• Consider using strict equality '===' instead of '==' to avoid type coercion."
    );
  }

  if (code.includes("any") && code.includes(":")) {
    issues.push(
      "• Avoid using 'any' type when possible - use specific types for better type safety."
    );
  }

  if (code.includes("eval(")) {
    issues.push(
      "• Avoid using eval() - it's unsafe and can lead to performance issues."
    );
  }

  if (!code.includes("export") && !code.includes("import")) {
    suggestions.push(
      "• Consider organizing your code into modules with import/export statements."
    );
  }

  // Check for function declarations vs expressions
  const functionCount = (code.match(/function\s+\w+/g) || []).length;
  const arrowFunctionCount = (code.match(/\w+\s*=>/g) || []).length;
  if (functionCount > 0 && arrowFunctionCount === 0) {
    suggestions.push(
      "• Consider using arrow functions for callbacks and shorter function syntax where appropriate."
    );
  }

  let result = "";
  if (issues.length === 0 && suggestions.length === 0) {
    result = "Great job! Your code looks clean. Keep practicing!";
  } else {
    if (issues.length > 0) {
      result += "Issues found:\n" + issues.join("\n") + "\n\n";
    }
    if (suggestions.length > 0) {
      result += "Suggestions:\n" + suggestions.join("\n");
    }
  }

  return result;
}