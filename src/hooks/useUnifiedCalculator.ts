import { useState, useRef } from 'react';
import { Expression, HistoryItem, TablePoint } from '../types/calculator';
import { evaluateExpression, parseFunction, findDerivative } from '../utils/mathParser';

const COLORS = ['#c74440', '#2d70b3', '#388c46', '#6042a6', '#000000', '#b74c76'];

export default function useUnifiedCalculator(useRadians: boolean) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expressions, setExpressions] = useState<Expression[]>([]);
  const [selectedExpression, setSelectedExpression] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(false);

  // Animation interval reference
  const animationRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const calculateDerivative = (expression: string): string => {
    try {
      return findDerivative(expression);
    } catch (error) {
      console.error('Error calculating derivative:', error);
      return 'Not implemented';
    }
  };

  const generateTableData = (expression: string, min: number, max: number, points: number): TablePoint[] => {
    const data: TablePoint[] = [];
    const step = (max - min) / (points - 1);
    
    for (let x = min; x <= max; x += step) {
      try {
        const y = evaluateExpression(expression, { x }, useRadians);
        if (!isNaN(y) && isFinite(y)) {
          data.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
        }
      } catch (error) {
        console.error('Error calculating table value:', error);
      }
    }
    return data;
  };

  const processInput = (text: string) => {
    if (!text.trim()) return;

    try {
      setError(null);
      
      // Check if it's an expression to graph
      if (text.includes('=') || text.includes('>') || text.includes('<')) {
        const newId = (expressions.length + 1).toString();
        const colorIndex = expressions.length % COLORS.length;
        
        const parsed = parseFunction(text);
        let sliderValue: number | undefined;
        let sliderRange: { min: number; max: number; step: number } | undefined;
        let derivative: string | undefined;
        let tableData: TablePoint[] | undefined;

        if (parsed.type === 'function') {
          derivative = calculateDerivative(parsed.expression);
          tableData = generateTableData(parsed.expression, -5, 5, 11);
        } else if (text.includes('=') && !text.includes('y=')) {
          const [name, value] = text.split('=');
          sliderValue = Number(value) || 0;
          sliderRange = { min: -10, max: 10, step: 0.1 };
        }

        const newExp: Expression = {
          id: newId,
          text,
          color: COLORS[colorIndex],
          isVisible: true,
          type: parsed.type === 'implicit' ? 'function' : parsed.type,
          sliderValue,
          sliderRange,
          derivative,
          tableData
        };

        setExpressions([...expressions, newExp]);
        setInput('');
      } else {
        // It's a calculation
        const variables = Object.fromEntries(
          expressions
            .filter(exp => exp.type === 'slider')
            .map(slider => [
              slider.text.split('=')[0].trim(),
              slider.sliderValue || 0
            ])
        );

        const calculatedResult = evaluateExpression(text, variables, useRadians);
        const formattedResult = Number.isInteger(calculatedResult) 
          ? calculatedResult.toString() 
          : calculatedResult.toFixed(6);
        
        setResult(formattedResult);
        setHistory(prev => [...prev, { expression: text, result: formattedResult }]);
        setInput('');
      }
    } catch (error) {
      console.error('Error processing input:', error);
      setError('Invalid input');
      setResult('Error');
    }
  };

  const toggleAnimation = (id: string) => {
    setExpressions(expressions.map(exp => {
      if (exp.id === id && exp.type === 'slider') {
        const isCurrentlyAnimating = exp.isAnimating || false;
        
        if (isCurrentlyAnimating) {
          // Stop animation
          if (animationRef.current[id]) {
            clearInterval(animationRef.current[id]);
            delete animationRef.current[id];
          }
        } else {
          // Start animation
          const speed = exp.animationSpeed || 50;
          const range = exp.sliderRange || { min: -10, max: 10, step: 0.1 };
          let value = exp.sliderValue || range.min;
          
          animationRef.current[id] = setInterval(() => {
            value += range.step;
            if (value > range.max) value = range.min;
            
            updateSliderValue(id, value);
          }, speed);
        }
        
        return { ...exp, isAnimating: !isCurrentlyAnimating };
      }
      return exp;
    }));
  };

  const toggleExpressionVisibility = (id: string) => {
    setExpressions(expressions.map(exp =>
      exp.id === id ? { ...exp, isVisible: !exp.isVisible } : exp
    ));
  };

  const deleteExpression = (id: string) => {
    setExpressions(expressions.filter(exp => exp.id !== id));
  };

  const updateExpression = (id: string, newText: string) => {
    try {
      setError(null);
      const parsed = parseFunction(newText);
      const exp = expressions.find(e => e.id === id);
      if (!exp) return;

      let derivative: string | undefined;
      let tableData: TablePoint[] | undefined;

      if (parsed.type === 'function') {
        derivative = calculateDerivative(parsed.expression);
        tableData = generateTableData(parsed.expression, -5, 5, 11);
      }

      setExpressions(expressions.map(exp => {
        if (exp.id === id) {
          return {
            ...exp,
            text: newText,
            type: parsed.type === 'implicit' ? 'function' : parsed.type,
            derivative,
            tableData
          };
        }
        return exp;
      }));
    } catch (error) {
      console.error('Error updating expression:', error);
    }
  };

  const updateSliderValue = (id: string, value: number) => {
    setExpressions(expressions.map(exp =>
      exp.id === id ? { ...exp, sliderValue: value } : exp
    ));
  };

  const evaluateExpressionAtPoint = (expression: string, x: number = 0): string => {
    try {
      const result = evaluateExpression(expression, { x }, useRadians);
      return Number.isInteger(result) ? result.toString() : result.toFixed(4);
    } catch {
      return '...';
    }
  };

  return {
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
  };
} 