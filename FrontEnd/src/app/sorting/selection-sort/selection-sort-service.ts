export class SelectionSortService {
    private steps: number[][]; // Liste der Schritte

    constructor() {
        this.steps = [];
    }

    // Führt den Sortieralgorithmus aus und speichert jeden Schritt
    sort(arr: number[]): number[] {
        const n = arr.length;
        this.steps = [arr.slice()]; // Ursprungszustand speichern

        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            for (let j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            // Elemente tauschen
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            // Aktuellen Zustand speichern
            this.steps.push(arr.slice());
            console.log(arr.slice);
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
            console.log(this.steps[index])
            return this.steps[index];
        }
        console.log(this.steps.length)
        throw new Error(`Invalid index: ${index}`);
    }
}