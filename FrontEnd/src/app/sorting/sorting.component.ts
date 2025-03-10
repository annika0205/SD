import { Component, Input, OnInit } from '@angular/core';
import { PreviewBoxComponent } from '../preview-box/preview-box.component';
import { Routes, RouterModule } from "@angular/router";
import { SelectionSortComponent } from './selection-sort/selection-sort.component';
import { MergeSortComponent } from './mergesort/mergesort.component';
import { Router } from '@angular/router';

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
}

