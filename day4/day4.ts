import * as fs from 'fs';
import * as path from 'path';

function isXmas(wordSearch: string[][], posX: number, posY: number, orientation: number[], word: string) {
    const wordArray = word.split("");

    for (let i = 0; i < wordArray.length; i++) {
        let newX = posX + (orientation[0] * i)
        let newY = posY + (orientation[1] * i)

        if (newX < 0 || newX >= wordSearch[0].length || newY < 0 || newY >= wordSearch.length || wordSearch[newX][newY] !== wordArray[i]) {
            return 0;
        }
    }
    return 1;
}

function isCrossMas(wordSearch: string[][], posX: number, posY: number) {
    const orientationArray = [ [[-1, -1], [1,1]],
        [[1, -1], [-1, 1]]
    ]

    for (let i = 0; i < orientationArray.length; i++) {
        let leftX = posX + orientationArray[i][0][0]
        let leftY = posY + orientationArray[i][0][1]
        let rightX = posX + orientationArray[i][1][0]
        let rightY = posY + orientationArray[i][1][1]

        if (leftX < 0 || rightX < 0 || leftY < 0 || rightY < 0 ||
            leftX >= wordSearch.length || rightX >= wordSearch.length
            || leftY >= wordSearch[0].length || rightY >= wordSearch[0].length
            || !wordSearch[leftX][leftY].match(/^[MS]$/)
            || !wordSearch[rightX][rightY].match(/^[MS]$/)
            || wordSearch[leftX][leftY] === wordSearch[rightX][rightY]
        ) {
            return 0;
        }
    }

    return 1

}

function countCrossMas(wordSearch: string[][]) {
    let total = 0;

    for (let y = 0; y < wordSearch.length; y++) {
        for (let x = 0; x < wordSearch[y].length; x++) {
            if (wordSearch[y][x] === "A") {
                total += isCrossMas(wordSearch, y, x)
            }

        }
    }

    return total;

}

function countXmas(wordSearch: string[][]) {
    const orientationArray = [[0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
        [1, 1],
        [-1, -1],
        [1, -1],
        [-1, 1]
    ]
    let total = 0;

    for (let y = 0; y < wordSearch.length; y++) {
        for (let x = 0; x < wordSearch[y].length; x++) {
            orientationArray.forEach((orientation) => {
                total += isXmas(wordSearch, x, y, orientation, "XMAS")
            })
        }
    }

    return total;

}

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

function splitWordSearch(file: string[]) {
    return file.map(line => line.split(""));
}

const file = readFileIntoArray("input.txt")
const wordSearch = splitWordSearch(file);

console.log(`Part 1 answer: ${countXmas(wordSearch)}`);
console.log(`Part 2 answer: ${countCrossMas(wordSearch)}`);
