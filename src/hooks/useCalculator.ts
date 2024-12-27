import { useState } from 'react';
import { evaluateExpression } from '../utils/mathParser';
import { HistoryItem } from '../types/calculator';

export const useCalculator = (useRadians: boolean) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const calculate = (variables: Record<string, number> = {}) => {
    try {
      setError(null);
      const calculatedResult = evaluateExpression(input, variables, useRadians);
      const formattedResult = Number.isInteger(calculatedResult) 
        ? calculatedResult.toString() 
        : calculatedResult.toFixed(6);
      
      setResult(formattedResult);
      setHistory(prev => [...prev, { expression: input, result: formattedResult }]);
      return true;
    } catch (error) {
      setResult('Error');
      setError('Invalid calculation');
      return false;
    }
  };

  const clearInput = () => {
    setInput('');
    setResult('');
    setError(null);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const appendToInput = (value: string) => {
    setInput(prev => prev + value);
  };

  return {
    input,
    result,
    history,
    error,
    setInput,
    calculate,
    clearInput,
    clearHistory,
    appendToInput,
  };
};

export default useCalculator; 