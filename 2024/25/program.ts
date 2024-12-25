import { fetchInput } from "../../fetchInput";

const data = await fetchInput(2024, 25);

const example = ``;

const input = example;
const things = input.split("\n\n");

function numHashes(row) {
    return row.split("").reduce((total, char) => total + (char === "#"), 0);
}
function isLock(b) {
    const rows = b.split("\n");
    return numHashes(rows[0]) > 3;
}

function convertToHeights(b) {
    const grid = b.split("\n").map(r => r.split(""))
    const heights = [];
    for (let i = 0; i < 5; i++) {
        let height = -1;
        for (const row of grid) {
            if (row[i] === "#") {
                height++;
            }
        }
        heights.push(height);
    }
    return heights;
}

const keys = things.filter(t => !isLock(t)).map(t => convertToHeights(t));
const locks = things.filter(t => isLock(t)).map(t => convertToHeights(t));
let total = 0;
for (const key of keys) {
    for (const lock of locks) {
        const overlaps = lock.reduce((over, lh, i) => {
            return over || ((lh + key[i]) > 5);
        }, false);
        if (!overlaps) total++;
    }
}
console.log(total);
