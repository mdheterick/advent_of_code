import { fetchInput } from "../../fetchInput";
import { sum } from "../../utils";

const data = await fetchInput(2024, 7);

const example = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

const input = data;

class Equation {
    result: number;
    values: number[];
    operations;
    constructor(line: string) {
        const [result, values] = line.split(": ");
        this.result = Number(result);
        this.values = values.split(" ").map(v => Number(v));

        this.operations = {
            "+": (a: number, b: number) => a + b,
            "*": (a: number, b: number) => a * b,
            "||": (a: number, b: number) => Number(a.toString() + b.toString())
        }
    }

    tryOperators(operators: Array<keyof Equation["operations"]>) {
        const [left, ...right] = this.values;
        return operators.some(o => this.runOperator(left, o, right, operators))
    }

    runOperator(left: number, operator: keyof Equation["operations"], right: Array<number>, operators: Array<keyof Equation["operations"]>): boolean {
        if (right.length === 0) return false;
        const output = this.operations[operator](left, right[0]);
        // Pruning
        if (output > this.result) return false;
        // Success
        if (right.length === 1) {
            return output === this.result;
        }
        const [rightValue, ...rest] = right;
        return operators.some(o => this.runOperator(output, o, rest, operators))
    }
}

const equations = input.split("\n").map(e => new Equation(e));

const valid1 = equations.filter(e => e.tryOperators(["+", "*"]));
const valid2 = equations.filter(e => e.tryOperators(["+", "*", "||"]));

console.log("Part 1", sum(valid1.map(v => v.result)));
console.log("Part 2", sum(valid2.map(v => v.result)));
