import { Component, AfterViewInit } from '@angular/core';
import { MergeSortService } from './merge-sort-service';
import { ChartService } from '../services/chart.service';
@Component({
  selector: 'app-mergesort',
  templateUrl: './mergesort.component.html',
  styleUrl: './mergesort.component.css',
  providers: [MergeSortService]
})
export class MergeSortComponent implements AfterViewInit {
  constructor(
    private mergeSortService: MergeSortService,
    private chartService: ChartService
  ) {}

  starting_values = [8, 2, 7, 4, 5, 1, 6, 8, 10];
  finishes_values: number[] = [];

  ngAfterViewInit(): void {
    this.chartService.createChart('myChart', this.starting_values, this.starting_values);

    this.mergeSortService.sort([...this.starting_values]);

    for (let i = 0; i < this.starting_values.length; i++) {
      setTimeout(() => {
        this.finishes_values = this.mergeSortService.getStep(i);
        this.chartService.updateChart(this.finishes_values);
      }, i * 1000);
    }
  }
}
