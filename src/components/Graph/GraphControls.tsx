'use client';

import { GraphSettings } from '../../types/calculator';

interface GraphControlsProps {
  graphSettings: GraphSettings;
  onZoom: (direction: 'in' | 'out') => void;
  onSettingChange: (setting: keyof GraphSettings, value: boolean) => void;
}

const GraphControls = ({ graphSettings, onZoom, onSettingChange }: GraphControlsProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
      <h2 className="text-sm font-semibold mb-3 text-slate-900">Graph Controls</h2>
      <div className="space-y-3">
        <div className="flex space-x-2">
          <button
            onClick={() => onZoom('in')}
            className="flex-1 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-md transition-colors text-slate-700"
          >
            Zoom In
          </button>
          <button
            onClick={() => onZoom('out')}
            className="flex-1 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-md transition-colors text-slate-700"
          >
            Zoom Out
          </button>
        </div>
        <div className="space-y-2">
          {[
            { label: 'Show Grid', value: graphSettings.showGrid, key: 'showGrid' as const },
            { label: 'Show Axes', value: graphSettings.showAxes, key: 'showAxes' as const },
            { label: 'Show Derivatives', value: graphSettings.showDerivatives, key: 'showDerivatives' as const }
          ].map(({ label, value, key }) => (
            <label key={key} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => onSettingChange(key, e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GraphControls; 