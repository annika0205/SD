import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-template-sorting',
  templateUrl: './template-sorting.component.html',
  styleUrl: './template-sorting.component.css'
})
export class TemplateSortingComponent {

  @Input() description: string = "";
  @Output() sortClicked = new EventEmitter<void>();
  @Output() inputsEvent = new EventEmitter<string[]>();

  sidebarOpen = false;
  inputs: string[] = ["", "", "", "", ""];

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  handleInputChange(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.inputs[index] = target.value;
    this.inputsEvent.emit(this.inputs)
  }
}
