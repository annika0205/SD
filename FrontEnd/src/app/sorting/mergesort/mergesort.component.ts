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
  inputValues: string[] = Array(5).fill(''); // Start with 5 input fields
  numbers: number[] = [];
  originalArray: number[] = [];
  steps: SortStep[] = [];
  displayedSteps: SortStep[] = []; // Steps to display based on step-by-step visualization
  currentStepIndex: number = 0;
  inputsDisabled: boolean = false; // Separate disabled state for inputs
  allStepsShown: boolean = false;
  private logs: string[] = [];
  sortingInProgress: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // Initialize with random numbers
    this.generateRandomNumbers();
  }

  onNumberInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '').slice(0, 3); // Limit to 3 digits
    
    this.inputValues[index] = value;
    if (value) {
      this.numbers[index] = parseInt(value);
    } else {
      delete this.numbers[index];
    }
    
    // Reset steps when input changes
    this.resetSteps();
  }

  generateRandomNumbers(): void {
    this.numbers = Array(this.inputValues.length).fill(0).map(() => Math.floor(Math.random() * 100) + 1);
    this.inputValues = this.numbers.map(n => n.toString());
    this.resetSteps();
  }

  addInputField(): void {
    this.inputValues.push('');
    this.resetSteps();
  }

  removeInputField(): void {
    if (this.inputValues.length > 1) {
      this.inputValues.pop();
      this.numbers.pop();
      this.resetSteps();
    }
  }

  // Reset just the steps but keep the input values
  private resetSteps(): void {
    this.steps = [];
    this.displayedSteps = [];
    this.currentStepIndex = 0;
    this.originalArray = [];
    this.allStepsShown = false;
    this.sortingInProgress = false;
  }

  // Prepare the sorting algorithm
  private prepareSorting(): boolean {
    const validNumbers = this.numbers.filter(n => n !== undefined && !isNaN(n));
    
    if (validNumbers.length === 0) {
      console.log("Bitte geben Sie mindestens eine Zahl ein.");
      return false;
    }

    this.originalArray = [...validNumbers];
    this.steps = [];
    this.displayedSteps = [];
    this.currentStepIndex = 0;
    this.allStepsShown = false;
    this.inputsDisabled = true; // Only disable inputs, not step buttons
    this.sortingInProgress = true;
    
    const arrayClone = [...this.originalArray];
    this.mergeSort(arrayClone, 0, arrayClone.length - 1);
    
    return true;
  }

  nextStep(): void {
    // If no steps have been generated yet, prepare the sorting first
    if (!this.sortingInProgress) {
      if (!this.prepareSorting()) {
        return; // Exit if preparation failed
      }
    }
    
    if (this.currentStepIndex < this.steps.length) {
      this.displayedSteps.push(this.steps[this.currentStepIndex]);
      this.currentStepIndex++;
      
      if (this.currentStepIndex >= this.steps.length) {
        this.allStepsShown = true;
        this.inputsDisabled = false; // Re-enable inputs when done
        this.sortingInProgress = false;
      }
    }
  }

  showAllSteps(): void {
    // If no steps have been generated yet, prepare the sorting first
    if (!this.sortingInProgress) {
      if (!this.prepareSorting()) {
        return; // Exit if preparation failed
      }
    }
    
    this.displayedSteps = [...this.steps];
    this.currentStepIndex = this.steps.length;
    this.allStepsShown = true;
    this.inputsDisabled = false; // Re-enable inputs when done
    this.sortingInProgress = false;
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
    this.inputValues = Array(5).fill(''); // Reset to 5 empty inputs
    this.numbers = [];
    this.originalArray = [];
    this.steps = [];
    this.displayedSteps = [];
    this.currentStepIndex = 0;
    this.allStepsShown = false;
    this.inputsDisabled = false;
    this.sortingInProgress = false;
    this.logs = [];
    
    // Generate new random numbers after reset
    this.generateRandomNumbers();
  }

  private addLog(message: string): void {
    this.logs.push(message);
    console.log(message);
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
}