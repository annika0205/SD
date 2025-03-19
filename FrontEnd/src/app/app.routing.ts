import { Routes, RouterModule } from "@angular/router";
import { OptimizingComponent } from "./optimizing/optimizing.component";
import { ShortestWayComponent } from "./shortest-way/shortest-way.component";
import { StartpageComponent } from "./startpage/startpage.component";
import { SORTING_ROUTES } from "./sorting/sorting-routing.module";
import { Optimisation_routes } from "./optimizing/optimizing-routing.module";
import { AlgoExampleComponent } from "./algo-example/algo-example.component";
import { StartpageV2Component } from "./startpage-v2/startpage-v2.component";

const APP_ROUTES: Routes = [
    {path:'sortieralgorithmen', children: SORTING_ROUTES},
    {path:'optimierungsalgorithmen', children: Optimisation_routes},
    {path:'kürzesterweg', component: ShortestWayComponent},
    {path:'', component: StartpageComponent},
    {path:'home', component: StartpageV2Component},
    {path:'bubblesort', component: AlgoExampleComponent},
    {path:'selectionsort', component: AlgoExampleComponent},
    {path:'mergesort', component: AlgoExampleComponent},
    {path:'quicksort', component: AlgoExampleComponent}
];

export const routing = RouterModule.forRoot(APP_ROUTES);

    /* noch machen: { path: '**', component: PageNotFoundComponent } */