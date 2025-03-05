import { Component, OnInit } from '@angular/core';

interface SortStep {
  type: 'split' | 'merge-before' | 'merge-after';
  array: number[];
  left: number;
  mid: number;
  right: number;
  leftArray?: number[];
  rightArray?: number[];
}

@Component({
  selector: 'app-mergesort',
  templateUrl: './mergesort.component.html',
  styleUrls: ['./mergesort.component.css']
})
export class MergeSortComponent implements OnInit {
  title = 'MergeSort Visualisierung';
  inputValues: string[] = Array(10).fill('');
  numbers: number[] = [];
  originalArray: number[] = [];
  steps: SortStep[] = [];
  isDisabled: boolean = false;
  logs: string[] = [];

  constructor() { }

  ngOnInit(): void { }

  onNumberInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '').slice(0, 3);
    
    this.inputValues[index] = value;
    if (value) {
      this.numbers[index] = parseInt(value);
    } else {
      delete this.numbers[index];
    }
  }

  generateRandomNumbers(): void {
    this.numbers = Array(10).fill(0).map(() => Math.floor(Math.random() * 100) + 1);
    this.inputValues = this.numbers.map(n => n.toString());
  }

  startSorting(): void {
    const validNumbers = this.numbers.filter(n => n !== undefined && !isNaN(n));
    
    if (validNumbers.length === 0) {
      this.addLog("Bitte geben Sie mindestens eine Zahl ein.");
      return;
    }

    this.originalArray = [...validNumbers];
    this.isDisabled = true;
    this.steps = [];
    
    this.addLog("Starte Mergesort...");
    this.addLog("Ursprüngliches Array: [" + this.originalArray.join(", ") + "]");

    const arrayClone = [...this.originalArray];
    this.mergeSort(arrayClone, 0, arrayClone.length - 1);
    
    this.isDisabled = false;
    this.addLog("Sortierung abgeschlossen: [" + arrayClone.join(", ") + "]");
  }

  private mergeSort(arr: number[], left: number, right: number): void {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);

      this.steps.push({
        type: 'split',
        array: [...arr],
        left: left,
        mid: mid,
        right: right
      });

      this.mergeSort(arr, left, mid);
      this.mergeSort(arr, mid + 1, right);
      this.merge(arr, left, mid, right);
    }
  }

  private merge(arr: number[], left: number, mid: number, right: number): void {
    const n1 = mid - left + 1;
    const n2 = right - mid;

    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);

    this.steps.push({
      type: 'merge-before',
      array: [...arr],
      left: left,
      mid: mid,
      right: right,
      leftArray: [...L],
      rightArray: [...R]
    });

    let i = 0, j = 0, k = left;

    while (i < n1 && j < n2) {
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      k++;
    }

    while (i < n1) {
      arr[k] = L[i];
      i++;
      k++;
    }

    while (j < n2) {
      arr[k] = R[j];
      j++;
      k++;
    }

    this.steps.push({
      type: 'merge-after',
      array: [...arr],
      left: left,
      mid: mid,
      right: right
    });
  }

  resetVisualization(): void {
    this.inputValues = Array(10).fill('');
    this.numbers = [];
    this.originalArray = [];
    this.steps = [];
    this.isDisabled = false;
    this.logs = [];
  }

  private addLog(message: string): void {
    this.logs.push(message);
  }

  getStepColor(index: number, step: SortStep): string {
    if (index >= step.left && index <= step.right) {
      if (step.type === 'split') {
        return index <= step.mid ? '#4CAF50' : '#2196F3';
      } else if (step.type === 'merge-after') {
        return '#9C27B0';
      }
    }
    return '#999';
  }

  isFinalStep(step: SortStep): boolean {
    return step.left === 0 && step.right === this.originalArray.length - 1;
  }
}

