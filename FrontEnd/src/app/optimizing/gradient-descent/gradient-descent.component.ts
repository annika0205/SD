import { Component } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { GradientDescentService } from './gradient-descent-service';
import { ChartService } from '../../sorting/services/chart.service';

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
  
  constructor(
    private gradientDescentService: GradientDescentService,
    private chartService: ChartService
  ) {}
  
  ngAfterViewInit() {
    this.initializeChart();
  }
  
  initializeChart() {
    const xValues = Array.from({length: 61}, (_, i) => -3 + (i * 0.1));
    const yValues = this.calculateYValues(xValues, this.function);
    this.chartService.createLineChart('myChart', xValues, yValues);
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
  
  onClick() {
    if (!this.inputs.every(x => x=="")) {
      this.function = this.inputs.map(num => parseInt(num.trim(), 10) || 0);
    }
    
    this.gradient();
    
    const startX = parseFloat(this.parameters[0]);
    const alpha = parseFloat(this.parameters[1]);
    const steps = parseInt(this.parameters[2], 10);
    
    this.updateChart();
    
    this.gradientDescentService.gradientDescent(
      this.function, 
      this.differential, 
      startX, 
      alpha, 
      steps, 
      this.chartService
    );
  }
  
  updateChart() {
    const xValues = Array.from({length: 61}, (_, i) => -3 + (i * 0.1));
    const yValues = this.calculateYValues(xValues, this.function);
    this.chartService.updateChart_xy(xValues, yValues);
  }
  
  gradient() {
    this.differential = new Array(this.function.length - 1).fill(0);
    for (let i = 0; i < this.differential.length; i++) {
      const power = this.function.length - 1 - i;
      if (power > 0) {
        this.differential[i] = this.function[i] * power;
      }
    }
  }
}