
/**
 * Get all numbers in the given range, inclusive
 * @param first 
 * @param second 
 * @returns 
 */
export const getNumbersInRange = (first: number, second: number): number[] => {
    let numbers: number[] = [];

    for (let i = first; i <= second; i++) {
        numbers.push(i);
    }

    return numbers;
}