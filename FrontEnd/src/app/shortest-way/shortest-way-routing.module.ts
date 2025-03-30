import { Routes } from "@angular/router";
import { AstarComponent } from "./astar/astar.component";
import { DijkstraComponent } from "./dijkstra/dijkstra.component";
import { ShortestWayComponent } from "./shortest-way.component";

export const Shortest_Way_Routes: Routes = [
  {path:'', component: ShortestWayComponent},
  {path:'astar', component: AstarComponent},
  {path:'dijkstra', component: DijkstraComponent}
];
