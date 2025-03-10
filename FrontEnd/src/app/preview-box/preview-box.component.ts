import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-preview-box',
  templateUrl: './preview-box.component.html',
  styleUrl: './preview-box.component.css'
})
export class PreviewBoxComponent {

//   algorithms=[
//     'Bubblesort',
//     'MergeSort',
//     'Quicksort',
//     'Selectionsort'
// ]

@Input() items: string[] = [];
}
