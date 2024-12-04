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

    checkNeighbour(_grid: Array<Array<Coordinate>>, dx: number, dy: number, value: string) {
        const neighbour = this.getNeighbour(_grid, dx, dy);
        if (!neighbour) return false;
        return neighbour.value === value;
    }

    checkSequence(sequence: Array<string>, _grid: Array<Array<Coordinate>>, dx: number, dy: number) {
        for (let i = 0; i < sequence.length; i++) {
            if (!this.checkNeighbour(_grid, dx * i, dy * i, sequence[i])) {
                return false;
            }
        }
        return true;
    }

    findXmas(_grid: Array<Array<Coordinate>>) {
        let count = 0;
        const sequence = ["X", "M", "A", "S"];
        for (const [dx, dy] of this.directions2d()) {
            if (this.checkSequence(sequence, _grid, dx, dy)) {
                count++;
            }
        }
        return count;
    }

    findCrossMas(_grid: Array<Array<Coordinate>>) {
        const topLeft = this.getNeighbour(_grid, -1, -1);
        const topRight = this.getNeighbour(_grid, 1, -1);
        const bottomLeft = this.getNeighbour(_grid, -1, 1);
        const bottomRight = this.getNeighbour(_grid, 1, 1);
        if (topLeft && topRight && bottomLeft && bottomRight) {
            const forwardDiagonal = [bottomLeft.value, topRight.value];
            const backDiagonal = [bottomRight.value, topLeft.value];
            const diagonals = [forwardDiagonal, backDiagonal];
            for (const diag of diagonals) {
                // Both diagonal couplets must have both M and S to form crossMas
                if (!(diag.includes("M") && diag.includes("S"))) {
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

console.log("Part 1", sum(exes.map(s => s.findXmas(grid))));

const as = grid.flat().filter(c => c.value === "A");

console.log("Part 2", as.filter(a => a.findCrossMas(grid)).length);
