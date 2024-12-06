import * as fs from 'fs';
import * as path from 'path';

function extractMul(paragraph: string) {
    const regex = /mul\(\d+,\d+\)/g;

    return paragraph.match(regex);
}

function extractMultiply(value: string) {
    const regex = /\d+/g

    const digits = value.match(regex)

    if (!digits) {
        return 0;
    }

    const numbers = digits.map((val) => Number(val));
    return numbers[0] * numbers[1]

}

function totalInstructions(program: string) {
    const lines = extractMul(program);
    let total = 0;

    if (lines) {
        lines.forEach(line => {
            total += extractMultiply(line);
        })
    }

    return total;

}

function readFile(filePath: string): string {
    try {
        const absolutePath = path.resolve(filePath); // Resolve to absolute path
        return fs.readFileSync(absolutePath, 'utf-8'); // Read file as UTF-8
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
}

function getEnabledPortions(program: string) {
    const regex = /do\(\)|don't\(\)/g

    const matches = program.matchAll(regex);
    const enabled = [[0, true]];
    matches.forEach(match => {
        // console.log(match);
        if (match[0] === "do()") {
            enabled.push([match.index, true]);
        } else {
            enabled.push([match.index, false]);
        }

    })

    return enabled;
}

function extractMulPart2(program: string) {
    const regex = /mul\(\d+,\d+\)/g;

    return Array.from(program.matchAll(regex)).map((match) => [match.index, match[0]]);
}

function totalEnabledInstructions(program: string) {
    const enabledList = getEnabledPortions(program);
    const multList = extractMulPart2(program);
    const programLength = program.length;
    const enabledRange = []

    for (let i = 0; i < enabledList.length - 1; i++) {
        enabledRange.push([enabledList[i][0], enabledList[i + 1][0], enabledList[i][1]]);
    }

    enabledRange.push([enabledList[enabledList.length - 1][0], programLength, enabledList[enabledList.length - 1][1]]);

    let elIndex = 0;
    let enabled = true;
    let total = 0;

    multList.forEach((mult) => {

        while (elIndex < enabledRange.length && mult[0] > enabledRange[elIndex][1]) {
            elIndex++;
            enabled = enabledRange[elIndex][2]
        }

        if (enabled) {
            total += extractMultiply(mult[1]);
        }

    })
    return total;

}

// const testInput = "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))"
// const testInput2 = 'mul(11,8)'
// console.log(extractMul(testInput));
// console.log(extractMultiply(testInput2));
// console.log(totalInstructions(testInput));

const input = readFile("input.txt");
console.log(`Part 1 answer: ${totalInstructions(input)}`)
console.log(`Part 2 answer: ${totalEnabledInstructions(input)}`)


// console.log(getEnabledPortions(testInput));
// console.log(extractMulPart2(testInput));
// console.log(totalEnabledInstructions(testInput));

