import { fetchInput } from "../../fetchInput";
import { Coordinate } from "../../utils";

const data = await fetchInput(2024, 8);

const example = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;

const example2 = `..........
..........
..........
....a.....
........a.
.....a....
..........
..........
..........
..........`;

const example3 = `T....#....
...T......
.T....#...
.........#
..#.......
..........
...#......
..........
....#.....
..........`;

const input = data;

class Antenna extends Coordinate {
    frequency: string;
    constructor(x: number, y: number, frequency: string) {
        super(x, y);
        this.frequency = frequency;
    }
}

const grid = input.split("\n").map((row, y) => row.split("").map((col, x) => new Antenna(x, y, col)));

const clusters = grid.flat().reduce<Record<string, Array<Antenna>>>((c, a) => {
    if (a.frequency !== "." && a.frequency !== "#") {
        const collection = c[a.frequency] || [];
        collection.push(a);
        c[a.frequency] = collection;
    }
    return c;
}, {});

const maxX = grid[0].length;
const maxY = grid.length;

function isValid(anode: Coordinate, _maxX: number, _maxY: number) {
    if (anode.x < 0) return false;
    if (anode.y < 0) return false;
    if (anode.x >= _maxX) return false;
    if (anode.y >= _maxY) return false;
    return true;
}

function run(maxScale: number) {
    const antinodes: Set<string> = new Set();
    Object.values(clusters).forEach(antennas => {
        if (antennas.length > 1 && maxScale > 1) {
            antennas.forEach(a => {
                antinodes.add(a.serialise());
            });
        }
        for (const a of antennas) {
            for (const b of antennas) {
                if (a !== b) {
                    // handle one side with a->b, handle other with b->a
                    const dx1 = a.x - b.x;
                    const dy1 = a.y - b.y;
    
                    let scale = 1
                    let antinode1 = new Coordinate(a.x + scale * dx1,  a.y + scale * dy1);
                    while (isValid(antinode1, maxX, maxY) && scale <= maxScale) {
                        antinodes.add(antinode1.serialise());
                        scale++;
                        antinode1 = new Coordinate(a.x + scale * dx1,  a.y + scale * dy1);
                    }
                }
            }
        }
    });
    return antinodes.size;
}

console.log("Part 1", run(1));
console.log("Part 2", run(Number.MAX_SAFE_INTEGER));
