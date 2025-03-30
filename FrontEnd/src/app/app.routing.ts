import { Routes, RouterModule } from "@angular/router";
import { OptimizingComponent } from "./optimizing/optimizing.component";
import { ShortestWayComponent } from "./shortest-way/shortest-way.component";
import { StartpageComponent } from "./startpage/startpage.component";
import { SORTING_ROUTES } from "./sorting/sorting-routing.module";
import { Optimisation_routes } from "./optimizing/optimizing-routing.module";
import { SortingComponent } from "./sorting/sorting.component";
import { DijkstraComponent } from "./shortest-way/dijkstra/dijkstra.component";
import { MergeSortComponent } from "./sorting/mergesort/mergesort.component";
import { QuickSortComponent } from "./sorting/quicksort/quicksort.component";
import { Shortest_Way_Routes } from "./shortest-way/shortest-way-routing.module";

const APP_ROUTES: Routes = [
    {path:'sortieralgorithmen', children: SORTING_ROUTES},
    {path:'optimierungsalgorithmen', children: Optimisation_routes},
    {path:'kürzesterweg', children: Shortest_Way_Routes},
    {path:'', component: StartpageComponent},
];

export const routing = RouterModule.forRoot(APP_ROUTES);

    /* noch machen: { path: '**', component: PageNotFoundComponent } */