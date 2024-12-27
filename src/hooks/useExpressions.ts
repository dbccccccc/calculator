import { useState, useRef } from 'react';
import { Expression } from '../types/calculator';
import { parseFunction, findDerivative, evaluateExpression } from '../utils/mathParser';

const COLORS = ['#c74440', '#2d70b3', '#388c46', '#6042a6', '#000000', '#b74c76'];

export const useExpressions = (useRadians: boolean) => {
  const [expressions, setExpressions] = useState<Expression[]>([
    { id: '1', text: 'x + 2', color: COLORS[0], isVisible: true, type: 'function' },
    { id: '2', text: '2', color: COLORS[1], isVisible: true, type: 'function' },
  ]);
  const [selectedExpression, setSelectedExpression] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const generateTableData = (expression: string, min: number, max: number, points: number) => {
    const data: { x: number; y: number }[] = [];
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

  const addExpression = (newExpression: string) => {
    if (newExpression.trim()) {
      try {
        setError(null);
        const newId = (expressions.length + 1).toString();
        const colorIndex = expressions.length % COLORS.length;
        
        const parsed = parseFunction(newExpression);
        let sliderValue: number | undefined;
        let sliderRange: { min: number; max: number; step: number } | undefined;
        let derivative: string | undefined;
        let tableData: { x: number; y: number }[] | undefined;

        if (parsed.type === 'function') {
          derivative = calculateDerivative(parsed.expression);
          tableData = generateTableData(parsed.expression, -5, 5, 11);
        } else if (newExpression.includes('=') && !newExpression.includes('y=')) {
          const [name, value] = newExpression.split('=');
          sliderValue = Number(value) || 0;
          sliderRange = { min: -10, max: 10, step: 0.1 };
        }

        const newExp: Expression = {
          id: newId,
          text: newExpression,
          color: COLORS[colorIndex],
          isVisible: true,
          type: parsed.type === 'implicit' ? 'function' : parsed.type,
          sliderValue,
          sliderRange,
          derivative,
          tableData
        };

        setExpressions([...expressions, newExp]);
        return true;
      } catch (error) {
        setError('Invalid expression');
        console.error('Error adding expression:', error);
        return false;
      }
    }
    return false;
  };

  const updateExpression = (id: string, newText: string) => {
    try {
      setError(null);
      const parsed = parseFunction(newText);
      const exp = expressions.find(e => e.id === id);
      if (!exp) return;

      let derivative: string | undefined;
      let tableData: { x: number; y: number }[] | undefined;

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

  const toggleExpressionVisibility = (id: string) => {
    setExpressions(expressions.map(exp =>
      exp.id === id ? { ...exp, isVisible: !exp.isVisible } : exp
    ));
  };

  const deleteExpression = (id: string) => {
    setExpressions(expressions.filter(exp => exp.id !== id));
  };

  const updateSliderValue = (id: string, value: number) => {
    setExpressions(expressions.map(exp =>
      exp.id === id ? { ...exp, sliderValue: value } : exp
    ));
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

  const evaluateExpressionAtPoint = (expression: string, x: number = 0): string => {
    try {
      const result = evaluateExpression(expression, { x }, useRadians);
      return Number.isInteger(result) ? result.toString() : result.toFixed(4);
    } catch {
      return '...';
    }
  };

  return {
    expressions,
    selectedExpression,
    showTable,
    error,
    setSelectedExpression,
    setShowTable,
    addExpression,
    updateExpression,
    toggleExpressionVisibility,
    deleteExpression,
    updateSliderValue,
    toggleAnimation,
    evaluateExpressionAtPoint,
  };
};

export default useExpressions; 