import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface RouteItem {
  name: string;
  route: string;
}

@Component({
  selector: 'app-algo-example',
  templateUrl: './algo-example.component.html',
  styleUrl: './algo-example.component.css'
})
export class AlgoExampleComponent {
  sidebarOpen = false;
  inputs: string[] = ["", "", ""];
  algorithms: RouteItem[] = [
    { name: 'Bubblesort', route: 'bubble-sort' },
    { name: 'Selection Sort', route: 'selection-sort' },
    { name: 'Insertion Sort', route: 'insertion-sort' },
    { name: 'Quick Sort', route: 'quick-sort' },
    { name: 'Merge Sort', route: 'merge-sort' },
    { name: 'Heap Sort', route: 'heap-sort' }
  ];
  currentAlgoIndex = 0;

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  handleInputChange(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.inputs[index] = target.value;
  }

  addInput(): void {
    this.inputs.push("");
  }

  removeInput(): void {
    if (this.inputs.length > 3) {
      this.inputs.pop();
    }
  }

  getPreviousAlgo(): string {
    const prevIndex = this.currentAlgoIndex - 1;
    return prevIndex < 0 ? this.algorithms[this.algorithms.length - 1].name : this.algorithms[prevIndex].name;
  }

  getCurrentAlgo(): string {
    return this.algorithms[this.currentAlgoIndex].name;
  }

  getNextAlgo(): string {
    const nextIndex = this.currentAlgoIndex + 1;
    return nextIndex >= this.algorithms.length ? this.algorithms[0].name : this.algorithms[nextIndex].name;
  }

  goToPreviousAlgo(): void {
    this.currentAlgoIndex = this.currentAlgoIndex - 1;
    if (this.currentAlgoIndex < 0) {
      this.currentAlgoIndex = this.algorithms.length - 1;
    }
    const route = this.algorithms[this.currentAlgoIndex].route;
    this.router.navigate([route]);
  }

  goToNextAlgo(): void {
    this.currentAlgoIndex = (this.currentAlgoIndex + 1) % this.algorithms.length;
    const route = this.algorithms[this.currentAlgoIndex].route;
    this.router.navigate([route]);
  }
}