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
  exponents = [4, 3, 2, 1, 0];
  predefinedTexts = ['x^4', 'x^3', 'x^2', 'x', ''];
  inputArray = Array(5).fill('');  // Initialize with 5 empty inputs
  inputs: string[] = ["-3", "0.8", "30"];

  constructor(
    private gradientDescentService: GradientDescentService,
    private chartService: ChartService
  ) {}

  ngAfterViewInit() {
    this.initializeChart();
  }

  initializeChart() {
    const xValues = Array.from({length: 61}, (_, i) => -3 + (i * 0.1));
    const yValues = xValues.map(x => this.gradientDescentService.func(x));
    this.chartService.createLineChart('myChart', xValues, yValues);
  }

  onClick() {
    const startX = parseFloat(this.inputs[0]);
    const alpha = parseFloat(this.inputs[1]);
    const steps = parseInt(this.inputs[2], 10);
    this.gradientDescentService.gradientDescent(startX, alpha, steps, this.chartService);
  }

  gradient(x: number): number {
    return 2 * x;
  }
}
