import { Component, AfterViewInit } from '@angular/core';
import { SelectionSortService } from './selection-sort-service';
import { ChartService } from '../services/chart.service';

@Component({
  selector: 'app-selection-sort',
  templateUrl: './selection-sort.component.html',
  styleUrl: './selection-sort.component.css',
  providers: [SelectionSortService]
})
export class SelectionSortComponent implements AfterViewInit {
  constructor(
    private selectionSortService: SelectionSortService,
    private chartService: ChartService
  ) {}
  input_values = "";
  starting_values = [1, 2, 3, 4, 5];
  finishes_values: number[] = [];

  ngAfterViewInit(): void {
    this.chartService.createChart('myChart', this.starting_values, this.starting_values);
 // Beim Laden schon die Standardwerte verarbeiten
  }

  onClick(): void {
    
    console.log(this.input_values);
    this.starting_values = this.input_values.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));  // Filtert ungültige Zahlen raus (NaN)
    console.log("Die Startwerte sind", this.starting_values);
    this.chartService.updateChart(this.starting_values);

    this.selectionSortService.sort([...this.starting_values], "max");

    for (let i = 0; i < this.starting_values.length; i++) {
      setTimeout(() => {
        this.finishes_values = this.selectionSortService.getStep(i);
        this.chartService.updateChart(this.finishes_values);
      }, i * 1000);
    }
  }
}
