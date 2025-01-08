function mergeSort(arr: number[]): number[] {
    // Liste hat nur ein Element => Liste ist sortiert
    if (arr.length <= 1) {
        return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const leftHalf = arr.slice(0, mid);
    const rightHalf = arr.slice(mid);

    // Rekursiv die beiden Hälften sortieren
    const leftSorted = mergeSort(leftHalf);
    const rightSorted = mergeSort(rightHalf);

    // Zusammenführen der beiden sortierten Hälften
    return merge(leftSorted, rightSorted);
}

function merge(left: number[], right: number[]): number[] {
    // Ergebnis-Array für die zusammengeführten Werte
    const merged: number[] = [];
    let i = 0, j = 0;

    // Solange beide Listen noch Elemente haben, vergleiche sie
    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            merged.push(left[i]);
            i++;
        } else {
            merged.push(right[j]);
            j++;
        }
    }

    // Füge die restlichen Elemente der nicht-leeren Liste hinzu
    merged.push(...left.slice(i));
    merged.push(...right.slice(j));

    return merged;
}

// Beispiel:
const arr = [38, 27, 43, 3, 9, 82, 10];
console.log(mergeSort(arr));  // Ausgabe: [3, 9, 10, 27, 38, 43, 82]
