import { fetchInput } from "../../fetchInput";
import { sum } from "../../utils";

const data = await fetchInput(2024, 1);

const example = `3   4
4   3
2   5
1   3
3   9
3   3`;

const runData = data;

const lists = runData.split("\n").map(row => row.split("   ").map(n => Number(n)));
const left = lists.map(l => l[0]).sort((a, b) => a - b);
const right = lists.map(l => l[1]).sort((a, b) => a - b);

console.log("Part 1", sum(left.map((i, index) => Math.abs(i - right[index]))))

const occurences: Record<number, number> = {};

let total = 0;
for (const locationId of left) {
    if (occurences[locationId]) {
        total += locationId * occurences[locationId];
    }
    else {
        occurences[locationId] = 0
        for (const lIdRight of right) {
            if (locationId === lIdRight) occurences[locationId] += 1;
        }
        total += locationId * occurences[locationId];
    }
}

console.log("Part 2", total);
