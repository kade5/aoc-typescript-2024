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

function createMap(input: string[]) {
    const map: string[][] = []
    input.forEach((item) => {
        map.push(item.split(''));
    })

    return map;
}

function findStartingPos(map: string[][], char: string): number[] {

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === char) {
                return [i, j]
            }
        }
    }

    return [-1, -1]

}

function turnRight(direction: number[]) {
    return [direction[1], -direction[0]]
}

function countUniqueLocations(map: string[][]) {
    let [posY, posX] = findStartingPos(map, "^")
    let direction = [-1, 0]
    const locationSet = new Set<string>();

    while (posX >= 0 && posY >= 0 && posX < map[0].length && posY < map.length) {
        if (map[posY][posX] === "#") {
            posY = posY - direction[0];
            posX = posX - direction[1];
            direction = turnRight(direction);
        }
        locationSet.add([posY, posX].toString());

        posY = posY + direction[0];
        posX = posX + direction[1];
    }

    return locationSet.size;

}

function hasLoop(map: string[][], startY: number, startX: number, blockAddY: number, blockAddX: number): boolean {
    let posY = startY;
    let posX = startX;

    let direction = [-1, 0]
    const locationSet = new Set<string>();

    while (posX >= 0 && posY >= 0 && posX < map[0].length && posY < map.length) {
        if (map[posY][posX] === "#" || (posY === blockAddY && posX === blockAddX)) {
            posY = posY - direction[0];
            posX = posX - direction[1];
            direction = turnRight(direction);
        }
        if (locationSet.has([posY, posX, direction].toString())) {
            return true;
        }
        locationSet.add([posY, posX, direction].toString());

        posY = posY + direction[0];
        posX = posX + direction[1];
    }

    return false;
}

function countLoops(map: string[][]) {
    let [posY, posX] = findStartingPos(map, "^");
    let total = 0;

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === "." && hasLoop(map, posY, posX, i, j)) {
                total++
            }
        }
    }
    return total;
}

const input = readFileIntoArray("input.txt")
const map = createMap(input);
console.log(`Part 1 solution: ${countUniqueLocations(map)}`)
console.log(`Part 2 solution: ${countLoops(map)}`)
// Part 2 takes a few minutes to run, but since hasLoop is written as a pure function
// it can be run in parallel.
