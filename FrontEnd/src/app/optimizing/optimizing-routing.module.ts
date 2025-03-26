import { Routes, RouterModule } from "@angular/router";
import { GradientDescentComponent } from "./gradient-descent/gradient-descent.component";

export const Optimisation_routes: Routes = [
 // {path:'', component: SortingStartComponent},
  {path:'gradientdescent', component: GradientDescentComponent},
];