import { Routes, RouterModule } from "@angular/router";
//import { OptimizingComponent } from "./optimizing/optimizing.component";
//import { ShortestWayComponent } from "./shortest-way/shortest-way.component";
import { StartpageComponent } from "./startpage/startpage.component";
import { SORTING_ROUTES } from "./sorting/sorting-routing.module";
import { Optimisation_routes } from "./optimizing/optimizing-routing.module";
import { AlgoExampleComponent } from "./algo-example/algo-example.component";
import { AstarComponent}from "./graphs/astar/astar.component";
import { DijkstraComponent } from "./graphs/dijkstra/dijkstra.component";
import { TemplateGraphsComponent } from "./graphs/template-graphs/template-graphs.component";

const APP_ROUTES: Routes = [
    {path:'sortieralgorithmen', children: SORTING_ROUTES},
    {path:'optimierungsalgorithmen', children: Optimisation_routes},
  //  {path:'kürzesterweg', component: ShortestWayComponent},
    {path:'', component: StartpageComponent},
    {path:'bubblesort', component: AlgoExampleComponent},
    {path:'insertionsort', component: AlgoExampleComponent},
    {path:'mergesort', component: AlgoExampleComponent},
    {path:'astar', component: AstarComponent},
    {path:'dijkstra',component: DijkstraComponent},
    {path:'template',component:TemplateGraphsComponent}


];

export const routing = RouterModule.forRoot(APP_ROUTES);

    /* noch machen: { path: '**', component: PageNotFoundComponent } */