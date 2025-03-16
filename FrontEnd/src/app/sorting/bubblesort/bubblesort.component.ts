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

  sortMode: "min" | "max" = "max"; // Standardwert ist "max"

  onClick(): void {
    console.log(this.inputs);
  }
  

  onSortModeChange(mode: "min" | "max"): void {
    this.sortMode = mode;
    console.log(`Sortiermodus geändert: ${this.sortMode}`);
  }
}
