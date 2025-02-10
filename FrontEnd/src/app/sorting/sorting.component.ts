import { Component, Input } from '@angular/core';
import { PreviewBoxComponent } from '../preview-box/preview-box.component';

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
@Input() items: string[] = [];
}
