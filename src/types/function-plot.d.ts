declare module 'function-plot' {
  interface FunctionPlotOptions {
    target: string | HTMLElement;
    width?: number;
    height?: number;
    title?: string;
    grid?: boolean;
    data: Array<{
      fn: string;
      color?: string;
      graphType?: 'polyline' | 'scatter';
      range?: [number, number];
    }>;
    xAxis?: {
      domain?: [number, number];
      label?: string;
    };
    yAxis?: {
      domain?: [number, number];
      label?: string;
    };
    disableZoom?: boolean;
    tip?: {
      xLine?: boolean;
      yLine?: boolean;
    };
  }

  function functionPlot(options: FunctionPlotOptions): void;
  export default functionPlot;
} 