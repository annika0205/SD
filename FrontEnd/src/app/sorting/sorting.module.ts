import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from '../app.routing';
import { SortingStartComponent } from './sorting-start.component';
import { StableComponent } from './stable/stable.component';


@NgModule({
  declarations: [
    SortingStartComponent,
    StableComponent
  ],
  imports: [
    CommonModule,
    routing,
  ]
})
export class SortingModule { }
