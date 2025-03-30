import { Routes, RouterModule } from "@angular/router";
import { OptimizingComponent } from "./optimizing/optimizing.component";
import { ShortestWayComponent } from "./shortest-way/shortest-way.component";
import { StartpageComponent } from "./startpage/startpage.component";
import { SORTING_ROUTES } from "./sorting/sorting-routing.module";
import { Optimisation_routes } from "./optimizing/optimizing-routing.module";
import { SortingComponent } from "./sorting/sorting.component";

const APP_ROUTES: Routes = [
    {path:'sortieralgorithmen', children: SORTING_ROUTES},
    {path:'optimierungsalgorithmen', children: Optimisation_routes},
    {path:'kürzesterweg', component: ShortestWayComponent},
    {path:'', component: StartpageComponent},
];

export const routing = RouterModule.forRoot(APP_ROUTES);

    /* noch machen: { path: '**', component: PageNotFoundComponent } */