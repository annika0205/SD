import { Component } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { GradientDescentService } from './gradient-descent-service';
import { ChartService } from '../../sorting/services/chart.service'
//gucken, welche Module wirklich benötigt werden von Plotly

@Component({
  selector: 'app-gradient-descent',
  templateUrl: './gradient-descent.component.html',
  styleUrls: ['./gradient-descent.component.css']
})
export class GradientDescentComponent implements AfterViewInit {
  predefinedTexts: string[] = [];
  parameters: string[] = ["-3", "0.8", "30"];
  inputs: string[] = ["", "", "", "", ""];
  function: number[] = [0, 0, 1, 0, 0]; //x^2 als startfunktion
  differential: number[] = [0, 0, 2, 0]; //2x als Startableitung
  //üblicherweise werte zwischen 10^-1 und 10^-4
  alpha : number = 0.001;
  steps : number = 30;
  termination: number = 0.1;
  startX: number = -3;
  graphMode: '1D' | '2D' = '1D';
  foundPoint: number | null = null;
  errorMessage: string | null = null;  // neue Property
  useLineSearch: boolean = false;
  foundAlpha: number | null = null;

  //Alpha bestimmen
  //Backtraking: Alpha wird so lange halbiert, bis f(x1)<f(x0) gilt
  constructor(
    private gradientDescentService: GradientDescentService,
    private chartService: ChartService
    
  ) {
    this.updatePredefinedTexts(5); // Initial 5 inputs
  }
  
  ngAfterViewInit() {
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
    const paraboloid = (x: number, y: number) => x*x + y*y;
    this.chartService.create3DPlot('plot3d', xRange, yRange, paraboloid);
    
    // Test path after Plot-Initialization with a delay
    setTimeout(() => {
      this.testGradientPath();
    }, 200);
  }

  testGradientPath() {
    // Testpunkte für eine Spirale zum Minimum
    //gefundener Punkt noch ausgeben lassen
    
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
    
    // Use setTimeout to ensure the DOM is updated before trying to access elements
    setTimeout(() => {
      if (mode === '1D') {
        this.initializeChart();
      } else {
        this.initialize3DChart();
      }
    }, 100);
  }

  onClick() {
    this.errorMessage = null;  // Reset error message
    this.foundAlpha = null;  // Reset found alpha
    this.validateAlpha();

    if (!this.inputs.every(x => x=="")) {
      this.function = this.inputs.map(num => parseInt(num.trim(), 10) || 0);
    }
    
    
 //   const startX = parseFloat(this.parameters[0]);
 //   const alpha = parseFloat(this.parameters[1]);
 //   const steps = parseInt(this.parameters[2], 10);
    
    this.updateChart();
    
    this.gradientDescentService.gradientDescent(
      this.function, 
      this.startX, 
      this.alpha, 
      this.steps, 
      this.chartService,
      (point) => this.foundPoint = point,
      (error) => this.errorMessage = error,  // neuer callback
      this.useLineSearch,  // Add this parameter
      (alpha) => this.foundAlpha = alpha  // New callback for alpha
    );
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
  
    this.predefinedTexts = ['1'];
  
    let termCount = 1;
    let i = 1;
  
    while (termCount < inputCount) {
      if (termCount < inputCount) {
        this.predefinedTexts.push(`x<sup>${i}</sup>`);
        termCount++;
      }
      if (termCount < inputCount) {
        this.predefinedTexts.push(`y<sup>${i}</sup>`);
        termCount++;
      }
      i++;
    }

    this.predefinedTexts = this.predefinedTexts.reverse()
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
}