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

function createTopoMap(input: string[]): number[][] {
    const numberArray: number[][] = [];

    input.forEach((line) => {
        const row = line.split("").map((element) => Number(element));
        numberArray.push(row)
    })

    return numberArray;
}

function traverseMap(topoMap: number[][], solutionArray: number[][], i: number, j: number, previous: number) {
    if (i < 0 || j < 0 || i >= topoMap.length || j >= topoMap.length) {
        return 0;
    }

    if (solutionArray[i][j] !== -1 ) {
        return solutionArray[i][j];
    }

    if (topoMap[i][j] !== previous + 1 ) {
        return 0;
    }

    if (topoMap[i][j] === 9) {
        solutionArray[i][j] = 1;
        return 1
    }

    const movementArray = [[-1, 0],
    [0, -1],
    [1, 0],
    [0, -1]]
    let score = 0;

    movementArray.forEach((movement) => {
        score += traverseMap(topoMap, solutionArray, i + movement[0], j + movement[1], topoMap[i][j])
    })

    solutionArray[i][j] = score;
    return score;
}

function calculateTrailScore(topoMap: number[][], solutionArray: number[][]) {
    let score = 0;
    topoMap.forEach((row, i) => {
        row.forEach((point, j) => {
            if (point === 0) {
                score += solutionArray[i][j];
            }
        })
    })
    return score;
}

function findTrailScore(input: string[]) {
    const topoMap = createTopoMap(input);
    const solutionArray: number[][] = Array.from(Array(topoMap.length), _ => Array(topoMap[0].length).fill(-1));

    topoMap.forEach((row, i) => {
        row.forEach((element, j) => {
            traverseMap(topoMap, solutionArray, i, j, element - 1)

        })
    })

    return calculateTrailScore(topoMap, solutionArray);

}

const input = readFileIntoArray("testinput.txt");
console.log(`Part 1 solution: ${findTrailScore(input)}`);
