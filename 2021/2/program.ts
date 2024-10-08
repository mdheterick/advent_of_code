import { fetchInput } from "../../fetchInput";

const data = (await fetchInput(2021, 2)).split("\n");

const testData = [
    "forward 5",
    "down 5",
    "forward 8",
    "up 3",
    "down 8",
    "forward 2",
];

const runData = data;


function part1(input: typeof runData) {
    function parseStep(step: string) {
        const [direction, magnitude] = step.split(" ");
        let reverseDepth = 1;
        if (direction === "up") reverseDepth = -1;
        return {
            direction: direction === "forward" ? "h" : "d",
            magnitude: reverseDepth * parseInt(magnitude, 10)
        } as const;
    }

    const position = {
        h: 0,
        d: 0
    };

    input.forEach(step => {
        const {direction, magnitude} = parseStep(step);
        position[direction] += magnitude;
    });
    return position.h * position.d;
}

function part2(input: typeof runData) {
    const position = {
        h: 0,
        d: 0,
        a: 0
    };

    input.forEach(step => {
        const [direction, mag] = step.split(" ");
        let reverseDepth = 1;
        if (direction === "up") reverseDepth = -1;
        const magnitude = reverseDepth * parseInt(mag, 10);
        if (direction === "forward") {
            position.h += magnitude;
            position.d += position.a * magnitude;
        }
        else {
            position.a += magnitude;
        }
    });
    return position.h * position.d;
}

console.log(part1(runData));

console.log(part2(runData));
