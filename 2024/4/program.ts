import { fetchInput } from "../../fetchInput";
import { sum, Coordinate as UtilCoordinate } from "../../utils";

const data = await fetchInput(2024, 4);

const example = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

const input = data;


class Coordinate extends UtilCoordinate {
    value: string;
    constructor(x: number, y: number, value: string) {
        super(x, y);
        this.value = value;
    }

    checkXmas(_grid: Array<Array<Coordinate>>, dx: -1 | 0 | 1, dy: -1 | 0 | 1, value: "X" | "M" | "A" | "S"): boolean {
        const sequence = ["X", "M", "A", "S"] as const;
        if (grid[this.y + dy] && grid[this.y + dy][this.x + dx] && grid[this.y + dy][this.x + dx].value === value) {
            if (value === "S") {
                return true
            }
            return grid[this.y + dy][this.x + dx].checkXmas(_grid, dx, dy, sequence[sequence.indexOf(value) + 1])
        }
        return false;
    }

    findXmas(_grid: Array<Array<Coordinate>>) {
        let count = 0;
        for (const [dx, dy] of this.directions2d()) {
            if (this.checkXmas(_grid, dx, dy, "M")) {
                count++;
            }
        }
        return count;
    }

    findCrossMas(_grid: Array<Array<Coordinate>>) {
        const topLeft = _grid[this.y - 1] && _grid[this.y - 1][this.x - 1];
        const topRight = _grid[this.y - 1] && _grid[this.y - 1][this.x + 1];
        const bottomLeft = _grid[this.y + 1] && _grid[this.y + 1][this.x - 1];
        const bottomRight = _grid[this.y + 1] && _grid[this.y + 1][this.x + 1];
        if (topLeft && topRight && bottomLeft && bottomRight) {
            const forwardDiagonal = [bottomLeft, topRight];
            const backDiagonal = [bottomRight, topLeft];
            const diagonals = [forwardDiagonal, backDiagonal];
            for (const d of diagonals) {
                const values = d.map(c => c.value);
                if (!(values.includes("M") && values.includes("S"))) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
}

const grid = input.split("\n").map((row, y) => row.split("").map((c, x) => new Coordinate(x, y, c)));

const exes = grid.flat().filter(c => c.value === "X");

console.log(sum(exes.map(s => s.findXmas(grid))));

const as = grid.flat().filter(c => c.value === "A");

console.log(as.filter(a => a.findCrossMas(grid)).length);
