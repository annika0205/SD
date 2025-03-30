import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SortingComponent } from './sorting/sorting.component';
import { OptimizingComponent } from './optimizing/optimizing.component';
import { ShortestWayComponent } from './shortest-way/shortest-way.component';
import { HeaderComponent } from './header/header.component';
import { PreviewBoxComponent } from './preview-box/preview-box.component';
import { BoxComponent } from './box/box.component';
import { routing } from './app.routing';
import { StartpageComponent } from './startpage/startpage.component';
import { SelectionSortComponent } from './sorting/selection-sort/selection-sort.component';
import { MergeSortComponent } from './sorting/mergesort/mergesort.component';
import { TemplateSortingComponent } from './sorting/template-sorting/template-sorting.component';
import { GradientDescentComponent } from './optimizing/gradient-descent/gradient-descent.component';
import { BubblesortComponent } from './sorting/bubblesort/bubblesort.component';
import { AppServerModule } from './app.module.server';


@NgModule({
  declarations: [
    AppComponent,
    SortingComponent,
    OptimizingComponent,
    ShortestWayComponent,
    HeaderComponent,
    PreviewBoxComponent,
    BoxComponent,
    StartpageComponent,
    SelectionSortComponent,
    MergeSortComponent,
    TemplateSortingComponent,
    GradientDescentComponent,
    BubblesortComponent,
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(
      withInterceptorsFromDi()
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
