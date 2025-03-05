import { Injectable } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private chart: Chart | null = null;

  createChart(canvasId: string, labels: number[], data: number[]): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas not found!');
      return;
    }

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            backgroundColor: 'rgb(47, 142, 205)',
            data: data
          }
        ]
      },
      options: {}
    });
  }

  updateChart(data: number[]): void {
    if (this.chart) {
      this.chart.data.labels = data;
      this.chart.data.datasets[0].data = data;
      this.chart.update();
    }
  }
}
