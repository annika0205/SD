import { Component, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { SelectionSortService } from './selection-sort-service';


Chart.register(...registerables);
@Component({
  selector: 'app-selection-sort',
  templateUrl: './selection-sort.component.html',
  styleUrl: './selection-sort.component.css',
  providers: [SelectionSortService]
})

export class SelectionSortComponent implements AfterViewInit{
  constructor(private selectionSortService: SelectionSortService){}
  starting_values = [8, 2, 7, 4, 5, 1, 6];
  finishes_values: number[] = [];
  ngAfterViewInit(): void {
    var xValues = this.starting_values;
    var yValues = this.starting_values;
    
    const canvas = document.getElementById("myChart") as HTMLCanvasElement;

    const myChart = new Chart("myChart", {
      type: "bar",
      data: {
        labels: xValues,
        datasets: [
          {
            backgroundColor: 'rgb(47, 142, 205)',
            data: yValues
          }
        ]
      },
      options: {
      }
    });
    const sortedArray = this.selectionSortService.sort([2, 10, 7, 4, 5, 1, 6]);
    for (let i = 0; i < this.starting_values.length; i++) {
      setTimeout(
        (i) => {
          this.finishes_values = this.selectionSortService.getStep(i);
    
          // Aktualisiere die Daten des Diagramms
          myChart.data.labels = this.finishes_values;
          myChart.data.datasets[0].data = this.finishes_values;
    
          // Zeichne das Diagramm neu
          myChart.update();
        },
        i * 1000, // 1 Sekunde Verzögerung pro Schritt
        i // Übergabe des Werts von i
      );
    }
    }
  }

