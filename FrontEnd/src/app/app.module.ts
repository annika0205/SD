import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';


import { AppComponent } from './app.component';
import { SortingComponent } from './sorting/sorting.component';
import { OptimizingComponent } from './optimizing/optimizing.component';
//import { ShortestWayComponent } from './shortest-way/shortest-way.component';
import { HeaderComponent } from './header/header.component';
import { PreviewBoxComponent } from './preview-box/preview-box.component';
import { BoxComponent } from './box/box.component';
import { routing } from './app.routing';
import { StartpageComponent } from './startpage/startpage.component';
import { SelectionSortComponent } from './sorting/selection-sort/selection-sort.component';
import { MergeSortComponent } from './sorting/mergesort/mergesort.component';
import { FormsModule } from '@angular/forms';
import { AlgoExampleComponent } from './algo-example/algo-example.component';
import { TemplateSortingComponent } from './sorting/template-sortingg/template-sorting.component';
import { GradientDescentComponent } from './optimizing/gradient-descent/gradient-descent.component';
import { BubblesortComponent } from './sorting/bubblesort/bubblesort.component';
import { AstarComponent } from './graphs/astar/astar.component';
import { DijkstraComponent } from './graphs/dijkstra/dijkstra.component';
import { TemplateGraphsComponent } from './graphs/template-graphs/template-graphs.component';



@NgModule({
  declarations: [
    AppComponent,
    SortingComponent,
    OptimizingComponent,
   // ShortestWayComponent,
    HeaderComponent,
    PreviewBoxComponent,
    BoxComponent,
    StartpageComponent,
    SelectionSortComponent,
    MergeSortComponent,
    AlgoExampleComponent,
    TemplateSortingComponent,
    GradientDescentComponent,
    BubblesortComponent,
    AstarComponent,
    DijkstraComponent,
    TemplateGraphsComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
