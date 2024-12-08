import * as fs from 'fs';
import * as path from 'path';

function readFileIntoArray(filePath: string): string[] {
    try {
        const absolutePath = path.resolve(filePath); // Resolve to absolute path
        const fileContent = fs.readFileSync(absolutePath, 'utf-8'); // Read file as UTF-8
        return fileContent.split(/\r?\n/) // Split by new line (handles Windows and Unix)
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
}

function getTest(line: string): [number, number[]] {
    const splitLine = line.split(":");
    const testValue = Number(splitLine[0]);
    const input = splitLine[1].slice(1).split(" ").map(value => Number(value));
    return [testValue, input];
}

function concatNumbers(a: number, b: number): number {
    const newNumber = a.toString().concat(b.toString());
    return Number(newNumber);
}

function isCalibrated(testValue: number, input: number[]): number {
    const solutionArray = [[input[0]]]

    for (let i = 1; i < input.length; i++) {
        const newSolution: number[] = []
        solutionArray[i-1].forEach(value => {
            newSolution.push(input[i] + value);
            newSolution.push(input[i] * value);
        })
        solutionArray.push(newSolution);
    }

    if (solutionArray[solutionArray.length-1].includes(testValue)) {
        return testValue
    }
    return 0;
}

function isCalibratedWithConcat(testValue: number, input: number[]): number {
    const solutionArray = [[input[0]]]

    for (let i = 1; i < input.length; i++) {
        const newSolution: number[] = []
        solutionArray[i-1].forEach(value => {
            newSolution.push(input[i] + value);
            newSolution.push(input[i] * value);
            newSolution.push(concatNumbers(value, input[i]));
        })
        solutionArray.push(newSolution);
    }

    if (solutionArray[solutionArray.length-1].includes(testValue)) {
        return testValue
    }
    return 0;
}

function totalCalibrated(fileInput: string[], isCal: Function) {
    let total = 0;
    fileInput.forEach(line => {
        const [testValue, input] = getTest(line);
        total += isCal(testValue, input);
    })

    return total;
}

const file = readFileIntoArray("input.txt")

console.log(`Part 1 answer: ${totalCalibrated(file, isCalibrated)}`);
console.log(`Part 2 answer: ${totalCalibrated(file, isCalibratedWithConcat)}`);
