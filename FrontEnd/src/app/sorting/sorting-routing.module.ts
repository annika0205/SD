import { Routes, RouterModule } from "@angular/router";
import { MergesortComponent } from "./mergesort/mergesort.component";
import { SelectionSortComponent } from "./selection-sort/selection-sort.component";
import { SortingStartComponent } from "./sorting-start.component";

export const SORTING_ROUTES: Routes = [
  {path:'', component: SortingStartComponent},
  {path:'selection-sort', component: SelectionSortComponent},
  {path:'mergesort', component: MergesortComponent},
];


