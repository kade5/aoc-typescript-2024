import * as fs from 'fs';
import * as path from 'path';

function isReportSafe(report: number[]) {
    let isIncreasing: boolean;
    let previousItem = report[0]

    for (let i = 1; i < report.length; i++) {
        const diff = report[i] - previousItem;
        if (Math.abs(diff) > 3 || diff === 0) {
            return false;
        }
        if (isIncreasing === undefined) {
            isIncreasing = diff > 0;
        }
        else if (isIncreasing && diff < 0) {
            return false;
        } else if (!isIncreasing && diff > 0){
            return false;
        }
        previousItem = report[i];

    }

    return true;
}

function dampenerBruteForce(report: number[]) {
    if (isReportSafe(report)) {
        return true
    }

    for (let i = 0; i < report.length; i++) {
        let sideA = report.slice(0, i);
        let sideB = report.slice(i + 1);
        if (isReportSafe(sideA.concat(sideB))) {
            return true
        }
    }
    return false;
}

function isReportSafeDampener(report: number[], skip: boolean = false) {
    let isIncreasing: boolean;
    let previousItem = report[0];

    for (let i = 1; i < report.length; i++) {
        const diff = report[i] - previousItem;
        if (Math.abs(diff) > 3 || diff === 0) {
            if (!skip) {
                skip = true;
                continue;
            }
            return false;
        }
        if (isIncreasing === undefined) {
            isIncreasing = diff > 0;
        }
        else if (isIncreasing && diff < 0) {
            if (!skip) {
                skip = true;
                continue;
            }
            return false;
        } else if (!isIncreasing && diff > 0){
            if (!skip) {
                skip = true;
                continue;
            }
            return false;
        }

        previousItem = report[i];

    }

    return true;
}

function withDampenerFull(report: number[]) {
    if (!isReportSafeDampener(report)) {
        return isReportSafeDampener(report.slice(1), true);
    }
    return true;
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

function createReportsArray(fileArray: string[]) {
    let reportsArray: string[][] = [];
    fileArray.forEach(report => {
        let reportArray = report.split(" ")
        reportsArray.push(reportArray);
    })

    return reportsArray.map( report  => {return report.map((value: string) => {return Number(value)}); });

}

function countSafeReports(reports : number[][], fn: Function) {
    let count = 0;
    reports.forEach(report => {
        let isSafe = fn(report);
        // console.log(isSafe);
        if (isSafe) {
            count++;
        }
    })

    return count;
}

function testCountReportSafe() {
    const test = [[7, 6, 4, 2, 1],
     [1, 2, 7, 8, 9],
     [1, 3, 2, 4, 5],
     [9, 7, 6, 2, 1],
     [8, 6, 4, 4, 1],
     [1, 3, 6, 7, 9]]
    console.log(countSafeReports(test, isReportSafe));
}

function testCountReportSafeDampener() {
    const test = [[7, 6, 4, 2, 1],
        [1, 2, 7, 8, 9],
        [1, 3, 2, 4, 5],
        [9, 7, 6, 2, 1],
        [8, 6, 4, 4, 1],
        [1, 3, 6, 7, 9]]
    console.log(countSafeReports(test, withDampenerFull));
}

function testIsReportSafe() {
    const test1 = [7, 6, 4, 2, 1]
    const test2 = [1, 2, 7, 8, 9]
    const test3 = [1, 3, 2, 4, 5]
    const test4 = [9, 7, 6, 2, 1]
    const test5 = [8, 6, 4, 4, 1]
    const test6 = [1, 3, 6, 7, 9]

    console.log(isReportSafe(test1));
    console.log(isReportSafe(test2));
    console.log(isReportSafe(test3));
    console.log(isReportSafe(test4));
    console.log(isReportSafe(test5));
    console.log(isReportSafe(test6));
}

function testIsReportSafeDampener() {
    const test1 = [7, 6, 4, 2, 1]
    const test2 = [1, 2, 7, 8, 9]
    const test3 = [1, 3, 2, 4, 5]
    const test4 = [9, 7, 6, 2, 1]
    const test5 = [8, 6, 4, 4, 1]
    const test6 = [1, 3, 6, 7, 9]
    const test7 = [7, 4, 6, 8, 10]

    console.log(dampenerBruteForce(test1));
    console.log(dampenerBruteForce(test2));
    console.log(dampenerBruteForce(test4));
    console.log(dampenerBruteForce(test3));
    console.log(dampenerBruteForce(test5));
    console.log(dampenerBruteForce(test6));
    console.log(dampenerBruteForce(test7));
}


const test7 = [86, 85, 86, 89, 92, 94, 97]
console.log(isReportSafeDampener(test7));
//
// testIsReportSafe();
// testCountReportSafe();
// testIsReportSafeDampener();
// testCountReportSafeDampener();

const testArray = createReportsArray(readFileIntoArray('input.txt'));
// console.log(`Part 1 Answer: ${countSafeReports(testArray, isReportSafe)}`);
console.log(`Part 2 Answer: ${countSafeReports(testArray, isReportSafeDampener)}`);
