import { fetchInput } from "../../fetchInput";
import { Coordinate as UtilCoordinate, range } from "../../utils";

const data = await fetchInput(2024, 6);
const example = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

const input = data;

class Coordinate extends UtilCoordinate {
    value: string;
    constructor(x: number, y: number, value: string) {
        super(x, y);
        this.value = value;
    }

    get isObstacle() {
        return this.value === "#";
    }

    get isGuard() {
        return this.value === "^"
    }

    equals(c: {x: number, y: number}) {
        return this.x === c.x && this.y === c.y;
    }
}

class Guard extends Coordinate {
    dx: number;
    dy: number;
    seenPositions: Set<string>;
    seenVectors: Set<string>;
    looped: boolean;
    constructor(x: number, y: number, value: string) {
        super(x, y, value);
        this.dx = 0;
        this.dy = -1;
        this.looped = false;

        this.seenVectors = new Set<string>([this.serialiseVector()]);
        this.seenPositions = new Set<string>([this.serialise()]);
    }

    serialiseVector() {
        return `${this.serialise()},${this.dx},${this.dy}`;
    }

    checkNext() {
        return {x: this.x + this.dx, y: this.y + this.dy};
    }

    step() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.detectLoop()) { // detect loop after step, but before new vector has been added to seen
            this.looped = true;
        }
        this.seenPositions.add(this.serialise());
        this.seenVectors.add(this.serialiseVector());
    }

    turn() {
        const temp = this.dy * -1;
        this.dy = this.dx;
        this.dx = temp;
    }

    inGrid(_maxX: number, _maxY: number) {
        if (this.x <= 0) return false;
        if (this.y <= 0) return false;
        if (this.x >= _maxX) return false;
        if (this.y >= _maxY) return false;
        return true;
    }

    detectLoop() {
        return this.seenVectors.has(this.serialiseVector());
    }
}
// x y
// 0 -1
// 1 0
// 0 1
// -1 0

function part1() {
    const grid = input.split("\n").map((row, y) => row.split("").map((col, x) => new Coordinate(x, y, col))).flat();
    const last = grid.at(-1)!;
    const maxX = last.x;
    const maxY = last.y;
    
    const obstacles = grid.filter(c => c.isObstacle);
    const _guard = grid.find(c => c.isGuard)!;
    const guard = new Guard(_guard.x, _guard.y, _guard.value);
    while (guard.inGrid(maxX, maxY)) {
        const next = guard.checkNext();
        const isObstacle = obstacles.some(o => o.equals(next));
        if (isObstacle) {
            guard.turn();
        }
        else {
            guard.step();
        }
    }
    console.log("Part 1", guard.seenPositions.size);
    return guard;
}

function part2() {
    const grid = input.split("\n").map((row, y) => row.split("").map((col, x) => new Coordinate(x, y, col))).flat();
    const last = grid.at(-1)!;
    const maxX = last.x;
    const maxY = last.y;

    const _obstacles = grid.filter(c => c.isObstacle);
    const _guard = grid.find(c => c.isGuard)!;
    const p1 = part1();

    function runSimulation(testObstacle: Coordinate) {
        const guard = new Guard(_guard.x, _guard.y, _guard.value);
        const obstacles = [..._obstacles, testObstacle];
        while (guard.inGrid(maxX, maxY)) {
            if (guard.looped) return true;
            const next = guard.checkNext();
            const isObstacle = obstacles.some(o => o.equals(next));
            if (isObstacle) {
                guard.turn();
            }
            else {
                guard.step();
            }
        }
        return false;
    }

    let loops = 0;
    [...p1.seenPositions].forEach(pos => {
        const [x, y] = pos.split(",");
        const coord = new Coordinate(Number(x), Number(y), "#");
        const exists = grid.find(c => c.equals(coord) && c.value !== ".");
        if (!exists && runSimulation(coord)) {
            loops++;
        }
    });
    console.log("Part 2", loops);
}

part2();
