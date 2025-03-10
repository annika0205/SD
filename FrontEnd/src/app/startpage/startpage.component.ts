import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrl: './startpage.component.css'
})
export class StartpageComponent {

  boxes = [
    { title:'Sortieralgorithmen', items: ['Bubblesort', 'Insertionsort', 'Mergesort', 'Selectionsort', 'Quicksort', 'Heapsort', 'Countingsort'] },
    { title: 'Optimierungsalgorithmen', items: ['Item 2.1', 'Item 2.2', 'Item 2.3', 'Item 2.4'] },
    { title: 'Kürzester-Weg-Algorithmen', items: ['Dijkstra', 'A*', 'Item 3.3', 'Item 3.4'] }
  ];

  constructor(private router: Router) {}

  onNavigate(index: number) {
    const routes = [
      '/sortieralgorithmen',
      '/optimierungsalgorithmen',
      '/kürzesterweg'
    ];

    // Navigiere zur Route basierend auf dem Index
    this.router.navigate([routes[index]],{ state: { items: this.boxes[index].items } });
  }
}
