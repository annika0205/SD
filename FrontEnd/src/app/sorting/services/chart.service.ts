import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';
import { Data } from 'plotly.js';

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
          fill: false,
          pointRadius: 0,
          order: 2
        },
        {
          label: 'Gradient Descent',
          data: [],
          borderColor: 'red',
          fill: false,
          pointRadius: 5,
          pointBackgroundColor: 'red',
          order: 1
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

  updateChart_xy(xValues: number[], yValues: number[]): void {
    const chart = this.chart;
    if (chart) {
      chart.data.labels = xValues;
      chart.data.datasets[0].data = yValues;
      chart.update();
    }
  }

  create3DPlot(divId: string, xRange: number[], yRange: number[], f: (x: number, y: number) => number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Check if the element exists before proceeding
    const element = document.getElementById(divId);
    if (!element) {
      console.error(`DOM element with id '${divId}' doesn't exist on the page.`);
      return;
    }

    const xValues = xRange;
    const yValues = yRange;
    const zValues: number[][] = [];

    for (let i = 0; i < xValues.length; i++) {
      zValues[i] = [];
      for (let j = 0; j < yValues.length; j++) {
        zValues[i][j] = f(xValues[i], yValues[j]);
      }
    }

    if (isPlatformBrowser(this.platformId)) {
      import('plotly.js-dist-min').then((Plotly) => {
        const data: Data[] = [{
          type: 'contour' as const,
          x: xValues,
          y: yValues,
          z: zValues,
          colorscale: 'Viridis',
          name: 'Surface'
        }, {
          type: 'scatter',
          mode: 'lines+markers' as const,
          x: [],
          y: [],
          z: [],
          marker: {
            size: 8,
            color: 'red'
          },
          line: {
            color: 'red',
            width: 2
          },
          name: 'Gradient Path'
        }];

        const layout = {
          title: '3D Function Plot',
          autosize: true,
          margin: { l: 20, r: 20, b: 40, t: 40 },
          scene: {
            camera: {
              eye: { x: 1.87, y: 0.88, z: 0.64 }
            }
          },
          paper_bgcolor: "#ddd",
        };

        const config = {
          displayModeBar: false
        };

        Plotly.newPlot(divId, data, layout, config);
      }).catch(error => {
        console.error('Error loading Plotly or creating plot:', error);
      });
    }
  }

  updateGradient3DPath(divId: string, points: {x: number, y: number, z: number}[]): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Check if the element exists before proceeding
    const element = document.getElementById(divId);
    if (!element) {
      console.error(`DOM element with id '${divId}' doesn't exist on the page.`);
      return;
    }

    import('plotly.js-dist-min').then((Plotly) => {
      const update = {
        x: [points.map(p => p.x)],
        y: [points.map(p => p.y)],
        z: [points.map(p => p.z)]
      };

      Plotly.update(divId, update, {}, [1]); // Update nur die zweite Trace (Index 1)
    }).catch(error => {
      console.error('Error updating gradient path:', error);
    });
  }
}
