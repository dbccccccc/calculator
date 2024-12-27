'use client';

import { useEffect, useRef } from 'react';
import { Expression, GraphSettings } from '../../types/calculator';

interface GraphProps {
  expressions: Expression[];
  graphSettings: GraphSettings;
  error: string | null;
}

const Graph = ({ expressions, graphSettings, error }: GraphProps) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const functionPlotRef = useRef<any>(null);

  useEffect(() => {
    const loadFunctionPlot = async () => {
      const functionPlotModule = await import('function-plot');
      functionPlotRef.current = functionPlotModule.default;
      renderGraph();
    };
    loadFunctionPlot();
  }, []);

  const renderGraph = () => {
    if (functionPlotRef.current && graphRef.current) {
      try {
        graphRef.current.innerHTML = '';
        const data = expressions
          .filter(exp => exp.isVisible)
          .flatMap(exp => {
            const plots = [];
            
            if (exp.type === 'function') {
              plots.push({
                fn: exp.text,
                color: exp.color,
                graphType: 'polyline',
                skipTip: true
              });

              if (graphSettings.showDerivatives && exp.derivative) {
                plots.push({
                  fn: exp.derivative,
                  color: exp.color,
                  graphType: 'polyline',
                  strokeDasharray: '5,5',
                  skipTip: true
                });
              }
            } else if (exp.type === 'inequality') {
              plots.push({
                fn: exp.text.replace('>', '').replace('<', ''),
                color: exp.color,
                graphType: 'polyline',
                fnType: exp.text.includes('>') ? 'greater' : 'less',
                skipTip: true
              });
            } else if (exp.type === 'point') {
              const [x, y] = exp.text.split(',').map(Number);
              plots.push({
                points: [[x, y]],
                color: exp.color,
                fnType: 'points',
                graphType: 'scatter'
              });
            }
            return plots;
          });

        functionPlotRef.current({
          target: graphRef.current,
          width: graphRef.current.clientWidth - 32,
          height: 600,
          grid: graphSettings.showGrid ? {
            color: '#e2e8f0',
            width: 1
          } : false,
          xAxis: { 
            domain: [graphSettings.xMin, graphSettings.xMax],
            label: 'x',
            line: graphSettings.showAxes,
            fontSize: 16,
            color: '#1e293b',
            labelOffset: 30,
            ticks: 10,
            tickLabelOffset: 8
          },
          yAxis: { 
            domain: [graphSettings.yMin, graphSettings.yMax],
            label: 'y',
            line: graphSettings.showAxes,
            fontSize: 16,
            color: '#1e293b',
            labelOffset: 30,
            ticks: 10,
            tickLabelOffset: 8
          },
          data,
          annotations: expressions
            .filter(exp => exp.type === 'slider' && exp.isVisible)
            .map(exp => ({
              x: exp.sliderValue,
              text: `${exp.text} = ${exp.sliderValue?.toFixed(2)}`
            })),
          disableZoom: false,
          tip: {
            xLine: true,
            yLine: true,
            renderer: (x: number, y: number) => `(${x.toFixed(2)}, ${y.toFixed(2)})`
          },
          fontSize: 16,
          colors: ['#1e293b'],
          axisRatio: 1.2
        });
      } catch (err) {
        console.error('Failed to plot:', err);
      }
    }
  };

  useEffect(() => {
    renderGraph();
  }, [expressions, graphSettings]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col flex-grow">
      <div className="p-3 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Graph</h2>
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
      </div>
      <div className="p-4 flex-grow">
        <div 
          ref={graphRef} 
          className="w-full h-full min-h-[600px] rounded-lg overflow-hidden bg-white"
        ></div>
      </div>
    </div>
  );
};

export default Graph; 