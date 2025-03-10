export class SelectionSortService {
    private steps: number[][]; // Liste der Schritte

    constructor() {
        this.steps = [];
    }

    sort(arr: number[], order: 'min' | 'max' = 'min'): number[] {
        const n = arr.length;
        this.steps = [arr.slice()]; // Ursprungszustand speichern

        for (let i = 0; i < n - 1; i++) {
            let targetIdx = i;
            if(order === 'min'){
                let targetIdx = i;
                // Find the index of the minimum element in the unsorted part
                for (let j = i + 1; j < n; j++) {
                    if (arr[j] < arr[targetIdx]) {
                        targetIdx = j;
                    }
                }
                [arr[i], arr[targetIdx]] = [arr[targetIdx], arr[i]];
            } else{
                let targetIdx = n-i-1;
                for (let j = n-i-2; j >= 0; j--) {
                    if (arr[j] > arr[targetIdx]) {
                        targetIdx = j;
                    }
                }
                [arr[n-i-1], arr[targetIdx]] = [arr[targetIdx], arr[n-i-1]];
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
            console.log(this.steps[index])
            return this.steps[index];
        }
        console.log(this.steps.length)
        throw new Error(`Invalid index: ${index}`);
    }
}