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

  starting_values = [8, 2, 7, 4, 5, 1, 6];
  finishes_values: number[] = [];

  ngAfterViewInit(): void {
    this.chartService.createChart('myChart', this.starting_values, this.starting_values);

    this.selectionSortService.sort([...this.starting_values]);

    for (let i = 0; i < this.starting_values.length; i++) {
      setTimeout(() => {
        this.finishes_values = this.selectionSortService.getStep(i);
        this.chartService.updateChart(this.finishes_values);
      }, i * 1000);
    }
  }
}
