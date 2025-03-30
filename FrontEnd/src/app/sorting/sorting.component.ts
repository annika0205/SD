import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';



interface AlgorithmItem {
  items: string;
  description: string;
}

@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrl: './sorting.component.css'
})
export class SortingComponent implements OnInit {

  @Input() items: AlgorithmItem[] = []; // Änderung hier zu AlgorithmItem[]

constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.items = history.state.items || []; // Holt die Items aus dem Router-State
  }
  
  

  navigateToAlgo(index: number) {
    const routes = [
      'bubblesort',
      'selectionsort',
      'mergesort',
      'quicksort'
    ];

    this.router.navigate([routes[index]], { relativeTo: this.route });
  }
  
}

