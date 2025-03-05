export class MergeSortService {
    private steps: number[][];

    constructor() {
        this.steps = [];
    }

    sort(arr: number[]): number[] {
        this.steps = [arr.slice()];
        return this.mergeSort(arr, 0, arr.length - 1);
    }

    private mergeSort(arr: number[], left: number, right: number): number[] {
        if (left >= right) return [arr[left]];
        
        const mid = Math.floor((left + right) / 2);
        const leftArr = this.mergeSort(arr, left, mid);
        const rightArr = this.mergeSort(arr, mid + 1, right);
        
        return this.merge(arr, leftArr, rightArr, left, right);
    }

    private merge(arr: number[], leftArr: number[], rightArr: number[], left: number, right: number): number[] {
        let result: number[] = [];
        let i = 0, j = 0;
        
        while (i < leftArr.length && j < rightArr.length) {
            if (leftArr[i] < rightArr[j]) {
                result.push(leftArr[i]);
                i++;
            } else {
                result.push(rightArr[j]);
                j++;
            }
        }
        
        result = result.concat(leftArr.slice(i)).concat(rightArr.slice(j));
        arr.splice(left, result.length, ...result);
        this.steps.push(arr.slice());
        return result;
    }

    getSteps(): number[][] {
        return this.steps;
    }

    getStep(index: number): number[] {
        if (index >= 0 && index < this.steps.length) {
            return this.steps[index];
        }
        throw new Error(`Invalid index: ${index}`);
    }
}