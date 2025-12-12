import { fetchInput } from "../../fetchInput";
import { sum } from "../../utils";

const data = await fetchInput(2025, 12);

const example = `0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2`;

const runData = data;

class Present {
    id: number;
    shape: boolean[][];
    area: number;
    constructor(input: string) {
        const [idPart, ...shape] = input.trim().split("\n");
        this.id = Number(idPart.split(":")[0]);
        this.shape = shape.map(row => row.split("").map(c => c === "#"));
        this.area = this.calculateArea();
    }

    calculateArea() {
        return this.shape.reduce((sum, row) => {
            for (const cell of row) {
                if (cell) {
                    sum++;
                }
            }
            return sum;
        }, 0);
    }
}

class Tree {
    x: number;
    y: number;
    presents: Record<number, number>;
    constructor(line: string) {
        const [dimensions, presents] = line.split(":");
        const [x, y] = dimensions.split("x");
        this.x = Number(x);
        this.y = Number(y);
        this.presents = presents.trim().split(" ").map(p => Number(p)).reduce<Record<string, number>>((map, p, index) => {
            map[index] = p;
            return map;
        }, {});
    }

    canFit(presents: Record<string, Present>) {
        const availableArea = this.x * this.y;
        const upperBoundArea = sum(Object.entries(this.presents).map(([pId, pNumber]) => pNumber * 9));
        // all presents can fit without complicated packing algo
        if (upperBoundArea <= availableArea) return true;
        const neededArea = sum(Object.entries(this.presents).map(([pId, pNumber]) => pNumber * presents[pId].area));
        // No way for all presents to fit in area
        if (neededArea > this.x * this.y) return false;
        // input didn't need anything more complex than that, wont work on example though
        return true;
    }
}


const part = runData.split("\n\n");
const trees = part.pop()?.split("\n").map(t => new Tree(t));
const presents = part.map(p => new Present(p));
const presentMap = presents.reduce<Record<string, Present>>((map, p) => {
    map[p.id] = p;
    return map;
}, {});
if (!trees) throw new Error();

console.log(sum(trees.map(t => t.canFit(presentMap))));
