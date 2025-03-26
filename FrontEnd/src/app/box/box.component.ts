import { Component, Input, Output, EventEmitter, HostBinding, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

interface AlgorithmItem {
  items: string;
  description: string;
}

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrl: './box.component.css',
  encapsulation: ViewEncapsulation.None
})
export class BoxComponent {
  @Input() title: string = '';
  @Input() items: AlgorithmItem[] = [];
  @Output() navigate = new EventEmitter<void>();

  @HostBinding('class')
  @Input()
  class: string = '';

  isExpanded: boolean = false;

  constructor(private router: Router) {}

  toggleExpand(event: Event) {
    event.stopPropagation();
    this.isExpanded = !this.isExpanded;
  }

  ngOnInit() {
    console.log('BoxComponent initialized');
    console.log('Title:', this.title);
    console.log('Items:', this.items);
  }

  onSearchClick(event: Event) {
    event.stopPropagation(); // Verhindert, dass der Click die Box aufklappt
    this.navigate.emit();
  }

  navigateToAlgorithm(algorithmName: string, event: Event) {
    
    try {
      alert('Click detected!'); // This will show visually if the method is called
      console.log('Click event:', event);
      console.log('Algorithm name:', algorithmName);
      event.stopPropagation();
      
      const routes: { [key: string]: string } = {
          'Bubblesort': '/bubblesort',
          'Mergesort': '/mergesort',
          'Quicksort': '/quicksort',
          'Selectionsort': '/selectionsort',
          'Gradient-Descent': '/gradient-descent',
          'Dijkstra': '/dijkstra',
          'A*': '/a-star'
      };

      if (routes[algorithmName]) {
          console.log('Navigating to:', routes[algorithmName]);
          this.router.navigate([routes[algorithmName]]);
      } else {
          console.error('Route not found for:', algorithmName);
      }
  } catch (error) {
      console.error('Error in navigateToAlgorithm:', error);
  }
  }
}