import { Routes, RouterModule } from "@angular/router";
import { SortingComponent } from "./sorting/sorting.component";
import { OptimizingComponent } from "./optimizing/optimizing.component";
import { ShortestWayComponent } from "./shortest-way/shortest-way.component";
import { StartpageComponent } from "./startpage/startpage.component";

const APP_ROUTES: Routes = [
    {path:'sortieralgorithmen', component: SortingComponent},
    {path:'optimierungsalgorithmen', component: OptimizingComponent},
    {path:'kürzesterweg', component: ShortestWayComponent},
    {path:'', component: StartpageComponent}
];

export const routing = RouterModule.forRoot(APP_ROUTES);