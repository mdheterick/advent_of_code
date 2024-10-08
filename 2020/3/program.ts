import { fetchInput } from "../../fetchInput";

const data = (await fetchInput(2020, 3)).split("\n");

const width = data[0].length;

function calcSlope(dx: number, dy: number) {
    let x = 0;
    let y = 0;
    let trees = 0;
    while (y < data.length) {
        if (data[y][x] === "#") trees = trees + 1;
        x = x + dx;
        y = y + dy;
        if (x >= width) x = x - width;
    }
    return trees;
}

console.log(1, 1, calcSlope(1, 1));
console.log(3, 1, calcSlope(3, 1));
console.log(5, 1, calcSlope(5, 1));
console.log(7, 1, calcSlope(7, 1));
console.log(1, 2, calcSlope(1, 2));
console.log(calcSlope(1, 1) * calcSlope(3, 1) * calcSlope(5, 1) * calcSlope(7, 1) * calcSlope(1, 2));
