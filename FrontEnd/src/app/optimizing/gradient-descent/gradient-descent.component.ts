import { Component } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { GradientDescentService } from './gradient-descent-service';
import { ChartService } from '../../sorting/services/chart.service'

@Component({
  selector: 'app-gradient-descent',
  templateUrl: './gradient-descent.component.html',
  styleUrls: ['./gradient-descent.component.css']
})
export class GradientDescentComponent implements AfterViewInit {
  predefinedTexts: string[] = [];
  parameters: string[] = ["-3", "0.8", "30"];
  inputs: string[] = ["", "", "", "", "", "", ""];  // 7 inputs for quadratic function in 2D
  function: number[] = [0, 0, 1, 0, 0]; // x^2 as default function for 1D
  differential: number[] = [0, 0, 2, 0]; // 2x as default derivative for 1D case
  alpha: number = 0.001;
  steps: number = 30;
  termination: number = 0.1;
  startX: number = -3;
  startY: number = -3;  // Add startY for 2D mode
  graphMode: '1D' | '2D' = '1D';
  foundPoint: number | null = null;
  foundPoint2D: {x: number, y: number} | null = null;
  errorMessage: string | null = null;
  useLineSearch: boolean = false;
  foundAlpha: number | null = null;
  gradientAtPoint: number | null = null;
  gradientAtPoint2D: {x: number, y: number} | null = null;

  constructor(
    private gradientDescentService: GradientDescentService,
    private chartService: ChartService
  ) {
    this.updatePredefinedTexts(5);
  }
  
  ngAfterViewInit() {
    if (this.graphMode === '1D') {
      this.function = [0, 0, 1, 0, 0]; // Ensure x^2 is default for 1D
    } else {
      this.function = [1, 1, 0, 0, 0]; // x^2 + y^2 as default for 2D
    }
    this.initializeChart();
    // Only initialize 3D chart if in 2D mode
    if (this.graphMode === '2D') {
      // Use setTimeout to ensure the DOM is ready
      setTimeout(() => {
        this.initialize3DChart();
      }, 100);
    }
  }
  
  toggleMode(event: any) {
    this.useLineSearch = event.target.checked;
    console.log("Line Search " + (this.useLineSearch ? "aktiviert" : "deaktiviert"));
  }

  initializeChart() {
    const xValues = Array.from({length: 61}, (_, i) => -3 + (i * 0.1));
    const yValues = this.calculateYValues(xValues, this.function);
    this.chartService.createLineChart('myChart', xValues, yValues);
  }
  
  initialize3DChart() {
    // Check if the element exists first
    if (!document.getElementById('plot3d')) {
      console.warn('plot3d element not found in the DOM');
      return;
    }
    
    const xRange = Array.from({length: 50}, (_, i) => -5 + (i * 0.2));
    const yRange = Array.from({length: 50}, (_, i) => -5 + (i * 0.2));

    let [x, y, c] = this.seperateFunction2D(this.function);
    const func = (pos_x: number, pos_y: number) => this.evalFunction2D(pos_x, pos_y, x, y, c);
    
    // Create or update the 3D plot
    this.chartService.create3DPlot('plot3d', xRange, yRange, func);
  }
  
