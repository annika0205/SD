import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';

Chart.register(...registerables);

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  
  private chart: Chart | null = null;

  createChart(canvasId: string, labels: number[], data: number[]): void {
    // Only execute in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
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
            label: "HierSuchen",
            backgroundColor: 'rgb(47, 142, 205)',
            data: data
          }
        ]
      },
      options: {
        layout: {
          padding: {
            left: 20,   // Abstand links
            right: 20   // Abstand rechts
          }
        }
      }
    });
  }

  createLineChart(canvasId: string, xValues: number[], yValues: number[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas not found!');
      return;
    }

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: xValues,
        datasets: [{
          label: 'Function',
          data: yValues,
          borderColor: 'blue',
          fill: false
        },
        {
          label: 'Gradient Descent',
          data: [],
          borderColor: 'red',
          fill: false,
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        animation: {
          duration: 0 // Disable all animations
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom'
          }
        }
      }
    });
  }

  updateGradientPath(points: {x: number, y: number}[]): void {
    if (!isPlatformBrowser(this.platformId) || !this.chart) {
      return;
    }

    this.chart.data.datasets[1].data = points;
    this.chart.update();
  }

  updateChart(data: number[], index1: number, index2: number): void {
    // Only execute in browser environment
    if (!isPlatformBrowser(this.platformId) || !this.chart) {
      return;
    }
    
    this.chart.data.labels = data;
    this.chart.data.datasets[0].data = data;
    this.chart.data.datasets[0].backgroundColor = 'rgb(6, 50, 114)'
    const backgroundColors = data.map((_, index) => {
      // Setze die Farbe für die Balken zwischen index1 und index2
      if (index >= index1 && index <= index2) {
        return 'rgb(6, 50, 114)';
      }
      return 'rgba(0, 0, 0, 0.1)';  // Beispiel für eine andere Farbe
    });
    
    // Wende die Hintergrundfarben auf das Dataset an
    this.chart.data.datasets[0].backgroundColor = backgroundColors;
    this.chart.update();
    
  }
}
