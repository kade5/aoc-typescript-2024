import * as fs from 'fs';
import * as path from 'path';

function readFileIntoArray(filePath: string): string[] {
    try {
        const absolutePath = path.resolve(filePath); // Resolve to absolute path
        const fileContent = fs.readFileSync(absolutePath, 'utf-8'); // Read file as UTF-8
        return fileContent.split(/\r?\n/); // Split by new line (handles Windows and Unix)
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
}

function splitArray(fileArray: string[]) {
    let a: number[] = [];
    let b: number[] = [];

    fileArray.forEach(line => {
        let splitLine = line.split('   ')
        console.log(splitLine);
        a.push(Number(splitLine[0]));
        b.push(Number(splitLine[1]));
    })

    return [a, b];

}

function smallestDistance(x: number[], y: number[]): number {

    x.sort((a, b) => a - b);
    y.sort((a, b) => a - b);

    let distance = 0;

    x.map((item, i) => {
        distance += Math.abs(item - y[i]);
    })

    return Math.abs(distance);
}

function isUndefined(x: number | undefined, value: number) {
    return typeof x === 'undefined' ? value : x;
}

function countValues(x: number[]): Map<number, number> {
    let map = new Map();

    x.forEach(item => {
        let value = isUndefined(map.get(item), 0);
        map.set(item, value + 1);
    })

    return map;
}

function similarityScore(x: number[], y: number[]): number {
    let map = countValues(y);
    let score = 0;
    x.forEach((item) => {
        score += item * isUndefined(map.get(item), 0);
    })

    return score;

}

// Get input
const fileArray = readFileIntoArray("part1.txt");
let [a, b] = splitArray(fileArray);

// Part 1
console.log(smallestDistance(a, b));

// Part 2
console.log(similarityScore(a, b))

