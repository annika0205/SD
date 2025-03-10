import { Component, AfterViewInit } from '@angular/core';
import { MergeSortService } from './merge-sort-service';
import { ChartService } from '../services/chart.service';
@Component({
  selector: 'app-mergesort',
  templateUrl: './mergesort.component.html',
  styleUrl: './mergesort.component.css',
  providers: [MergeSortService]
})
export class MergeSortComponent {
  
}
