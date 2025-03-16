export class BubbleSortService {
    private steps: number[][]; // Liste der Schritte

    constructor() {
        this.steps = [];
    }

    sort(arr: number[], order: 'min' | 'max' = 'min'): number[] {
        const n = arr.length;
        this.steps = [arr.slice()]; // Ursprungszustand speichern

        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - 1 - i; j++) {
                if ((order === 'min' && arr[j] > arr[j + 1]) || (order === 'max' && arr[j] < arr[j + 1])) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
            // Aktuellen Zustand speichern
            this.steps.push(arr.slice());
            console.log(arr.slice());
        }
        return arr;
    }

    // Gibt alle gespeicherten Schritte zurück
    getSteps(): number[][] {
        return this.steps;
    }

    // Gibt einen bestimmten Schritt zurück
    getStep(index: number): number[] {
        if (index >= 0 && index < this.steps.length) {
            console.log(this.steps[index]);
            return this.steps[index];
        }
        console.log(this.steps.length);
        throw new Error(`Invalid index: ${index}`);
    }
}
