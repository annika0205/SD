import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';


import { AppComponent } from './app.component';
import { SortingComponent } from './sorting/sorting.component';
import { OptimizingComponent } from './optimizing/optimizing.component';
import { ShortestWayComponent } from './shortest-way/shortest-way.component';
import { HeaderComponent } from './header/header.component';
import { PreviewBoxComponent } from './preview-box/preview-box.component';
import { BoxComponent } from './box/box.component';
import { routing } from './app.routing';
import { StartpageComponent } from './startpage/startpage.component';
import { AlgoExampleComponent } from './algo-example/algo-example.component';
import { StartpageV2Component } from './startpage-v2/startpage-v2.component';



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
    AlgoExampleComponent,
    StartpageV2Component
  ],
  imports: [
    BrowserModule,
    routing
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
