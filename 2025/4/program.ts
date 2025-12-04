import { fetchInput } from "../../fetchInput";

import { Coordinate, sum } from "../../utils";

const data = await fetchInput(2025, 4);

const example = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;


const runData = data;

class Cell extends Coordinate {
    isRoll: boolean;
    constructor(x: number, y: number, isRoll: boolean) {
        super(x, y);
        this.isRoll = isRoll;
    }

    canBeReached(grid: Array<Array<Cell>>) {
        return sum([...this.neighbours(grid)].filter(Boolean).map(n => n?.isRoll)) < 4;
    }
}

const grid = Coordinate.createGrid(runData, (x, y, char) => new Cell(x, y, char === "@"));
const flatGrid = grid.flat();

const removedRound1 = flatGrid.filter(c => c.isRoll && c.canBeReached(grid));
console.log("Part 1", removedRound1.length);

let removed: number = 0;
let toRemove = [...removedRound1];
while (toRemove.length) {
    toRemove.forEach(c => {
        c.isRoll = false;
        removed++;
    });
    toRemove = flatGrid.filter(c => c.isRoll && c.canBeReached(grid));
}
console.log("Part 2", removed);
