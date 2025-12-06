import { fetchInput } from "../../fetchInput";
import { range, sum } from "../../utils";

const data = await fetchInput(2025, 6);

const example = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `;


const runData = data;

const cells1 = runData.split("\n").map(r => r.trim().split(/\s+/g));

class Equation {
    operator: "+" | "*";
    operands: number[];
    operatorMap: { "+": (a: number, b: number) => number; "*": (a: number, b: number) => number; };
    constructor(stuff: Array<string>) {
        const operator = stuff.at(-1);
        this.operator = operator === "+" ? "+" : "*";
        this.operands = stuff.slice(0, stuff.length - 1).map(o => Number(o));

        this.operatorMap = {
            "+": this.add,
            "*": this.multiply
        }
    }

    add(a: number, b: number) {
        return a + b;
    }

    multiply(a: number, b: number) {
        return a * b;
    }

    solve() {
        const [first, ...operands] = this.operands;
        return operands.reduce<number>((result, o) => this.operatorMap[this.operator](result, o), first);
    }
}


const equations1 = range(cells1[0].length).map(i => {
    return new Equation(cells1.map(row => row[i]));
});

console.log("Part 1", sum(equations1.map(e => e.solve())));

// So messy, don't try to understand
const charGrid = runData.split("\n").map(row => row.split(""));
const transposed: Array<Array<string>> = [];
let entries: Array<string> = [];
let operator = "+";
let rowIndex = 0;
charGrid[0].forEach((c, i) => {
    const column = charGrid.map(row => row[i]);
    const last = column[column.length - 1];
    if (["+", "*"].includes(last)) {
        operator = last;
    }
    column.pop();
    if (column.every(r => r === " ")) {
        transposed.push([...entries, operator]);
        entries = [];
        rowIndex = 0;
    }
    else {
        entries.push(column.join(""));
        rowIndex++;
    }
});
console.log(transposed)
transposed.push([...entries, operator]);
const equations2 = transposed.map(t => new Equation(t));
console.log("Part 2", sum(equations2.map(e => e.solve())));

