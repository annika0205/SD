import { Component, AfterViewInit } from '@angular/core';
import { BubbleSortService } from './bubblesort-service';
import { ChartService } from '../services/chart.service';
import { TemplateSortingComponent } from '../template-sorting/template-sorting.component';

@Component({
  selector: 'app-bubblesort',
  templateUrl: './bubblesort.component.html',
  styleUrl: './bubblesort.component.css',
  providers: [BubbleSortService]
})
export class BubblesortComponent implements AfterViewInit{
   constructor(
      private bubbleSortService: BubbleSortService,
      private chartService: ChartService
    ) {}
  sidebarOpen = false;
  inputs: string[] = ["", "", "", "", ""];

  input_values = "";
  starting_values = [1, 2, 3, 4, 5];
  finishes_values: number[] = [];

  ngAfterViewInit(): void {
    this.chartService.createChart('myChart', this.starting_values, this.starting_values);
 // Beim Laden schon die Standardwerte verarbeiten
  }

  sortMode: "min" | "max" = "min";

  onClick(): void {
    
    console.log(this.inputs);
    this.starting_values = this.inputs.map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));  // Filtert ungültige Zahlen raus (NaN)
    console.log("Die Startwerte sind", this.starting_values);
    this.chartService.updateChart(this.starting_values, 0, 0);

    this.bubbleSortService.sort([...this.starting_values], this.sortMode);

    for (let i = 0; i < this.starting_values.length; i++) {
      setTimeout(() => {
        this.finishes_values = this.bubbleSortService.getStep(i);
        this.chartService.updateChart(this.finishes_values, 1, 3);
      }, i * 1000);
    }
  }
  

  onSortModeChange(mode: "min" | "max"): void {
    this.sortMode = mode;
    console.log(`Sortiermodus geändert: ${this.sortMode}`);
  }
}
