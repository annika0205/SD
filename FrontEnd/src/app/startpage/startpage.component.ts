import { Component } from '@angular/core';

@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrl: './startpage.component.css'
})
export class StartpageComponent {

  // Algorithms=['Sortieralgorithmen',
  //   'Optimierungsalgorithmen',
  //   'Kürzester-Weg-Algorithmen'
  // ]

  boxes = [
    { title:'Sortieralgorithmen', items: ['Bubblesort', 'Insertionsort', 'Mergesort', 'Selectionsort', 'Quicksort', 'Heapsort', 'Countingsort'] },
    { title: 'Optimierungsalgorithmen', items: ['Item 2.1', 'Item 2.2', 'Item 2.3', 'Item 2.4'] },
    { title: 'Kürzester-Weg-Algorithmen', items: ['Dijkstra', 'A*', 'Item 3.3', 'Item 3.4'] }
  ];

}
