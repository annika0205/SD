import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from '../app.routing';
import { SortingStartComponent } from './sorting-start.component';


@NgModule({
  declarations: [
    SortingStartComponent
  ],
  imports: [
    CommonModule,
    routing,
  ]
})
export class SortingModule { }
