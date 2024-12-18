import { fetchInput } from "../../fetchInput";
import { Coordinate, range, sum } from "../../utils";

const data = await fetchInput(2024, 15);

const example = `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`;

const example2 = `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`;

const input = example;

const dirMap: Record<string, [number, number]> = {
    "<": [-1, 0],
    ">": [1, 0],
    "^": [0, -1],
    "v": [0, 1]
};

class Robot extends Coordinate {
    constructor(x: number, y: number) {
        super(x, y);
    }

    get symbol() {
        return "@";
    }

    runMove(move: string, grid: Array<Coordinate>) {
        const dir = dirMap[move];
        const existing = grid.find(e => e.matches(this.x + dir[0], this.y + dir[1]));
        if (!existing) {
            this.move(dir);
        }
        else if (existing instanceof Wall) {
            // do nothing
        }
        else if (existing instanceof Box) {
            if (existing.canMove(dir, grid)) {
                existing.move(dir, grid);
                this.move(dir);
            }
        }
    }

    move(dir: [number, number]) {
        this.x = this.x + dir[0];
        this.y = this.y + dir[1];
    }
}

class Wall extends Coordinate {
    get symbol() {
        return "#";
    }
}

class Box extends Coordinate {
    get symbol() {
        return "O";
    }

    canMove(dir: [number, number], grid: Array<Coordinate>): boolean {
        const next = grid.find(e => e.matches(this.x + dir[0], this.y + dir[1]));
        if (!next) return true;
        if (next instanceof Box) return next.canMove(dir, grid);
        if (next instanceof Robot) throw new Error("WTF");
        return false;
    }
    
    move(dir: [number, number], grid: Array<Coordinate>) {
        const next = grid.find(e => e.matches(this.x + dir[0], this.y + dir[1]));
        if (next instanceof Box) {
            next.move(dir, grid);
        }
        this.x = this.x + dir[0];
        this.y = this.y + dir[1];
    }

    gps() {
        return this.y * 100 + this.x;
    }
}

function buildEntities(x: number, y: number, col: string) {
    if (col === "@") return new Robot(x, y);
    if (col === "#") return new Wall(x, y);
    if (col === "O") return new Box(x, y);
    return null;
}

function printGrid(maxX: number, maxY: number, entities: Array<Robot | Wall | Box>) {
    const grid: Array<string> = [];
    for (const y of range(maxY)) {
        const row: Array<string> = [];
        for (const x of range(maxX)) {
            const matches = entities.find(e => e.matches(x, y));
            row.push(matches ? matches.symbol : ".");
        }
        grid.push(row.join(""));
    }
    console.log(grid.join("\n"));
}

const [gridRaw, moves] = input.split("\n\n");

const entities = gridRaw.split("\n").map((row, y) => row.split("").map((col, x) => buildEntities(x, y, col))).flat().filter((e): e is Wall | Box | Robot => e !== null);

const robot: Robot = entities.find((e): e is Robot => e.symbol === "@")!;

const maxX = Math.max(...entities.map(e => e.x));
const maxY = Math.max(...entities.map(e => e.y));

for (const move of moves.split("")) {
    if (move === "\n") continue;
    robot.runMove(move, entities);
}
console.log("Part 1", sum(entities.filter((e): e is Box => e instanceof Box).map(b => b.gps())));