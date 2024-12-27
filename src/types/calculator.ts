export interface Expression {
  id: string;
  text: string;
  color: string;
  isVisible: boolean;
  type: 'function' | 'inequality' | 'point' | 'slider' | 'table';
  sliderValue?: number;
  sliderRange?: SliderRange;
  isAnimating?: boolean;
  animationSpeed?: number;
  tableData?: TablePoint[];
  derivative?: string;
}

export interface GraphSettings {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  showGrid: boolean;
  showAxes: boolean;
  showDerivatives: boolean;
}

export interface SliderRange {
  min: number;
  max: number;
  step: number;
}

export interface TablePoint {
  x: number;
  y: number;
}

export interface HistoryItem {
  expression: string;
  result: string;
} 