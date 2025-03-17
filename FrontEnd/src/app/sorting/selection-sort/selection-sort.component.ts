import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { SelectionSortService } from './selection-sort-service';
import { ChartService } from '../services/chart.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-selection-sort',
  templateUrl: './selection-sort.component.html',
  styleUrls: ['./selection-sort.component.css'],
  providers: [SelectionSortService]
})
export class SelectionSortComponent implements AfterViewInit {
  constructor(
    private selectionSortService: SelectionSortService,
    private chartService: ChartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  sidebarOpen = false;
  inputs: string[] = ["", "", "", "", ""];

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  input_values = "";
  starting_values = [1, 2, 3, 4, 5];
  finishes_values: number[] = [];

  ngAfterViewInit(): void {
    // Only execute in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.chartService.createChart('myChart', this.starting_values, this.starting_values);
    }
  }

  sortMode: "min" | "max" = "max"; // Standardwert ist "max"

  onClick(): void {
    
    console.log(this.inputs);
    this.starting_values = this.inputs.map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));  // Filtert ungültige Zahlen raus (NaN)
    console.log("Die Startwerte sind", this.starting_values);
    this.chartService.updateChart(this.starting_values, 0, 0);

    this.selectionSortService.sort([...this.starting_values], this.sortMode);

    for (let i = 0; i < this.starting_values.length; i++) {
      setTimeout(() => {
        this.finishes_values = this.selectionSortService.getStep(i);
        this.chartService.updateChart(this.finishes_values, 1, 3);
      }, i * 1000);
    }
  }

  onSortModeChange(mode: "min" | "max"): void {
    this.sortMode = mode;
    console.log(`Sortiermodus geändert: ${this.sortMode}`);
  }
}
