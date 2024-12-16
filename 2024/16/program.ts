import { fetchInput } from "../../fetchInput";
import { Coordinate as _Coordinate } from "../../utils";

const data = await fetchInput(2024, 16);

const example = `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`;
const example2 = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`;

const input = data;
const dirMap = {
    "E": [1, 0],
    "W": [-1, 0],
    "N": [0, -1],
    "S": [0, 1]
};
const clockwise = ["E", "S", "W", "N"] as const;
const anticlockwise = [...clockwise].reverse();

class Coordinate extends _Coordinate {
    value: string;
    constructor(x: number, y: number, value: string) {
        super(x, y);
        this.value = value;
    }

    get canMoveTo() {
        return this.value === "." || this.value === "E" || this.value === "S";
    }
}

class Node extends _Coordinate {
    dir: typeof clockwise[number];
    cost: number;
    previous: Array<Node>
    constructor(x: number, y: number, dir: typeof clockwise[number], cost: number, previous: Array<Node>) {
        super(x, y);
        this.dir = dir;
        this.cost = cost;
        this.previous = previous;
    }

    * next(grid: Array<Array<Coordinate>>) {
        for (const next of this._next()) {
            if (this.getNeighbour(grid, next.x - this.x, next.y - this.y)?.canMoveTo && !this.seenBefore(next)) {
                yield next;
            }
        }
    }

    seenBefore(next: Node) {
        return this.previous.map(p => p.serialise()).includes(next.serialise()) || this.previous.slice(0, -1).map(p => p.serialisePoint()).includes(next.serialisePoint());
        // return this.previous.map(p => p.serialise()).includes(next.serialise());
    }

    * _next() {
        const clock = clockwise[(clockwise.indexOf(this.dir) + 1) % clockwise.length];
        const anti = anticlockwise[(anticlockwise.indexOf(this.dir) + 1) % anticlockwise.length];
        const dx = dirMap[this.dir][0];
        const dy = dirMap[this.dir][1];
        yield new Node(this.x + dx, this.y + dy, this.dir, this.cost + 1, [...this.previous, this]);
        yield new Node(this.x, this.y, clock, this.cost + 1000, [...this.previous, this]);
        yield new Node(this.x, this.y, anti, this.cost + 1000, [...this.previous, this]);

    }

    serialise() {
        return `${super.serialise()},${this.dir}`;
    }

    serialisePoint() {
        return super.serialise();
    }
}


const grid = input.split("\n").map((row, y) => row.split("").map((col, x) => new Coordinate(x, y, col)));

const start = grid.flat().find(n => n.value === "S")!;
const end = grid.flat().find(n => n.value === "E")!;

function part1() {
    const startNode = new Node(start.x, start.y, "E", 0, []);
    
    const toCheck: Array<Node> = [startNode];
    const seen = new Set<string>();
    seen.add(startNode.serialise());
    
    while (toCheck.length) {
        const current = toCheck.shift()!;
        if (end.equals(current)) {
            console.log("Part 1", current.cost);
            return current;
        }
        for (const next of current.next(grid)) {
            if (!seen.has(next.serialise())) {
                toCheck.push(next);
                seen.add(next.serialise());
            }
        }
        toCheck.sort((a, b) => a.cost - b.cost);
    }
    throw new Error("failed");
}

function part2(maxCost: Node) {
    const startNode = new Node(start.x, start.y, "E", 0, []);
    
    let toCheck: Array<Node> = [startNode];
    const paths = [maxCost];
    let pathsLength = Number.MAX_SAFE_INTEGER;
    
    while (toCheck.length) {
        const current = toCheck.shift()!;
        if (end.equals(current)) {
            paths.push(current);
            pathsLength = current.previous.length;
            continue;
        }
        const worseThanExisting = paths.some(p => {
            const matchingNode = p.previous.find(n => n.serialisePoint() === current.serialisePoint());
            if (!matchingNode) return false;
            return matchingNode.cost + 1001 < current.cost;
        });
        if (worseThanExisting || (current.previous.length > pathsLength)) continue;
        for (const next of current.next(grid)) {
            const existing = toCheck.some(c => {
                const matchingNode = c.previous.find(n => n.serialisePoint() === next.serialisePoint());
                if (matchingNode) {
                    return matchingNode.cost + 1001 < next.cost;
                }
                return c.equals(next) && c.dir === next.dir && c.cost < next.cost;
            });
            if (!existing) {
                toCheck.push(next);
            }
        }
        toCheck = toCheck.filter(n => n.cost <= maxCost.cost);
    }
    const spaces = new Set(paths.map(p => p.previous.map(n => n.serialisePoint())).flat());
    console.log("Part 2", spaces.size + 1);
}
const maxCost = part1();
part2(maxCost);
