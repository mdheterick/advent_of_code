import { fetchInput } from "../../fetchInput";
import { Coordinate, sum } from "../../utils";

const data = await fetchInput(2024, 10);

const example = `0123
1234
8765
9876`;

const example2 = `...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9`;

const example3 = `..90..9
...1.98
...2..7
6543456
765.987
876....
987....`;

const example4 = `10..9..
2...8..
3...7..
4567654
...8..3
...9..2
.....01`;

const example5 = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

const input = data;

class Cell extends Coordinate {
    height: number;
    constructor(x: number, y: number, height: number) {
        super(x, y);
        this.height = height;
    }
}

const grid = input.split("\n").map((row, y) => row.split("").map((col, x) => new Cell(x, y, Number(col))));

const heads = grid.flat().filter(c => c.height === 0);

function followTrail(grid: Array<Array<Cell>>, start: Cell, ends: Set<Cell>): number {
    if (start.height === 9) {
        ends.add(start);
        return 1;
    }
    let total = 0;
    for (const dir of Coordinate.directionsManhattan()) {
        const next = start.getNeighbour(grid, dir[0], dir[1]);
        if (next && (next.height - start.height) === 1) {
            total += followTrail(grid, next, ends);
        }
    }
    return total;
}

const results = heads.map(head => {
    const ends = new Set<Cell>();
    const rating = followTrail(grid, head, ends);
    return [ends.size, rating];
});

console.log("Part 1", sum(results.map(r => r[0])));
console.log("Part 2", sum(results.map(r => r[1])));
