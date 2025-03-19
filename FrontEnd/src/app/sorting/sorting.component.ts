import { Component, Input, OnInit } from '@angular/core';
import { PreviewBoxComponent } from '../preview-box/preview-box.component';
import { Routes, RouterModule } from "@angular/router";
import { SelectionSortComponent } from './selection-sort/selection-sort.component';
import { MergeSortComponent } from './mergesort/mergesort.component';
import { Router } from '@angular/router';
import { StartpageComponent } from '../startpage/startpage.component';


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

constructor(private router: Router) {}

  ngOnInit() {
    this.items = history.state.items || []; // Holt die Items aus dem Router-State
  }
  
  

  navigateToAlgo(index: number) {
    const routes = [
      '/bubblesort',
      '/selectionsort',
      '/mergesort',
      '/quicksort'
    ];

    this.router.navigate([routes[index]]);
  }
  
}

