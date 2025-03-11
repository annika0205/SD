import { Routes, RouterModule } from "@angular/router";
import { SortingComponent } from "./sorting/sorting.component";
import { OptimizingComponent } from "./optimizing/optimizing.component";
import { ShortestWayComponent } from "./shortest-way/shortest-way.component";
import { StartpageComponent } from "./startpage/startpage.component";
import { AlgoExampleComponent } from "./algo-example/algo-example.component";

const APP_ROUTES: Routes = [
    {path:'sortieralgorithmen', component: SortingComponent},
    {path:'optimierungsalgorithmen', component: OptimizingComponent},
    {path:'kürzesterweg', component: ShortestWayComponent},
    {path:'', component: StartpageComponent},
    {path:'bubblesort', component: AlgoExampleComponent},
    {path:'insertionsort', component: AlgoExampleComponent},
    {path:'mergesort', component: AlgoExampleComponent}
];

export const routing = RouterModule.forRoot(APP_ROUTES);