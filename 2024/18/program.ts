import { fetchInput } from "../../fetchInput";
import { Coordinate, bisectSearch, range } from "../../utils";

const data = await fetchInput(2024, 18);

const example = `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`;

const exampleMax = {x: 6, y: 6};
const _max = {x: 70, y: 70};

class Memory extends Coordinate {
    corrupted: boolean;
    constructor(x: number, y: number) {
        super(x, y);
        this.corrupted = false;
    }
}

function printGrid(max: typeof _max, memory: Array<Memory>) {
    const grid: Array<string> = [];
    for (const y of range(max.y)) {
        const row: Array<string> = [];
        for (const x of range(max.x)) {
            const corrupted = memory.filter(r => r.matches(x, y)).some(r => r.corrupted);
            row.push(corrupted ? "#" : ".");
        }
        grid.push(row.join(""));
    }
    console.log(grid.join("\n"));
}

function traverseHops(start: typeof _max, hops: Record<string, string>) {
    let count = 0;
    let current = JSON.stringify(start);
    while (hops[current]) {
        current = hops[current];
        count++;
    }
    return count;
}

function inBounds(coord: typeof _max, max: typeof _max) {
    if (coord.x < 0) return false;
    if (coord.y < 0) return false;
    if (coord.x > max.x) return false;
    if (coord.y > max.y) return false;
    return true;
}

function part1(input: string, max: typeof _max, start: typeof _max, numBytes: number) {
    const coordinates = input.split("\n").map(c => new Memory(Number(c.split(",")[0]), Number(c.split(",")[1])))
    coordinates.slice(0, numBytes).forEach(c => (c.corrupted = true));
    
    const seen = new Set<string>();
    const toCheck = [start];
    seen.add(JSON.stringify(start));

    const hops: Record<string, string> = {};
    while (toCheck.length) {
        const current = toCheck.shift()!;
        if (current.x === max.x && current.y === max.y) {
            return traverseHops(max, hops);
        }
        for (const dir of Coordinate.directionsManhattan()) {
            const coordinate = {x: current.x + dir[0], y: current.y + dir[1]};
            if (inBounds(coordinate, max) && !seen.has(JSON.stringify(coordinate))) {
                const existing = coordinates.find(c => c.matches(coordinate.x, coordinate.y));
                if (!existing || !existing.corrupted) {
                    toCheck.push(coordinate);
                    hops[JSON.stringify(coordinate)] = JSON.stringify(current);
                }
                seen.add(JSON.stringify(coordinate));
            }
        }
    }
    throw new Error("Didn't each end");
}

function part2(input: string, max: typeof _max, start: typeof _max, minSafe: number) {
    const coordinates = input.split("\n").map(c => new Memory(Number(c.split(",")[0]), Number(c.split(",")[1])));
    const index = bisectSearch((search: number) => {
        try {
            part1(input, max, start, search);
            return false;
        }
        catch (error) {
            return true;
        }
    }, coordinates.length, minSafe);
    const coordinate = coordinates[index - 1];
    return `${coordinate.x},${coordinate.y}`;
}

// console.log("Part 1", part1(example, exampleMax, {x: 0, y: 0}, 12));
console.log("Part 1", part1(data, _max, {x: 0, y: 0}, 1024));
// console.log(part2(example, exampleMax, {x: 0, y: 0}, 12));
console.log("Part 2", part2(data, _max, {x: 0, y: 0}, 1024));
