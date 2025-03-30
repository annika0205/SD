import { Routes, RouterModule } from "@angular/router";
import { OptimizingComponent } from "./optimizing/optimizing.component";
import { ShortestWayComponent } from "./shortest-way/shortest-way.component";
import { StartpageComponent } from "./startpage/startpage.component";
import { SORTING_ROUTES } from "./sorting/sorting-routing.module";
import { Optimisation_routes } from "./optimizing/optimizing-routing.module";
import { AlgoExampleComponent } from "./algo-example/algo-example.component";
import { StartpageV2Component } from "./startpage-v2/startpage-v2.component";
import { SortingComponent } from "./sorting/sorting.component";
import { AstarComponent } from "./graphs/astar/astar.component";
import { DijkstraComponent } from "./graphs/dijkstra/dijkstra.component";
import { MergeSortComponent } from "./sorting/mergesort/mergesort.component";
import { QuickSortComponent } from "./sorting/quicksort/quicksort.component";

const APP_ROUTES: Routes = [
    {path:'sortieralgorithmen', children: SORTING_ROUTES},
   // {path:'sortieralgorithmen', component: SortingComponent},
    {path:'optimierungsalgorithmen', children: Optimisation_routes},
   // {path:'optimierungsalgorithmen', component: OptimizingComponent},
    {path:'kürzesterweg', component: ShortestWayComponent},
    {path:'', component: StartpageComponent},
    {path:'home', component: StartpageV2Component},
    {path:'bubblesort', component: AlgoExampleComponent},
    {path:'selectionsort', component: AlgoExampleComponent},
    {path:'mergesort', component: MergeSortComponent},
    {path:'quicksort', component: QuickSortComponent},
    {path:'gradient-descent', component: AlgoExampleComponent},
    {path:'dijkstra', component: DijkstraComponent},
    {path:'astar', component: AstarComponent}
];

export const routing = RouterModule.forRoot(APP_ROUTES);

    /* noch machen: { path: '**', component: PageNotFoundComponent } */