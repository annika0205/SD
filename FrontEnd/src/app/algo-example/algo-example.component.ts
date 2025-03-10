import { Component } from '@angular/core';

@Component({
  selector: 'app-algo-example',
  templateUrl: './algo-example.component.html',
  styleUrl: './algo-example.component.css'
})
export class AlgoExampleComponent {
  sidebarOpen = false;
  inputs: string[] = ["", "", "", "", ""];

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  handleInputChange(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.inputs[index] = target.value;
  }
}
