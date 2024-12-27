'use client';

import { Expression } from '../types/calculator';
import LatexInput from './LatexInput';
import InlineMath from '@matejmazur/react-katex';
import 'katex/dist/katex.min.css';
import { MATH_FUNCTIONS, CONSTANTS } from '../utils/mathParser';
import { useEffect, useState, useRef } from 'react';

interface UnifiedInputProps {
  input: string;
  result: string;
  expressions: Expression[];
  useRadians: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onRadiansChange: (value: boolean) => void;
  onExpressionVisibilityToggle: (id: string) => void;
  onExpressionDelete: (id: string) => void;
  onExpressionUpdate: (id: string, text: string) => void;
  evaluateExpressionAtPoint: (expression: string, x?: number) => string;
}

const UnifiedInput = ({
  input,
  result,
  expressions,
  useRadians,
  onInputChange,
  onSubmit,
  onRadiansChange,
  onExpressionVisibilityToggle,
  onExpressionDelete,
  onExpressionUpdate,
  evaluateExpressionAtPoint,
}: UnifiedInputProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<{ expression: string; result: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard shortcuts and real-time updates
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
      } else if (e.key === 'ArrowUp' && history.length > 0) {
        e.preventDefault();
        onInputChange(history[history.length - 1].expression);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, onSubmit, onInputChange]);

  // Update result in real-time when input changes
  useEffect(() => {
    onSubmit();
  }, [input, onSubmit]);

  const handleQuickInsert = (value: string) => {
    // Focus the input if it's not already focused
    inputRef.current?.focus();
    
    // Get the cursor position from the input element
    const cursorPosition = inputRef.current?.selectionStart ?? input.length;
    
    // Insert the value at the cursor position
    const newValue = input.slice(0, cursorPosition) + value + input.slice(cursorPosition);
    onInputChange(newValue);
    
    // Set the cursor position after the inserted value
    setTimeout(() => {
      const newPosition = cursorPosition + value.length;
      inputRef.current?.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  return (
    <div className="space-y-3">
      {/* Quick Calculator */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900">Quick Calculator</h2>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useRadians}
                onChange={(e) => onRadiansChange(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-700">Use Radians</span>
            </label>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <LatexInput
            ref={inputRef}
            value={input}
            onChange={onInputChange}
            onSubmit={onSubmit}
            placeholder="Calculate (updates automatically)"
            className="text-lg"
          />
          <div className="text-right text-2xl font-semibold text-slate-900 font-mono min-h-[36px]">
            <InlineMath math={result || '0'} />
          </div>
        </div>

        {/* Quick Functions */}
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {Object.keys(MATH_FUNCTIONS).slice(0, 8).map(fn => (
            <button
              key={fn}
              onClick={() => handleQuickInsert(fn + '(')}
              className="px-2 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 rounded-md transition-colors text-blue-700"
            >
              {fn}
            </button>
          ))}
          {Object.keys(CONSTANTS).map(constant => (
            <button
              key={constant}
              onClick={() => handleQuickInsert(constant)}
              className="px-2 py-1.5 text-sm bg-green-100 hover:bg-green-200 rounded-md transition-colors text-green-700"
            >
              {constant}
            </button>
          ))}
        </div>

        {/* Calculation History */}
        {showHistory && history.length > 0 && (
          <div className="mt-3 border-t border-slate-200 pt-3">
            <div className="text-sm font-medium text-slate-700 mb-2">History</div>
            <div className="space-y-1 max-h-[200px] overflow-y-auto">
              {history.map((item, index) => (
                <div
                  key={index}
                  onClick={() => onInputChange(item.expression)}
                  className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  <div className="text-sm text-slate-600">
                    <InlineMath math={item.expression} />
                  </div>
                  <div className="text-sm font-medium text-slate-900">
                    <InlineMath math={item.result} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Expression Input */}
      <div className="bg-white rounded-lg shadow-sm p-3 border border-slate-200">
        <h2 className="text-sm font-semibold mb-2 text-slate-900">Graph Expression</h2>
        <LatexInput
          value={input}
          onChange={onInputChange}
          onSubmit={onSubmit}
          placeholder="Enter expression (e.g. y=x^2, a=1)"
          className="text-slate-900"
        />
      </div>

      {/* Expressions List */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
        <h2 className="text-sm font-semibold mb-3 text-slate-900">Expressions</h2>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {expressions.map((exp) => (
            <div 
              key={exp.id} 
              className="group flex flex-col space-y-1.5 p-2 rounded-lg border border-slate-200 hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onExpressionVisibilityToggle(exp.id)}
                  className={`w-8 h-8 rounded-lg transition-colors flex items-center justify-center
                    ${exp.isVisible ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}
                >
                  {exp.isVisible ? '👁️' : ''}
                </button>
                <div className="flex-1 flex flex-col space-y-1">
                  <LatexInput
                    value={exp.text}
                    onChange={(value) => onExpressionUpdate(exp.id, value)}
                    className="text-slate-900"
                    style={{ color: exp.color }}
                  />
                  {exp.type === 'function' && (
                    <div className="text-sm text-slate-500 font-mono pl-2">
                      = <InlineMath math={evaluateExpressionAtPoint(exp.text)} />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onExpressionDelete(exp.id)}
                  className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Functions */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
        <h2 className="text-sm font-semibold mb-3 text-slate-900">All Functions</h2>
        <div className="grid grid-cols-3 gap-1.5">
          {Object.keys(MATH_FUNCTIONS).map(fn => (
            <button
              key={fn}
              onClick={() => handleQuickInsert(fn + '(')}
              className="px-2 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-md transition-colors text-slate-700"
            >
              {fn}
            </button>
          ))}
          {Object.keys(CONSTANTS).map(constant => (
            <button
              key={constant}
              onClick={() => handleQuickInsert(constant)}
              className="px-2 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 rounded-md transition-colors text-blue-700"
            >
              {constant}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnifiedInput; 