import React from 'react';
import LatexInput from '../LatexInput';
import InlineMath from '@matejmazur/react-katex';
import { MATH_FUNCTIONS, CONSTANTS } from '../../utils/mathParser';

interface CalculatorProps {
  input: string;
  result: string;
  useRadians: boolean;
  onInputChange: (value: string) => void;
  onCalculate: () => void;
  onRadiansChange: (useRadians: boolean) => void;
}

const Calculator: React.FC<CalculatorProps> = ({
  input,
  result,
  useRadians,
  onInputChange,
  onCalculate,
  onRadiansChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-900">Calculator</h2>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={useRadians}
            onChange={(e) => onRadiansChange(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-xs text-slate-700">Use Radians</span>
        </label>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <LatexInput
            value={input}
            onChange={onInputChange}
            onSubmit={onCalculate}
            placeholder="Calculate expression"
            className="text-sm"
          />
          <div className="text-right text-xl font-semibold text-slate-900 font-mono min-h-[28px]">
            <InlineMath math={result || '0'} />
          </div>
        </div>

        {/* Quick Functions */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-700">Quick Functions</h3>
          <div className="grid grid-cols-3 gap-1.5">
            {Object.keys(MATH_FUNCTIONS).map(fn => (
              <button
                key={fn}
                onClick={() => onInputChange(input + fn + '(')}
                className="px-2 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-md transition-colors text-slate-700"
              >
                {fn}
              </button>
            ))}
            {Object.keys(CONSTANTS).map(constant => (
              <button
                key={constant}
                onClick={() => onInputChange(input + constant)}
                className="px-2 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 rounded-md transition-colors text-blue-700"
              >
                {constant}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator; 