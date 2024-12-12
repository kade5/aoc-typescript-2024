import * as fs from 'fs';
import * as path from 'path';

function readFileIntoArray(filePath: string): string[] {
    try {
        const absolutePath = path.resolve(filePath); // Resolve to absolute path
        const fileContent = fs.readFileSync(absolutePath, 'utf-8'); // Read file as UTF-8
        return fileContent.split("")
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
}

function generateBlockMap(testInput: string[]): string[] {
    const blockMap: string[] = [];
    let fileId = 0;

    testInput.forEach((item, index) => {
        if (index % 2 === 0) {
            for (let i = 0; i < Number(item); i++) {
                blockMap.push(fileId.toString());
            }
            fileId++;
        } else {
            for (let i = 0; i < Number(item); i++) {
                blockMap.push(".");
            }
        }
    })

    return blockMap;
}

function generateFileMap(testInput: string[]): [number, number, number][] {
    const fileMap: [number, number, number][] = [];
    let fileId = 0;
    let mapIndex = 0;

    testInput.forEach((item, index) => {
        if (index % 2 === 0) {
            fileMap.push([fileId, mapIndex, Number(item)]);
            mapIndex += Number(item);
            fileId++;
        } else {
            mapIndex += Number(item);
        }
    })

    return fileMap;
}

function moveBlocks(blockMap: string[]) {
    let leftBound = 0;
    let rightBound = blockMap.length - 1;

    while (leftBound < rightBound) {
        if (blockMap[leftBound] === "." && blockMap[rightBound] !== ".") {
            blockMap[leftBound] = blockMap[rightBound];
            blockMap[rightBound] = ".";
            leftBound += 1;
            rightBound -= 1;
        } else if (blockMap[leftBound] !== ".") {
            leftBound += 1;
        } else if (blockMap[rightBound] === ".") {
            rightBound -= 1;
        }
    }
}

function checkSum(blockMap: string[]) {
    let sum = 0;
    let i = 0;
    while (i < blockMap.length) {
        if (blockMap[i] !== ".") {
            sum += Number(blockMap[i]) * i;
        }
        i++;
    }
    return sum;
}

function moveBlocksPart2(input: string[]) {
    const blockMap = generateBlockMap(input);
    const fileMap = generateFileMap(input);

    for (let i = fileMap.length - 1; i >= 0; i--) {
        const fileId = fileMap[i][0];
        const fileIndex = fileMap[i][1];
        const fileSize = fileMap[i][2];
        const emptyPosition = findEmptyBlocks(blockMap, fileIndex, fileSize);

        if (emptyPosition !== -1) {
            for (let j = emptyPosition; j < emptyPosition + fileSize; j++) {
                blockMap[j] = fileId.toString();
            }
            for (let j = fileIndex; j < fileIndex + fileSize; j++) {
                blockMap[j] = ".";
            }
        }
    }

    return checkSum(blockMap);
}

function findEmptyBlocks(blockMap: string[], endPosition: number, size: number) {
    let emptyPosition = -1;
    let emptySize = 0;

    for (let i = 0; i < endPosition; i++) {
        if (emptySize >= size) {
            break;
        }
        if (blockMap[i] === ".") {
            if (emptyPosition === -1) {
                emptyPosition = i;
            }
            emptySize += 1;
        } else {
            emptyPosition = -1;
            emptySize = 0;
        }
    }

    if (emptySize < size) {
        return -1;
    }

    return emptyPosition;
}

function findBlocks(blockMap: string[], rightBound: number): [string, number, number] {
    let i = rightBound;
    let startBlock = -1;
    let size = 0;
    let fileId = "";

    while (i > 0) {
        if (blockMap[i] !== ".") {
            if (startBlock === -1) {
                startBlock = i;
                fileId = blockMap[i];
            }
            size++;
        } else if (size > 0) {
            break;
        }
        i++;
    }

    return [fileId, startBlock, size];

}

function doPart1(input: string[]) {
    const blockMap = generateBlockMap(input);
    moveBlocks(blockMap);
    return checkSum(blockMap);

}

// const testInput = "2333133121414131402";
// const testArray = testInput.split("");

const input = readFileIntoArray("input.txt");
console.log(`Part 1 answer is ${doPart1(input)}`)
console.log(`Part 2 answer is ${moveBlocksPart2(input)}`)
