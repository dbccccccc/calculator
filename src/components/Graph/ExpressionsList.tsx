import React from 'react';
import LatexInput from '../LatexInput';
import InlineMath from '@matejmazur/react-katex';
import { Expression } from '../../types/calculator';

interface ExpressionsListProps {
  expressions: Expression[];
  selectedExpression: string | null;
  showTable: boolean;
  showDerivatives: boolean;
  onExpressionSelect: (id: string) => void;
  onExpressionUpdate: (id: string, text: string) => void;
  onExpressionDelete: (id: string) => void;
  onExpressionVisibilityToggle: (id: string) => void;
  onSliderValueChange: (id: string, value: number) => void;
  onAnimationToggle: (id: string) => void;
  onTableToggle: () => void;
  onDerivativesToggle: () => void;
  evaluateExpressionAtPoint: (expression: string) => string;
}

const ExpressionsList: React.FC<ExpressionsListProps> = ({
  expressions,
  selectedExpression,
  showTable,
  showDerivatives,
  onExpressionSelect,
  onExpressionUpdate,
  onExpressionDelete,
  onExpressionVisibilityToggle,
  onSliderValueChange,
  onAnimationToggle,
  onTableToggle,
  onDerivativesToggle,
  evaluateExpressionAtPoint,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
      <h2 className="text-sm font-semibold mb-3 text-slate-900">Expressions</h2>
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {expressions.map((exp) => (
          <div 
            key={exp.id} 
            className={`group flex flex-col space-y-1.5 p-2 rounded-lg border border-slate-200 hover:border-blue-500/50 transition-all cursor-pointer
              ${selectedExpression === exp.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-slate-50'}`}
            onClick={() => onExpressionSelect(exp.id)}
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExpressionVisibilityToggle(exp.id);
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  onExpressionDelete(exp.id);
                }}
                className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>

            {exp.type === 'slider' && exp.sliderRange && (
              <div className="flex flex-col space-y-2 px-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min={exp.sliderRange.min}
                    max={exp.sliderRange.max}
                    step={exp.sliderRange.step}
                    value={exp.sliderValue}
                    onChange={(e) => onSliderValueChange(exp.id, Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAnimationToggle(exp.id);
                    }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                      ${exp.isAnimating 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-blue-100 text-blue-600'}`}
                  >
                    {exp.isAnimating ? '⏹️' : '▶️'}
                  </button>
                </div>
                <div className="text-sm text-slate-500 font-mono pl-2">
                  = {exp.sliderValue?.toFixed(2)}
                </div>
              </div>
            )}

            {selectedExpression === exp.id && exp.type === 'function' && (
              <div className="mt-2 space-y-3 px-2">
                <div className="flex space-x-2">
                  <button
                    onClick={onTableToggle}
                    className="flex-1 px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700"
                  >
                    {showTable ? 'Hide Table' : 'Show Table'}
                  </button>
                  {exp.derivative && (
                    <button
                      onClick={onDerivativesToggle}
                      className={`flex-1 px-4 py-2 text-sm rounded-lg transition-colors ${
                        showDerivatives 
                          ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {showDerivatives ? 'Hide' : 'Show'} Derivative
                    </button>
                  )}
                </div>
                {showTable && exp.tableData && (
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 border-b border-slate-200 text-slate-600">x</th>
                          <th className="px-3 py-2 border-b border-slate-200 text-slate-600">y</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {exp.tableData.map((point, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="px-3 py-2 text-center text-slate-700">{point.x}</td>
                            <td className="px-3 py-2 text-center text-slate-700">{point.y}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {exp.derivative && showDerivatives && (
                  <div className="text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                    d/dx = <span className="font-mono text-blue-600">{exp.derivative}</span>
                    <div className="text-xs text-slate-500 font-mono mt-1">
                      = {evaluateExpressionAtPoint(exp.derivative)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpressionsList; 