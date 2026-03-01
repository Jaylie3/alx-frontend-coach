'use client';

import { useState } from 'react';

interface FeedbackItem {
  type: 'error' | 'warning' | 'success' | 'suggestion';
  message: string;
  line?: number;
}

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewHistory, setReviewHistory] = useState<{ code: string; timestamp: number }[]>([]);

  const analyzeCode = () => {
    if (!code.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate code analysis with artificial delay
    setTimeout(() => {
      const newFeedback: FeedbackItem[] = [];
      
      // Basic analysis logic
      if (code.includes('var ')) {
        newFeedback.push({
          type: 'warning',
          message: 'Consider using "let" or "const" instead of "var" for modern JavaScript.',
          line: code.split('\n').findIndex(line => line.includes('var ')) + 1
        });
      }
      
      if (code.includes('alert(')) {
        newFeedback.push({
          type: 'warning',
          message: 'Avoid using alert() in production. Consider using a UI notification system.',
          line: code.split('\n').findIndex(line => line.includes('alert(')) + 1
        });
      }
      
      if (!code.includes('console.')) {
        newFeedback.push({
          type: 'suggestion',
          message: 'Consider adding console.log statements for debugging purposes.'
        });
      }
      
      if (code.includes('== ') && !code.includes('=== ')) {
        newFeedback.push({
          type: 'error',
          message: 'Use strict equality (===) instead of loose equality (==) to avoid type coercion issues.',
          line: code.split('\n').findIndex(line => line.includes('== ')) + 1
        });
      }
      
      if (code.match(/function\s*\w+\s*\([^)]*\)\s*\{/)) {
        newFeedback.push({
          type: 'suggestion',
          message: 'Consider using arrow functions () => {} for a cleaner syntax in modern JavaScript.'
        });
      }
      
      if (newFeedback.length === 0) {
        newFeedback.push({
          type: 'success',
          message: 'Great job! Your code follows modern best practices. Keep up the good work!'
        });
      }
      
      setFeedback(newFeedback);
      setReviewHistory(prev => [...prev, { code, timestamp: Date.now() }]);
      setIsAnalyzing(false);
    }, 1500);
  };

  const getFeedbackIcon = (type: FeedbackItem['type']) => {
    switch (type) {
      case 'error': return '⚠️';
      case 'warning': return '⚡';
      case 'success': return '✅';
      case 'suggestion': return '💡';
      default: return '📝';
    }
  };

  const getFeedbackColor = (type: FeedbackItem['type']) => {
    switch (type) {
      case 'error': return 'border-red-500/50 bg-red-500/10';
      case 'warning': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'success': return 'border-green-500/50 bg-green-500/10';
      case 'suggestion': return 'border-blue-500/50 bg-blue-500/10';
      default: return 'border-zinc-500/50 bg-zinc-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Alx Frontend Coach
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-400">
            Paste your code below for instant feedback and improvement suggestions.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Code Input Panel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="language-select" className="text-sm font-medium text-zinc-300">
                Language
              </label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-lg bg-white/[0.05] border border-white/[0.1] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/[0.2]"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="react">React/JSX</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
              </select>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white/[0.05] shadow-xl ring-1 ring-white/[0.1]">
              <div className="p-1">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here...&#10;&#10;Example:&#10;function calculateSum(a, b) {&#10;  return a + b;&#10;}"
                  className="min-h-[400px] w-full resize-none rounded-xl bg-transparent px-4 py-4 font-mono text-sm text-white placeholder-zinc-500 focus:outline-none"
                  spellCheck="false"
                />
              </div>
            </div>

            <button
              onClick={analyzeCode}
              disabled={!code.trim() || isAnalyzing}
              className="w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing code...
                </span>
              ) : 'Review My Code'}
            </button>
          </div>

          {/* Feedback Panel */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Feedback</h2>
            
            {feedback.length === 0 && !isAnalyzing && (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-8 py-12 text-center">
                <div className="mb-4 text-5xl">👨‍💻</div>
                <h3 className="text-lg font-medium text-white">No feedback yet</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Enter your code and click "Review My Code" to get personalized feedback.
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex min-h-[400px] items-center justify-center rounded-2xl bg-white/[0.02]">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-12 w-12 animate-bounce text-4xl">🔍</div>
                  <p className="text-zinc-400">Analyzing your code...</p>
                </div>
              </div>
            )}

            {feedback.length > 0 && !isAnalyzing && (
              <div className="max-h-[500px] space-y-3 overflow-y-auto rounded-2xl bg-white/[0.02] p-4">
                {feedback.map((item, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 rounded-xl border p-4 transition-all hover:scale-[1.02] ${getFeedbackColor(item.type)}`}
                  >
                    <span className="flex-shrink-0 text-2xl">{getFeedbackIcon(item.type)}</span>
                    <div className="flex-1">
                      {item.line && (
                        <span className="mb-1 inline-block rounded bg-black/30 px-2 py-0.5 text-xs font-mono text-zinc-400">
                          Line {item.line}
                        </span>
                      )}
                      <p className="text-sm text-white">{item.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Review History */}
        {reviewHistory.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-lg font-semibold text-white">Recent Reviews</h2>
            <div className="flex flex-wrap gap-3">
              {reviewHistory.slice(-5).map((review, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCode(review.code);
                    setFeedback([]);
                  }}
                  className="group rounded-lg bg-white/[0.05] px-4 py-2 text-left transition-all hover:bg-white/[0.1]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 group-hover:text-white">
                      {new Date(review.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="text-xs text-zinc-600">
                      {review.code.split('\n').length} lines
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}