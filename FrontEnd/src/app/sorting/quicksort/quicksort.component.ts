import { Component, OnInit } from '@angular/core';

interface SortStep {
  type: 'select-pivot' | 'partition' | 'move-pivot' | 'recursive';
  array: number[];
  left: number;
  right: number;
  pivotIndex: number;
  lessThan?: number[];
  greaterThan?: number[];
  finalPosition?: number;
}

@Component({
  selector: 'app-quicksort',
  templateUrl: './quicksort.component.html',
  styleUrls: ['./quicksort.component.css']
})
export class QuickSortComponent implements OnInit {
  inputValues: string[] = ['10', '24', '76', '73', '72', '1', '9']; // Default values
  numbers: number[] = [];
  originalArray: number[] = [];
  steps: SortStep[] = [];
  isDisabled: boolean = false;
  private logs: string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.updateNumbersFromInputs();
  }

  onNumberInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '').slice(0, 3); // Limit to 3 digits
    
    this.inputValues[index] = value;
    this.updateNumbersFromInputs();
  }

  updateNumbersFromInputs(): void {
    this.numbers = this.inputValues
      .filter(value => value && value.trim() !== '')
      .map(value => parseInt(value))
      .filter(value => !isNaN(value));
  }

  addInput(): void {
    if (this.inputValues.length < 10) {
      this.inputValues.push('');
    }
  }

  removeInput(): void {
    if (this.inputValues.length > 3) {
      this.inputValues.pop();
    }
    this.updateNumbersFromInputs();
  }

  generateRandomNumbers(): void {
    this.numbers = Array(this.inputValues.length).fill(0).map(() => Math.floor(Math.random() * 100) + 1);
    this.inputValues = this.numbers.map(n => n.toString());
  }

  startSorting(): void {
    this.updateNumbersFromInputs();
    const validNumbers = this.numbers;
    
    if (validNumbers.length === 0) {
      this.addLog("Bitte geben Sie mindestens eine Zahl ein.");
      return;
    }

    this.originalArray = [...validNumbers];
    this.isDisabled = true;
    this.steps = [];
    
    this.addLog("Starte QuickSort...");
    this.addLog("Ursprüngliches Array: [" + this.originalArray.join(", ") + "]");

    const arrayClone = [...this.originalArray];
    this.quickSort(arrayClone, 0, arrayClone.length - 1);
    
    this.isDisabled = false;
    this.addLog("Sortierung abgeschlossen: [" + arrayClone.join(", ") + "]");
  }

  private quickSort(arr: number[], left: number, right: number): void {
    if (left < right) {
      // Select pivot (using the rightmost element for simplicity)
      const pivotIndex = right;
      const pivotValue = arr[pivotIndex];
      
      this.steps.push({
        type: 'select-pivot',
        array: [...arr],
        left: left,
        right: right,
        pivotIndex: pivotIndex
      });
      
      // Partition the array
      let i = left - 1;
      
      for (let j = left; j < right; j++) {
        if (arr[j] <= pivotValue) {
          i++;
          // Swap arr[i] and arr[j]
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
      
      // Move pivot to its final position
      const pivotFinalPosition = i + 1;
      [arr[pivotFinalPosition], arr[right]] = [arr[right], arr[pivotFinalPosition]];
      
      // Record the partition step
      this.steps.push({
        type: 'partition',
        array: [...arr],
        left: left,
        right: right,
        pivotIndex: pivotIndex,
        lessThan: arr.slice(left, pivotFinalPosition),
        greaterThan: arr.slice(pivotFinalPosition + 1, right + 1),
        finalPosition: pivotFinalPosition
      });
      
      // Record the move pivot step
      this.steps.push({
        type: 'move-pivot',
        array: [...arr],
        left: left,
        right: right,
        pivotIndex: pivotFinalPosition
      });
      
      // Record recursive call on left part
      if (left < pivotFinalPosition - 1) {
        this.steps.push({
          type: 'recursive',
          array: [...arr],
          left: left,
          right: pivotFinalPosition - 1,
          pivotIndex: -1 // No pivot yet for this step
        });
      }
      
      // Recursively sort the elements before and after pivot
      this.quickSort(arr, left, pivotFinalPosition - 1);
      
      // Record recursive call on right part
      if (pivotFinalPosition + 1 < right) {
        this.steps.push({
          type: 'recursive',
          array: [...arr],
          left: pivotFinalPosition + 1,
          right: right,
          pivotIndex: -1 // No pivot yet for this step
        });
      }
      
      this.quickSort(arr, pivotFinalPosition + 1, right);
    }
  }

  resetVisualization(): void {
    this.inputValues = ['10', '24', '76', '73', '72', '1', '9']; // Reset to default values
    this.updateNumbersFromInputs();
    this.originalArray = [];
    this.steps = [];
    this.isDisabled = false;
    this.logs = [];
  }

  private addLog(message: string): void {
    this.logs.push(message);
  }

  getStepColor(index: number, step: SortStep): string {
    if (index === step.pivotIndex) {
      return '#FF5722'; // Orange for pivot
    } else if (step.type === 'partition' && step.finalPosition !== undefined) {
      // Only check finalPosition if it's defined
      if (index < step.finalPosition) {
        return '#4CAF50'; // Green for less than pivot
      } else if (index > step.finalPosition) {
        return '#2196F3'; // Blue for greater than pivot
      }
    } else if (step.type === 'recursive') {
      if (index >= step.left && index <= step.right) {
        return '#9C27B0'; // Purple for current subarray
      }
    }
    return '#999'; // Default gray
  }

  isPivot(index: number, step: SortStep): boolean {
    return index === step.pivotIndex;
  }
}