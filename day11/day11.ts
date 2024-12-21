import * as fs from 'fs';
import * as path from 'path';

class StoneNode {
    data: number;
    next: StoneNode | null;
    constructor(value: number = 0) {
        this.data = value;
        this.next = null;
    }
}

class StoneList {
    head: StoneNode | null;
    size: number;
    constructor(head: StoneNode | null = null) {
        this.head = head;
        this.size = head ? 1 : 0;
    }
}


function readFileIntoArray(filePath: string): string {
    try {
        const absolutePath = path.resolve(filePath); // Resolve to absolute path
         // Read file as UTF-8
        return fs.readFileSync(absolutePath, 'utf-8')
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
}

function createStoneArray(file: string) {
    const stoneArray: number[] = [];
    file.split(' ').forEach(stone => {
        stoneArray.push(Number(stone));
    })
    return stoneArray;
}

function createStoneList(stoneArray: number[]) {
    let curNode = new StoneNode();
    let prevNode: StoneNode | null = null;
    const stoneList = new StoneList();
    stoneArray.forEach(stone => {
        curNode = new StoneNode(stone);
        stoneList.size += 1;
        if (prevNode) {
            prevNode.next = curNode;
        }
        if (!stoneList.head) {
            stoneList.head = curNode
        }
        prevNode = curNode;

    })

    return StoneList;
}

function splitNode(curNode: StoneNode, prevNode: StoneNode | null)

function blink(stoneList: StoneList) {
    let prevNode: StoneNode | null = null;
    let curNode = stoneList.head;

    if (!curNode) {
        return;
    }

    let nextNode: StoneNode | null = curNode.next;

    while (curNode.next) {
        if (curNode.data === 0) {
            curNode.data = 1;
        }
        if (curNode.data.toString().length % 2 === 0) {
            splitNode(curNode, prevNode);
            stoneList.size += 2
        }
        prevNode = curNode;
        curNode = curNode.next;
        nextNode = curNode.next;
    }

}

const file = "125 17"
const stoneArray = createStoneArray(file)
const stoneList = createStoneList(stoneArray);
console.log(stoneArray);

