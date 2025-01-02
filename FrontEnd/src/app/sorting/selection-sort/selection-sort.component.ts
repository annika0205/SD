import { Component, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
@Component({
  selector: 'app-selection-sort',
  templateUrl: './selection-sort.component.html',
  styleUrl: './selection-sort.component.css'
})

export class SelectionSortComponent implements AfterViewInit{
  ngAfterViewInit(): void {
    
    var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
    var yValues = [55, 49, 44, 24, 15];
    var barColors = ["red", "green","blue","orange","brown"];
    
    const canvas = document.getElementById("myChart") as HTMLCanvasElement;

      const myChart = new Chart("myChart", {
        type: "bar",
        data: {
          labels: xValues,
          datasets: [
            {
              backgroundColor: barColors,
              data: yValues
            }
          ]
        },
        options: {
        }
      });
    }
  }

