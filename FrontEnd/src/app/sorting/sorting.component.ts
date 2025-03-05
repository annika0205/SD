import { Component } from '@angular/core';
import { PreviewBoxComponent } from '../preview-box/preview-box.component';
import { Routes, RouterModule } from "@angular/router";
import { SelectionSortComponent } from './selection-sort/selection-sort.component';
import { MergeSortComponent } from './mergesort/mergesort.component';
@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrl: './sorting.component.css'
})
export class SortingComponent {
  algorithms=[
    'Bubblesort',
    'MergeSort',
    'Quicksort',
    'Selectionsort'
]
}

