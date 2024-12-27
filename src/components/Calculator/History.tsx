import React from 'react';
import InlineMath from '@matejmazur/react-katex';
import { HistoryItem } from '../../types/calculator';

interface HistoryProps {
  items: HistoryItem[];
  onItemClick?: (item: HistoryItem) => void;
}

const History: React.FC<HistoryProps> = ({ items, onItemClick }) => {
  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 border border-slate-200">
      <h2 className="text-sm font-semibold mb-2 text-slate-900">History</h2>
      <div className="max-h-[150px] overflow-y-auto space-y-1">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="p-2 rounded-md bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            onClick={() => onItemClick?.(item)}
          >
            <div className="text-sm text-slate-600">
              <InlineMath math={item.expression} />
            </div>
            <div className="text-right text-sm font-medium text-slate-900">
              <InlineMath math={item.result} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History; 