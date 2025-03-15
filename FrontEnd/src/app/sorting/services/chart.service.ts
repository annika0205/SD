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

  updateChart(data: number[], index1: number, index2: number): void {
    if (this.chart) {
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
}
