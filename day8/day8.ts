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
    const newMap: string[][] = []
    input.forEach((item) => {
        newMap.push(item.split(""))
    })
    return newMap;
}

function findAntenna(antennaMap: string[][]) {

    const antennaLocations = new Map<string, [number, number][]>()

    for (let i = 0; i < antennaMap.length; i++) {
        for (let j = 0; j < antennaMap[i].length; j++) {
            if (antennaMap[i][j] !== ".") {
                if (antennaLocations.has(antennaMap[i][j])) {
                    antennaLocations.get(antennaMap[i][j])?.push([i, j])
                } else {
                    antennaLocations.set(antennaMap[i][j], [[i, j]])
                }
            }
        }
    }

    return antennaLocations;

}

function getPairs(typeLocations: [number, number][]) {
    const pairs: [[number, number], [number, number]][] = []
    for (let i = 0; i < typeLocations.length - 1; i++) {
        typeLocations.slice(i + 1).forEach((item: [number, number]) => {
            pairs.push([typeLocations[i], item])
        })
    }

    return pairs;
}

function getAntinodes(pair: [[number, number], [number, number]]): [[number, number], [number, number]] {
    const num1 = pair[0];
    const num2 = pair[1];
    const diff = [num1[0] - num2[0], num1[1] - num2[1]];

    const newNum1: [number, number] = [num1[0] + diff[0], num1[1] + diff[1]];
    const newNum2: [number, number] = [num2[0] - diff[0], num2[1] - diff[1]];
    return [newNum1, newNum2];

}

function getAntinodesLine(pair: [[number, number], [number, number]], barrierY: number, barrierX: number) {
    const num1 = pair[0];
    const num2 = pair[1];
    const diff = [num1[0] - num2[0], num1[1] - num2[1]];
    const antinodeList: [number, number][] = [];
    let newNum: [number, number] = num1
    let i = 0;

    while (newNum[0] >= 0 && newNum[1] >= 0 && newNum[0] < barrierY && newNum[1] < barrierX) {
        antinodeList.push(newNum);
        i++;
        newNum = [num1[0] + i * diff[0], num1[1] + i * diff[1]]
    }

    newNum = num2;
    i = 0;

    while (newNum[0] >= 0 && newNum[1] >= 0 && newNum[0] < barrierY && newNum[1] < barrierX) {
        antinodeList.push(newNum);
        i++;
        newNum = [num2[0] - i * diff[0], num2[1] - i * diff[1]]
    }

    return antinodeList;
}

function findUniqueAntinodes(map: string[][]) {
    const antennaLocations = findAntenna(map)
    const uniqueAntinodes = new Set<string>()

    antennaLocations.forEach((locations, type) => {
        const pairs = getPairs(locations)
        pairs.forEach(pair => {
            const antinodes = getAntinodes(pair)
            antinodes.forEach(antinode => {
                if (antinode[0] >= 0 && antinode[1] >= 0 && antinode[0] < map.length && antinode[1] < map[0].length) {
                    uniqueAntinodes.add(antinode.toString())
                }
            })
        })
    })

    return uniqueAntinodes.size;
}

function findUniqueAntinodesPart2(map: string[][]) {
    const antennaLocations = findAntenna(map)
    const uniqueAntinodes = new Set<string>()

    antennaLocations.forEach((locations, type) => {
        const pairs = getPairs(locations)
        pairs.forEach(pair => {
            const antinodes = getAntinodesLine(pair, map.length, map[0].length)
            antinodes.forEach(antinode => {
                uniqueAntinodes.add(antinode.toString())
            })
        })
    })

    return uniqueAntinodes.size;
}

const input = readFileIntoArray("input.txt");
const map = createMap(input);

console.log(`Part 1 answer: ${findUniqueAntinodes(map)}`);
console.log(`Part 2 answer: ${findUniqueAntinodesPart2(map)}`);

