import { fetchInput } from "../../fetchInput";

import { Coordinate as _Coordinate } from "../../utils";

const data = await fetchInput(2024, 20);

const example = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`;

const input = data;

class Coordinate extends _Coordinate {
    type: string;
    constructor(x: number, y: number, type: string) {
        super(x, y);
        this.type = type;
    }
}

type Node = {coord: Coordinate, cost: number};

const grid = input.split("\n").map((row, y) => row.split("").map((col, x) => new Coordinate(x, y, col)));

const start = grid.flat().find(c => c.type === "S")!;
const end = grid.flat().find(c => c.type === "E")!;


function dijkstra(start: Coordinate, end: Coordinate) {
    const toCheck: Array<Node> = [{coord: start, cost: 0}];

    const costMap = new Map<Coordinate, number>()
    costMap.set(start, 0);
    
    while (toCheck.length) {
        const current = toCheck.shift()!;
        if (current.coord === end) {
            return costMap;
        }
        for (const neighbour of current.coord.neighboursManhattan(grid)) {
            if (neighbour && neighbour.type !== "#" && !costMap.has(neighbour)) {
                toCheck.push({coord: neighbour, cost: costMap.get(current.coord)! + 1});
                costMap.set(neighbour, current.cost + 1);
            }
        }
    }
    throw new Error("Didn't reach end");
}

const costMap = dijkstra(start, end);
const coords = [...costMap.keys()].sort((a, b) => costMap.get(b)! - costMap.get(a)!);

function findCheats(cheatDuration: number, cheatThreshold: number) {type Cheat = {start: Coordinate, end: Coordinate, saving: number};
    const cheats: Array<Cheat> = [];
    // const cheatCostMap: Record<number, number> = {} // To verify against example breakdowns
    coords.forEach(c => {
        const coordCost = costMap.get(c)!;
        for (const cheatStart of c.getNeighboursRangeManhattan(grid, cheatDuration)) {
            if (cheatStart && cheatStart.type !== "#" && costMap.has(cheatStart)) {
                const cheatStartCost = costMap.get(cheatStart)!;
                const saving = cheatStartCost - coordCost - c.manhattanDistance(cheatStart);
                if (saving >= cheatThreshold) {
                    cheats.push({start: cheatStart, end: c, saving });
                    // const count = cheatCostMap[saving] || 0;
                    // cheatCostMap[saving] = count + 1;
                }
            }
        }
    });
    // console.log(cheatCostMap);
    return cheats.length;
}

// 44 1448
// 285 1017615
console.log("Part 1", findCheats(2, input === data ? 100 : 1));
console.log("Part 2", findCheats(20, input === data ? 100 : 50));