  testGradientPath() {
    // Testpunkte für eine Spirale zum Minimum
    const testPoints = [
      { x: -3.0000, y: -3.0000, z: Math.pow(-3.0000, 2) + Math.pow(-3.0000, 2) },
      { x: -2.4000, y: -2.4000, z: Math.pow(-2.4000, 2) + Math.pow(-2.4000, 2) },
      { x: -1.9200, y: -1.9200, z: Math.pow(-1.9200, 2) + Math.pow(-1.9200, 2) },
      { x: -1.5360, y: -1.5360, z: Math.pow(-1.5360, 2) + Math.pow(-1.5360, 2) },
      { x: -1.2288, y: -1.2288, z: Math.pow(-1.2288, 2) + Math.pow(-1.2288, 2) },
      { x: -0.9830, y: -0.9830, z: Math.pow(-0.9830, 2) + Math.pow(-0.9830, 2) },
      { x: -0.7864, y: -0.7864, z: Math.pow(-0.7864, 2) + Math.pow(-0.7864, 2) },
      { x: -0.6291, y: -0.6291, z: Math.pow(-0.6291, 2) + Math.pow(-0.6291, 2) },
      { x: -0.5033, y: -0.5033, z: Math.pow(-0.5033, 2) + Math.pow(-0.5033, 2) },
      { x: -0.4027, y: -0.4027, z: Math.pow(-0.4027, 2) + Math.pow(-0.4027, 2) },
      { x: -0.3221, y: -0.3221, z: Math.pow(-0.3221, 2) + Math.pow(-0.3221, 2) },
      { x: -0.2577, y: -0.2577, z: Math.pow(-0.2577, 2) + Math.pow(-0.2577, 2) },
      { x: -0.2062, y: -0.2062, z: Math.pow(-0.2062, 2) + Math.pow(-0.2062, 2) },
      { x: -0.1649, y: -0.1649, z: Math.pow(-0.1649, 2) + Math.pow(-0.1649, 2) },
      { x: -0.1319, y: -0.1319, z: Math.pow(-0.1319, 2) + Math.pow(-0.1319, 2) },
      { x: -0.1056, y: -0.1056, z: Math.pow(-0.1056, 2) + Math.pow(-0.1056, 2) },
      { x: -0.0844, y: -0.0844, z: Math.pow(-0.0844, 2) + Math.pow(-0.0844, 2) },
      { x: -0.0676, y: -0.0676, z: Math.pow(-0.0676, 2) + Math.pow(-0.0676, 2) },
      { x: -0.0540, y: -0.0540, z: Math.pow(-0.0540, 2) + Math.pow(-0.0540, 2) },
      { x: -0.0432, y: -0.0432, z: Math.pow(-0.0432, 2) + Math.pow(-0.0432, 2) }
    ];
    
    setTimeout(() => {
      this.chartService.updateGradient3DPath('plot3d', testPoints);
    }, 100);
  }

  calculateYValues(xValues: number[], coefficients: number[]): number[] {
    return xValues.map(x => {
      let result = 0;
      for (let i = 0; i < coefficients.length; i++) {
        result += coefficients[i] * Math.pow(x, coefficients.length - 1 - i);
      }
      return result;
    });
  }
  
  validateAlpha() {
    if (this.alpha < 0 || this.alpha > 1) {
      this.alpha = 0.1;
      console.log('Alpha must be between 0 and 1. Default value 0.1 is used.');
    } 
  }

  setGraphMode(mode: '1D' | '2D') {
    this.graphMode = mode;
    
    // Set default function based on mode
    if (mode === '1D') {
      this.function = [0, 0, 1, 0, 0]; // x^2 as default for 1D
      this.inputs = ["", "", "1", "", ""]; // Set inputs to match x^2
    } else {
      this.function = [1, 1, 0, 0, 0]; // x^2 + y^2 as default for 2D
      this.inputs = ["1", "1", "", "", ""]; // Set inputs to match x^2 + y^2
    }
    
    // Use setTimeout to ensure the DOM is updated before trying to access elements
    setTimeout(() => {
      if (mode === '1D') {
        this.initializeChart();
      } else {
        this.initialize3DChart();
      }
    }, 100);
    this.updatePredefinedTexts(this.inputs.length);
  }

