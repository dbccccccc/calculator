'use client';

import { useEffect, useState } from 'react';
import UnifiedInput from '../components/UnifiedInput';
import Graph from '../components/Graph/Graph';
import GraphControls from '../components/Graph/GraphControls';
import History from '../components/Calculator/History';
import useUnifiedCalculator from '../hooks/useUnifiedCalculator';
import { GraphSettings } from '../types/calculator';

const Calculator = () => {
  const [useRadians, setUseRadians] = useState(true);
  const [showGraph, setShowGraph] = useState(true);
  const [graphSettings, setGraphSettings] = useState<GraphSettings>({
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
    showGrid: true,
    showAxes: true,
    showDerivatives: false
  });

  const {
    input,
    result,
    history,
    error,
    expressions,
    selectedExpression,
    showTable,
    setInput,
    processInput,
    setSelectedExpression,
    setShowTable,
    updateExpression,
    toggleExpressionVisibility,
    deleteExpression,
    updateSliderValue,
    toggleAnimation,
    evaluateExpressionAtPoint,
  } = useUnifiedCalculator(useRadians);

  const handleZoom = (direction: 'in' | 'out') => {
    const factor = direction === 'in' ? 0.8 : 1.25;
    setGraphSettings(prev => ({
      ...prev,
      xMin: prev.xMin * factor,
      xMax: prev.xMax * factor,
      yMin: prev.yMin * factor,
      yMax: prev.yMax * factor
    }));
  };

  const handleSettingChange = (setting: keyof GraphSettings, value: boolean) => {
    setGraphSettings(prev => ({ ...prev, [setting]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-screen-2xl mx-auto px-4 py-4">
        {/* Header with Graph Toggle */}
        <div className="mb-4 flex items-center justify-between bg-white rounded-lg shadow-sm p-3 border border-slate-200">
          <h1 className="text-xl font-semibold text-slate-900">Online Calculator</h1>
          <label className="flex items-center space-x-2 cursor-pointer">
            <span className="text-sm text-slate-700">Show Graph</span>
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                checked={showGraph}
                onChange={(e) => setShowGraph(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </label>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Panel - Controls */}
          <div className={showGraph ? "lg:w-[320px] xl:w-[380px]" : "w-full max-w-2xl mx-auto"}>
            <UnifiedInput
              input={input}
              result={result}
              expressions={expressions}
              useRadians={useRadians}
              onInputChange={setInput}
              onSubmit={() => processInput(input)}
              onRadiansChange={setUseRadians}
              onExpressionVisibilityToggle={toggleExpressionVisibility}
              onExpressionDelete={deleteExpression}
              onExpressionUpdate={updateExpression}
              evaluateExpressionAtPoint={evaluateExpressionAtPoint}
            />
          </div>

          {/* Right Panel - Graph and Info - Only show when enabled */}
          {showGraph && (
            <div className="flex-1 flex flex-col gap-3">
              <Graph
                expressions={expressions}
                graphSettings={graphSettings}
                error={error}
              />
              <GraphControls
                graphSettings={graphSettings}
                onZoom={handleZoom}
                onSettingChange={handleSettingChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
