// Mathematical constants
export const CONSTANTS = {
  pi: Math.PI,
  e: Math.E,
  phi: (1 + Math.sqrt(5)) / 2, // golden ratio
};

// Mathematical functions
export const MATH_FUNCTIONS = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  abs: Math.abs,
  log: Math.log,
  log10: Math.log10,
  log2: Math.log2,
  exp: Math.exp,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  sign: Math.sign,
};

// Helper function to convert degrees to radians
const toRadians = (degrees: number) => degrees * (Math.PI / 180);

// Helper function to convert radians to degrees
const toDegrees = (radians: number) => radians * (180 / Math.PI);

export const processExpression = (
  expression: string,
  variables: Record<string, number> = {},
  useRadians = true
): string => {
  let processedExp = expression
    // Replace constants
    .replace(/\bpi\b/g, CONSTANTS.pi.toString())
    .replace(/\be\b/g, CONSTANTS.e.toString())
    .replace(/\bphi\b/g, CONSTANTS.phi.toString())
    // Replace power operator
    .replace(/\^/g, '**')
    // Replace trigonometric functions if using degrees
    .replace(/sin\(/g, `Math.sin(${useRadians ? '' : 'toRadians('}`)
    .replace(/cos\(/g, `Math.cos(${useRadians ? '' : 'toRadians('}`)
    .replace(/tan\(/g, `Math.tan(${useRadians ? '' : 'toRadians('}`)
    // Replace other mathematical functions
    .replace(/asin\(/g, `${useRadians ? 'Math.asin(' : 'toDegrees(Math.asin('}`)
    .replace(/acos\(/g, `${useRadians ? 'Math.acos(' : 'toDegrees(Math.acos('}`)
    .replace(/atan\(/g, `${useRadians ? 'Math.atan(' : 'toDegrees(Math.atan('}`)
    .replace(/sinh\(/g, 'Math.sinh(')
    .replace(/cosh\(/g, 'Math.cosh(')
    .replace(/tanh\(/g, 'Math.tanh(')
    .replace(/sqrt\(/g, 'Math.sqrt(')
    .replace(/cbrt\(/g, 'Math.cbrt(')
    .replace(/abs\(/g, 'Math.abs(')
    .replace(/log\(/g, 'Math.log(')
    .replace(/log10\(/g, 'Math.log10(')
    .replace(/log2\(/g, 'Math.log2(')
    .replace(/exp\(/g, 'Math.exp(')
    .replace(/floor\(/g, 'Math.floor(')
    .replace(/ceil\(/g, 'Math.ceil(')
    .replace(/round\(/g, 'Math.round(')
    .replace(/sign\(/g, 'Math.sign(');

  // Close parentheses for degree conversions
  if (!useRadians) {
    processedExp = processedExp.replace(/toRadians\((.*?)\)/g, 'toRadians($1))');
  }

  // Replace variables with their values
  Object.entries(variables).forEach(([name, value]) => {
    processedExp = processedExp.replace(new RegExp(`\\b${name}\\b`, 'g'), value.toString());
  });

  return processedExp;
};

export const evaluateExpression = (
  expression: string,
  variables: Record<string, number> = {},
  useRadians = true
): number => {
  try {
    const processedExp = processExpression(expression, variables, useRadians);
    // Create a function with x as parameter and additional helper functions
    const fn = new Function(
      'x',
      'toRadians',
      'toDegrees',
      `return ${processedExp}`
    );
    return fn(variables.x || 0, toRadians, toDegrees);
  } catch (error) {
    console.error('Error evaluating expression:', error);
    throw error;
  }
};

export const parseFunction = (expression: string): {
  type: 'function' | 'point' | 'inequality' | 'implicit';
  expression: string;
  variables: string[];
} => {
  // Remove whitespace
  expression = expression.replace(/\s+/g, '');

  // Check for point notation (2,3)
  if (/^\([-\d.]+,[-\d.]+\)$/.test(expression)) {
    return {
      type: 'point',
      expression,
      variables: []
    };
  }

  // Check for inequalities
  if (/[<>]=?/.test(expression)) {
    return {
      type: 'inequality',
      expression,
      variables: ['x', 'y']
    };
  }

  // Check for implicit equations (contains both x and y without y=)
  if (!expression.startsWith('y=') && expression.includes('y')) {
    return {
      type: 'implicit',
      expression,
      variables: ['x', 'y']
    };
  }

  // Standard function (y= can be omitted)
  const functionExp = expression.startsWith('y=') ? expression.slice(2) : expression;
  return {
    type: 'function',
    expression: functionExp,
    variables: ['x']
  };
};

export const findDerivative = (expression: string): string => {
  // Basic symbolic differentiation
  const parsed = parseFunction(expression);
  if (parsed.type !== 'function') return 'Not a function';

  const exp = parsed.expression;
  
  // Power rule: x^n -> n*x^(n-1)
  const powerMatch = exp.match(/x\^(\d+)/);
  if (powerMatch) {
    const power = parseInt(powerMatch[1]);
    if (power === 0) return '0';
    if (power === 1) return '1';
    return `${power}*x^${power - 1}`;
  }

  // Basic functions
  if (exp === 'x') return '1';
  if (/^\d+$/.test(exp)) return '0';
  if (exp === 'sin(x)') return 'cos(x)';
  if (exp === 'cos(x)') return '-sin(x)';
  if (exp === 'exp(x)') return 'exp(x)';
  if (exp === 'ln(x)') return '1/x';

  return 'Complex expression';
}; 