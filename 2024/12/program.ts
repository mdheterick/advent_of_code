import { fetchInput } from "../../fetchInput";
import { Coordinate, sum } from "../../utils";

const data = await fetchInput(2024, 12);

const example = `AAAA
BBCD
BBCC
EEEC`;

const example2 = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;

const example3 = `EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`;

const example4 = `AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`;

const input = data;

class Patch  extends Coordinate{
    crop: string;
    neighboursInRegion: Patch[];
    neighboursOutRegion: Patch[];
    constructor(x: number, y: number, crop: string) {
        super(x, y);
        this.crop = crop;

        this.neighboursInRegion = [];
        this.neighboursOutRegion = [];
    }

    checkNeighbours(grid: Patch[][]) {
        for (const dir of Coordinate.directionsManhattan()) {
            const neighbour = this.getNeighbour(grid, dir[0], dir[1]);
            if (neighbour) {
                if (neighbour.crop === this.crop) {
                    this.neighboursInRegion.push(neighbour);
                }
                else {
                    this.neighboursOutRegion.push(neighbour);
                }
            }
        }
    }

    exploreRegion(region: Set<Patch>) {
        region.add(this);
        for (const p of this.neighboursInRegion) {
            if (!region.has(p)) {
                p.exploreRegion(region);
            }
        }
    }

    perimeter() {
        return 4 - this.neighboursInRegion.length;
    }
}

class Edge {
    end: number;
    direction: string;
    location: number;
    start: number;
    inside: string;
    constructor(direction: "v" | "h", inside: string, location: number, start: number, end: number) {
        this.direction = direction;
        this.inside = inside;
        this.location = location;
        this.start = start;
        this.end = end;
    }

    continues(edge: Edge) { // mutates "this" to merge tested edge
        if (this.direction !== edge.direction) return false;
        if (this.location !== edge.location) return false;
        if (this.inside !== edge.inside) return false;
        if (this.start === edge.end) {
            this.start = edge.start;
            return true;
        }
        if (this.end === edge.start) {
            this.end = edge.end;
            return true;
        }
        return false;
    }

    pretty() {
        return `${this.direction} ${this.location} ${this.start} ${this.end}`;
    }
}

const grid = input.split("\n").map((row, y) => row.split("").map((col, x) => new Patch(x, y, col)));

grid.flat().forEach(p => p.checkNeighbours(grid));

const regions: Array<Set<Patch>> = [];
grid.flat().forEach(p => {
    if (!regions.some(r => r.has(p))) {
        const region = new Set<Patch>();
        p.exploreRegion(region);
        regions.push(region);
    }
});

console.log("Part 1", sum(regions.map(r => r.size * sum([...r].map(p => p.perimeter())))));

function numberOfSides(region: Set<Patch>) {
    const edges: Set<Edge> = new Set();
    // hardcode each direction to create Edge instances, check those instances against existing and merge if possible
    [...region].forEach(p => {
        // up
        let neighbour = p.getNeighbour(grid, 0, -1);
        if (!neighbour || p.neighboursOutRegion.includes(neighbour)) {
            const e = new Edge("h", "v", p.y, p.x, p.x + 1);
            const matches = [...edges].find(oe => oe.continues(e));
            if (!matches) {
                edges.add(e)
            }
        }
        // down
        neighbour = p.getNeighbour(grid, 0, 1);
        if (!neighbour || p.neighboursOutRegion.includes(neighbour)) {
            const e = new Edge("h", "^", p.y + 1, p.x, p.x + 1);
            const matches = [...edges].find(oe => oe.continues(e));
            if (!matches) {
                edges.add(e)
            }
        }
        // left
        neighbour = p.getNeighbour(grid, -1, 0);
        if (!neighbour || p.neighboursOutRegion.includes(neighbour)) {
            const e = new Edge("v", ">", p.x, p.y, p.y + 1);
            const matches = [...edges].find(oe => oe.continues(e));
            if (!matches) {
                edges.add(e)
            }
        }
        // right
        neighbour = p.getNeighbour(grid, 1, 0);
        if (!neighbour || p.neighboursOutRegion.includes(neighbour)) {
            const e = new Edge("v", "<", p.x + 1, p.y, p.y + 1);
            const matches = [...edges].find(oe => oe.continues(e));
            if (!matches) {
                edges.add(e)
            }
        }
    });

    // consolidate any edges that may not have been contiguous at discovery time
    let numEdges = 0;
    while (numEdges !== edges.size) {
        for (const ea of edges) {
            for (const eb of edges) {
                if (ea.continues(eb)) {
                    edges.delete(eb);
                }
            }
        }
        numEdges = edges.size;
    }

    return edges.size;
}

console.log("Part 2", sum(regions.map(r => r.size * numberOfSides(r))));
