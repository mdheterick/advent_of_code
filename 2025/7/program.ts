import { fetchInput } from "../../fetchInput";
import { Coordinate, sum } from "../../utils";

const data = await fetchInput(2025, 7);

const example = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`;

const runData = data;

class Cell extends Coordinate {
    char: string;
    beamed: boolean;
    timelines: number;
    constructor(x: number, y: number, char: string) {
        super(x, y);
        this.char = char;
        this.beamed = false;
        this.timelines = 0;
    }

    getNextCell(grid: Array<Array<Cell>>) {
        return this.getNeighbour(grid, 0, 1);
    }

    beamNextCells(grid: Array<Array<Cell>>) {
        const next = this.getNextCells(grid);
        next.forEach(c => (c.beamed = true));
        return next.length - 1;
    }

    getNextCells(grid: Array<Array<Cell>>) {
        if (this.char === "^") {
            return [this.getNeighbour(grid, -1, 1)!, this.getNeighbour(grid, 1, 1)!].filter(Boolean);
        }
        return [this.getNeighbour(grid, 0, 1)!].filter(Boolean);
    }

    canBeam() {
        return this.beamed;
    }

    countTimelines(grid: Array<Array<Cell>>): number {
        if (this.y === grid.length - 1) return 1;
        if (this.timelines) return this.timelines;
        const timelines = sum(this.getNextCells(grid).map(c => c.countTimelines(grid)));
        this.timelines = timelines;
        return timelines;
    }
}

const grid = Coordinate.createGrid(runData, (x, y, char) => new Cell(x, y, char));
const flatGrid = grid.flat();
const start = flatGrid.find(c => c.char === "S");
if (!start) throw new Error();
const totalSteps = grid.length;

start.beamNextCells(grid);
let splits = 0;
for (let step = 1; step < totalSteps - 1; step++) {
    const toHandle = grid[step].filter(c => c.canBeam());
    toHandle.forEach(c => {
        splits += c.beamNextCells(grid);
    });
}
console.log("Part 1", splits);
console.log("Part 2", start.countTimelines(grid));