  onClick() {
    this.errorMessage = null;  // Reset error message
    this.foundAlpha = null;  // Reset found alpha
    this.gradientAtPoint = null;
    this.foundPoint = null;
    this.foundPoint2D = null;
    this.gradientAtPoint2D = null;
    this.validateAlpha();

    if (!this.inputs.every(x => x=="")) {
      this.function = this.inputs.map(num => parseInt(num.trim(), 10) || 0);
    }
    
    if (this.graphMode === '1D') {
      this.updateChart();
      
      this.gradientDescentService.gradientDescent(
        this.function, 
        this.startX, 
        this.alpha, 
        this.steps, 
        this.chartService,
        (point) => {
          this.foundPoint = point;
          this.gradientAtPoint = this.calculateGradient(point);
        },
        (error) => this.errorMessage = error,
        this.useLineSearch,
        (alpha) => this.foundAlpha = alpha,
        this.termination
      );
    } else {
      // For 2D mode, reinitialize the 3D chart with the new function
      this.initialize3DChart();
      
      // Call the 2D gradient descent
      this.gradientDescentService.gradientDescent2D(
        this.function,
        { x: this.startX, y: this.startY },  // Use both startX and startY
        this.alpha,
        this.steps,
        this.chartService,
        (point) => {
          this.foundPoint2D = point;
        },
        (gradient) => {
          this.gradientAtPoint2D = gradient;
        },
        (error) => this.errorMessage = error,
        this.useLineSearch,
        (alpha) => this.foundAlpha = alpha,
        this.termination
      );
    }
  }
  
  updateChart() {
    const xValues = Array.from({length: 61}, (_, i) => -3 + (i * 0.1));
    const yValues = this.calculateYValues(xValues, this.function);
    this.chartService.updateChart_xy(xValues, yValues);
  }
  
  updatePredefinedTexts(inputCount: number) {
    this.predefinedTexts = [];
    if (inputCount <= 0) {
      return;
    }
  
    let terms: string[] = [];
    let termCount = 0;
    
    if (this.graphMode === '2D') {
      // For 2D, start with power = 2 (quadratic terms)
      let i = 2; 
      while (termCount < inputCount - 1) {
        if (termCount < inputCount - 1) {
          terms.push(`x<sup>${i}</sup> +`);
          termCount++;
        }
        if (termCount < inputCount - 1) {
          terms.push(`y<sup>${i}</sup> +`);
          termCount++;
        }
        i--;
        if (i < 1) break; // Stop at linear terms
      }
    } else {
      // For 1D, start with highest power and go down
      let i = inputCount - 1;
      while (termCount < inputCount - 1) {
        terms.push(`x<sup>${i}</sup> +`);
        termCount++;
        i--;
      }
    }
  
    this.predefinedTexts = terms;
    this.predefinedTexts.push(`x<sup>0</sup>`);
  }
  
  onInputCountChanged(newInputs: string[]) {
    this.inputs = newInputs;
  }
  
  onAddInput(inputs: string[]): void {
    console.log('Input added in gradient descent component');
    this.updatePredefinedTexts(inputs.length);
  }

  onRemoveInput(inputs: string[]): void {
    console.log('Input removed in gradient descent component');
    this.updatePredefinedTexts(inputs.length);
  }

  calculateGradient(x: number): number {
    return this.differential.reduce((acc, val, index) => 
      acc + val * Math.pow(x, this.differential.length-1-index), 0);
  }

  seperateFunction2D(_func: number[]): [number[], number[], number] {
    return this.gradientDescentService.parseFunction2D(_func);
  }

  evalFunction2D(pos_x: number, pos_y: number, x: number[], y: number[], c: number): number {
    return this.gradientDescentService.evaluateFunction2D(pos_x, pos_y, x, y, c);
  }

  evalGradient2D(pos_x: number, pos_y: number): {x: number, y: number} {
    const gradX = this.gradientDescentService.evaluateGradientComponent(pos_x, this.gradientDescentService.differential2D[0]);
    const gradY = this.gradientDescentService.evaluateGradientComponent(pos_y, this.gradientDescentService.differential2D[1]);
    return {x: gradX, y: gradY};
  }
}