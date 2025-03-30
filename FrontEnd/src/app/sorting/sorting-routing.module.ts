import { Routes, RouterModule } from "@angular/router";
import { MergeSortComponent } from "./mergesort/mergesort.component";
import { SelectionSortComponent } from "./selection-sort/selection-sort.component";
import { SortingStartComponent } from "./sorting-start.component";
import { StableComponent } from "./stable/stable.component";
import { BubblesortComponent } from "./bubblesort/bubblesort.component";
import { SortingComponent } from "./sorting.component";

export const SORTING_ROUTES: Routes = [
  {path:'', component: SortingComponent},
  {path:'selection-sort', component: SelectionSortComponent},
  {path:'mergesort', component: MergeSortComponent},
  {path:'bubblesort', component: BubblesortComponent},
];


