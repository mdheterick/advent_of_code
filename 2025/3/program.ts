import { fetchInput } from "../../fetchInput";
import { sum } from "../../utils";

const data = await fetchInput(2025, 3);

const example = `987654321111111
811111111111119
234234234234278
818181911112111`;

const runData = data;

class Bank {
    batteries: number[];
    constructor(line: string) {
        this.batteries = line.split("").map(b => Number(b));
    }

    largestJoltage(depth: number) {
        const out = this.calculateJoltage(this.batteries, depth)?.join("");
        return Number(out);
    }

    // recursively check the next highest number to find the best candidate
    // bail if there's not enough numbers left in the set to make up the required depth
    // check is guaranteed to find the best set of numbers due to the sorting, so just need to rule out any sequences
    // that can't fit, the first sequence of required depth found is necessarily the best
    calculateJoltage(batteries: Array<number>, depth: number): Array<number> | null {
        const sorted = [...batteries].sort((a, b) => b - a);
        if (depth === 1) {
            return [sorted[0]]
        }
        for (const battery of sorted) {
            const index = batteries.indexOf(battery)
            if (index >= batteries.length + 1 - depth) continue; // not enough length left
            const next = this.calculateJoltage(batteries.slice(index + 1), depth - 1);
            if (next !== null) { // a full length sequence has been found
                return [battery, ...next];
            }
        }
        // never actually hit here, the length check in the loop already filters out invalid length candidates
        return null;
    }
}

const banks = runData.split("\n").map(line => new Bank(line));

console.log("Part 1", sum(banks.map(b => b.largestJoltage(2))));
console.log("Part 2", sum(banks.map(b => b.largestJoltage(12))));

