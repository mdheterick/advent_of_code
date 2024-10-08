import { fetchInput } from "../../fetchInput";

const data = (await fetchInput(2021, 1)).split("\n");
const dataNumbers = data.map(d => parseInt(d, 10));

const testData = [
    199,
    200,
    208,
    210,
    200,
    207,
    240,
    269,
    260,
    263,
];

const runData = dataNumbers;

function part1(input: typeof runData) {
    let increments = 0;
    for (let i = 1; i < input.length; i++) {
        if (input[i] > input[i-1]) increments++
    }
    return increments;
}

function part2(input: typeof runData) {
    // Each window shares two values so comparings windows reduces down to comparing the values that aren't in either
    let increments = 0;
    for (let i = 0; i < input.length - 3; i++) {
        if (input[i+3] > input[i]) increments++;
    }
    return increments;
}

console.log(part1(runData));

console.log(part2(runData));
