import { Routes, RouterModule } from "@angular/router";
import { SortingComponent } from "./sorting/sorting.component";
import { OptimizingComponent } from "./optimizing/optimizing.component";
import { ShortestWayComponent } from "./shortest-way/shortest-way.component";
import { StartpageComponent } from "./startpage/startpage.component";
import { AlgoExampleComponent } from "./algo-example/algo-example.component";
import { StartpageV2Component } from "./startpage-v2/startpage-v2.component";

const APP_ROUTES: Routes = [
    {path:'sortieralgorithmen', component: SortingComponent},
    {path:'optimierungsalgorithmen', component: OptimizingComponent},
    {path:'kürzesterweg', component: ShortestWayComponent},
    {path:'', component: StartpageComponent},
    {path:'home', component: StartpageV2Component},
    {path:'bubblesort', component: AlgoExampleComponent},
    {path:'selectionsort', component: AlgoExampleComponent},
    {path:'mergesort', component: AlgoExampleComponent},
    {path:'quicksort', component: AlgoExampleComponent},
    {path:'gradient-descent', component: AlgoExampleComponent},
    {path:'dijkstra', component: AlgoExampleComponent},
    {path:'a*', component: AlgoExampleComponent}
];

export const routing = RouterModule.forRoot(APP_ROUTES);