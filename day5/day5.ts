import * as fs from 'fs';
import * as path from 'path';

function createOrderMap(orderArray: string[]) {
    const orderMap = new Map<number, number[]>();
    orderArray.forEach(order => {
        const [former, latter] = order.split("|");
        const beforeArray = orderMap.get(Number(latter));
        if (beforeArray) {
            beforeArray.push(Number(former));
        } else {
            orderMap.set(Number(latter), [Number(former)]);
        }
    })
    return orderMap;
}

function isCorrectUpdate(update: string, orderMap: Map<number, number[]>) {
    const updateArray = update.split(',');
    let isCorrect = true;
    const notAllowed = new Set<number>()

    updateArray.forEach(update => {
        const num = Number(update);
        if (notAllowed.has(num)) {
            isCorrect = false;
            return;
        }
        orderMap.get(num)?.forEach((prev) => {
            notAllowed.add(prev);
        })
    })

    if (isCorrect) {
        return Number(updateArray[(updateArray.length - 1) / 2])
    }

    return 0;
}

function isIncorrectUpdate(update: string, orderMap: Map<number, number[]>) {
    const updateArray = update.split(',').map(value => Number(value));
    let isCorrect = true;
    const notAllowed = new Set<number>()

    updateArray.forEach(update => {
        if (notAllowed.has(update)) {
            isCorrect = false;
            return;
        }
        orderMap.get(update)?.forEach((prev) => {
            notAllowed.add(prev);
        })
    })

    if (isCorrect) {
        return 0;
    }

    const countArray: number[][] = [];

    updateArray.forEach(update => {
        let total = 0;
        const afterArray = orderMap.get(update);
        if (afterArray) {
            updateArray.forEach(num => {
                if (afterArray.includes(num)) {
                    total += 1;
                }
            })
        }
        countArray.push([update, total])

    });

    countArray.sort((a, b) => a[1] - b[1]);
    return countArray[(countArray.length - 1) / 2][0];
}

function totalUpdate(updateArray: string[], orderArray: string[], updateFunction: Function) {
    const orderMap = createOrderMap(orderArray);
    // console.log(orderMap);
    let total = 0;

    updateArray.forEach(update => {
        total += updateFunction(update, orderMap);
    })

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

function splitArray(input: string[]) {
    let index = input.findIndex((x) => x === "");
    return [input.slice(0, index), input.slice(index + 1)];
}


const file = readFileIntoArray("input.txt");
const [orderArray, updateArray] = splitArray(file);

console.log(`Part 1 answer: ${totalUpdate(updateArray, orderArray, isCorrectUpdate)}`);
console.log(`Part 2 answer: ${totalUpdate(updateArray, orderArray, isIncorrectUpdate)}`);
