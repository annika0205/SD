import { Routes, RouterModule } from "@angular/router";
import { OptimizingComponent } from "./optimizing/optimizing.component";
import { ShortestWayComponent } from "./shortest-way/shortest-way.component";
import { StartpageComponent } from "./startpage/startpage.component";
import { SORTING_ROUTES } from "./sorting/sorting-routing.module";
import { AlgoExampleComponent } from "./algo-example/algo-example.component";

const APP_ROUTES: Routes = [
    {path:'sortieralgorithmen', children: SORTING_ROUTES},
    {path:'optimierungsalgorithmen', component: OptimizingComponent},
    {path:'kürzesterweg', component: ShortestWayComponent},
    {path:'', component: StartpageComponent},
    {path:'example', component: AlgoExampleComponent}
];

export const routing = RouterModule.forRoot(APP_ROUTES);

    /* noch machen: { path: '**', component: PageNotFoundComponent } */