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
  predefinedTexts = ['x^4', 'x^3', 'x^2', 'x', ''];
  parameters: string[] = ["-3", "0.8", "30"];
  inputs: string[] = ["", "", "", "", ""];
  function: number[] = [0, 0, 1, 0, 0]; //x^2 als startfunktion
  differential: number[] = [0, 0, 2, 0]; //2x als Startableitung
  //üblicherweise werte zwischen 10^-1 und 10^-4
  alpha : number = 0.001;
  graphMode: '1D' | '2D' = '1D';
  
  //Alpha bestimmen
  //Backtraking: Alpha wird so lange halbiert, bis f(x1)<f(x0) gilt
  constructor(
    private gradientDescentService: GradientDescentService,
    private chartService: ChartService
    
  ) {}
  
  ngAfterViewInit() {
    this.initializeChart();
    this.initialize3DChart();
  }
  
  
  initializeChart() {
    const xValues = Array.from({length: 61}, (_, i) => -3 + (i * 0.1));
    const yValues = this.calculateYValues(xValues, this.function);
    this.chartService.createLineChart('myChart', xValues, yValues);
  }
  
  initialize3DChart() {
    const xRange = Array.from({length: 50}, (_, i) => -5 + (i * 0.2));
    const yRange = Array.from({length: 50}, (_, i) => -5 + (i * 0.2));
    const paraboloid = (x: number, y: number) => x*x + y*y;
    this.chartService.create3DPlot('plot3d', xRange, yRange, paraboloid);
    
    // Test path nach Plot-Initialisierung
    this.testGradientPath();
  }

  testGradientPath() {
    // Testpunkte für eine Spirale zum Minimum
    const testPoints = Array.from({length: 10}, (_, i) => {
      const t = (10 - i) / 2;  // Abnehmender Radius
      return {
        x: t * Math.cos(i),
        y: t * Math.sin(i),
        z: Math.pow(t * Math.cos(i), 2) + Math.pow(t * Math.sin(i), 2)  // z = x² + y²
      };
    });
    
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
      this.alpha = 0.8;
      console.log('Alpha must be between 0 and 1. Default value 0.8 is used.');
    } 
  }

  setGraphMode(mode: '1D' | '2D') {
    this.graphMode = mode;
    if (mode === '1D') {
      setTimeout(() => this.initializeChart(), 0);
    } else {
      setTimeout(() => this.initialize3DChart(), 0);
    }
  }

  onClick() {

    this.validateAlpha();

    if (!this.inputs.every(x => x=="")) {
      this.function = this.inputs.map(num => parseInt(num.trim(), 10) || 0);
    }
    
    
    const startX = parseFloat(this.parameters[0]);
 //   const alpha = parseFloat(this.parameters[1]);
    const steps = parseInt(this.parameters[2], 10);
    
    this.updateChart();
    
    this.gradientDescentService.gradientDescent(
      this.function, 
      startX, 
      this.alpha, 
      steps, 
      this.chartService
    );
  }
  
  updateChart() {
    const xValues = Array.from({length: 61}, (_, i) => -3 + (i * 0.1));
    const yValues = this.calculateYValues(xValues, this.function);
    this.chartService.updateChart_xy(xValues, yValues);
  }
  
  
}