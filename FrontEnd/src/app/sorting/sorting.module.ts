import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from '../app.routing';
import { SortingStartComponent } from './sorting-start.component';
import { StableComponent } from './stable/stable.component';
import { TemplateSortingComponent } from './template-sortingg/template-sorting.component';
import { BubblesortComponent } from './bubblesort/bubblesort.component';


@NgModule({
  declarations: [
    SortingStartComponent,
    StableComponent,
    TemplateSortingComponent,
    BubblesortComponent
  ],
  imports: [
    CommonModule,
    routing,
  ]
})
export class SortingModule { }
