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

const input = data;

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

    symbol(x: number, y: number) {
        return "@";
    }

    runMove(move: string, grid: Array<Robot | Wall | Box>) {
        const dir = dirMap[move];
        const existing = grid.find(e => e.matches(
            this.x + dir[0],
            this.y + dir[1]
        ));
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
    symbol(x: number, y: number) {
        return "#";
    }

    matches(x: number, y: number) {
        return this.y === y && (this.x === x || this.x + 1 === x);
    }
}

class Box {
    right: Coordinate;
    left: Coordinate;
    constructor(x: number, y: number) {
        this.left = new Coordinate(x, y);
        this.right = new Coordinate(x + 1, y);
    }
    symbol(x: number, y: number) {
        if (this.left.x === x) return "[";
        return "]";
    }

    matches(x: number, y: number) {
        return this.left.matches(x, y) || this.right.matches(x, y);
    }

    gps() {
        return this.left.y * 100 + this.left.x;
    }

    canMove(dir: [number, number], grid: Array<Robot | Wall | Box>): boolean {
        let next = this.findNext(dir, grid);
        if (next.length === 0) return true;
        if (next.every((e): e is Box => e instanceof Box)) return next.every(b => b.canMove(dir, grid));
        if (next instanceof Robot) throw new Error("WTF");
        return false;
    }

    findNext(dir: [number, number], grid: Array<Robot | Wall | Box>) {
        let next = [
            ...grid.filter(e => e.matches(this.left.x + dir[0], this.left.y + dir[1])),
            ...grid.filter(e => e.matches(this.right.x + dir[0], this.right.y + dir[1]))
        ];
        next = next.filter(e => e !== this);
        const nextSet = new Set(next);
        return [...nextSet];
    }
    
    move(dir: [number, number], grid: Array<Robot | Wall | Box>) {
        let next = this.findNext(dir, grid);
        next.forEach(n => {
            if (n instanceof Box) {
                n.move(dir, grid);
            }
        });
        this.left.x = this.left.x + dir[0];
        this.right.x = this.right.x + dir[0];
        this.left.y = this.left.y + dir[1];
        this.right.y = this.right.y + dir[1];
    }
}

function buildEntities(x: number, y: number, col: string) {
    if (col === "@") return new Robot(x * 2, y);
    if (col === "#") return new Wall(x * 2, y);
    if (col === "O") return new Box(x * 2, y);
    return null;
}

function printGrid(maxX: number, maxY: number, entities: Array<Robot | Wall | Box>) {
    const grid: Array<string> = [];
    for (const y of range(maxY)) {
        const row: Array<string> = [];
        for (const x of range(maxX)) {
            const matches = entities.find(e => e.matches(x , y));
            row.push(matches ? matches.symbol(x, y) : ".");
        }
        grid.push(row.join(""));
    }
    return grid.join("\n");
}

const [gridRaw, moves] = input.split("\n\n");

const entities = gridRaw.split("\n").map((row, y) => row.split("").map((col, x) => buildEntities(x, y, col))).flat().filter((e): e is Wall | Box | Robot => e !== null);
const robot: Robot = entities.find((e): e is Robot => e instanceof Robot)!;

const maxX = Math.max(...entities.map(e =>  e instanceof Wall ? e.x : 0));
const maxY = Math.max(...entities.map(e => e instanceof Wall ? e.y : 0));

let count = 0;
for (const move of moves.split("")) {
    if (move === "\n") continue;
    robot.runMove(move, entities);
    count++;
}
// console.log(printGrid(maxX + 2, maxY + 1, entities));
console.log("Part 2", sum(entities.filter((e): e is Box => e instanceof Box).map(b => b.gps())));
