import { Component, Input, OnInit } from '@angular/core';
import { PreviewBoxComponent } from '../preview-box/preview-box.component';
import { Router } from '@angular/router';
import { StartpageComponent } from '../startpage/startpage.component';

@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrl: './sorting.component.css'
})
export class SortingComponent implements OnInit {

@Input() items: string[] = [];

constructor(private router: Router) {}

  ngOnInit() {
    this.items = history.state.items || []; // Holt die Items aus dem Router-State
  }
  
  

  navigateToAlgo(index: number) {
    const routes = [
      '/bubblesort',
      '/insertionsort',
      '/mergesort'
    ];

    this.router.navigate([routes[index]]);
  }
  
}
