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
    const yValues = xValues.map(x => this.gradientDescentService.func(x));
    this.chartService.createLineChart('myChart', xValues, yValues);
  }

  onClick() {
    const startX = parseFloat(this.parameters[0]);
    const alpha = parseFloat(this.parameters[1]);
    const steps = parseInt(this.parameters[2], 10);
    this.gradientDescentService.gradientDescent(startX, alpha, steps, this.chartService);
  }

  gradient(x: number): number[] {
    console.log(this.inputs);
    this.function = this.inputs.map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
    for (let i = this.differential.length-1; i >0; i--){
      this.differential[i] = this.function[i+1] * this.differential.length-i;
    }
    return this.differential;
  }
}
