
export function sum<T = number>(collection: Array<T>, getter: (x: T) => number = i => i as number) {
    return collection.reduce((sum, c) => sum + getter(c), 0);
}

export function product<T = number>(collection: Array<T>, getter: (x: T) => number = i => i as number) {
    return collection.reduce((prod, c) => prod * getter(c), 1);
}

// Returns an array of numbers from [0..length-1]
export function range(length: number) {
    return [...Array(length).keys()];
}


/**
 * Computes the Last Common Multiple of two numbers;
 */
function lcm2(a: number, b: number) {
    return a * (b / gcd(a, b));
}

/**
 * Computes the Least Common Multiple of an arbitrary array of numbers
 */
export function lcm(...args: Array<number>): number {
    if (args.length === 2) return lcm2(args[0], args[1]);
    return lcm2(args[0], lcm(...args.slice(1)));
}

/**
 * Computes the Greater Common Divisor of two numbers
 */
export function gcd(a: number, b: number) {
    if (a === 0 || b === 0) return a + b;
    const biggest = a > b ? a : b;
    const smallest = a > b ? b : a;
    return gcd(smallest, biggest % smallest);
}

export function popIndex<T>(arr: Array<T>, index: number) {
    const copy = [...arr];
    copy.splice(index, 1);
    return copy;
}

export class Coordinate {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    serialise() {
        return `${this.x},${this.y}`;
    }
    
    * directions2d() {
        for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
                if (x === 0 && y === 0) continue;
                yield [x, y] as [-1 | 0 | 1, -1 | 0 | 1];
            }
        }
    }

    equals(coord: Coordinate) {
        return this.x === coord.x && this.y === coord.y;
    }

    static * directionsManhattan() {
        yield [0, -1];
        yield [1, 0];
        yield [0, 1]
        yield [-1, 0];
    }

    getNeighbour<T extends Coordinate>(grid: Array<Array<T>>, dx: number, dy: number) {
        if (!grid[this.y + dy]) return null;
        if (!grid[this.y + dy][this.x + dx]) return null;
        return grid[this.y + dy][this.x + dx];
    }

    * neighboursManhattan<T extends Coordinate>(grid: Array<Array<T>>) {
        for (const dir of Coordinate.directionsManhattan()) {
            yield this.getNeighbour(grid, dir[0], dir[1]);
        }
    }

    * getNeighboursRangeManhattan<T extends Coordinate>(grid: Array<Array<T>>, range: number) {
        for (let dx = -range - 1; dx <= range + 1; dx++) {
            for (let dy = -range - 1; dy <= range + 1; dy++) {
                if (Math.abs(dx) + Math.abs(dy) <= range) {
                    if (!(dx === 0 && dy === 0)) {
                        yield this.getNeighbour(grid, dx, dy);
                    }
                }
            }
        }
    }

    manhattanDistance(other: Coordinate) {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
    }

    matches(x: number, y: number) {
        return this.x === x && this.y === y;
    }
}

// Always consider memoising when doing a DFS to ensure that the tail of each input only needs to be calculated once and the result can be reused
export function memoise(func: (...args: any[]) => any) {
    const memo = new Map();
    return function(...args: any[]) {
        const argsHash = args.toString();
        if (memo.has(argsHash)) {
            return memo.get(argsHash);
        }
        const result = func(...args);
        memo.set(argsHash, result);
        return result;
    }
}

/*
    Similar to git bisect, runs a binary search using the test function and a numerical range
    returns the first number in the range where the test function return true
    for a system that has a single transition within the range
    min|xxxxxxxxxxxxxxxxoooo|max
                        ^
*/
export function bisectSearch(test: (search: number) => boolean, max: number, min = 0) {
    let L = min;
    let R = max - 1;
    let m = 0;
    let bads: Array<number> = [];
    let goods: Array<number> = [];
    while (L <= R) {
        m = Math.floor((L + R) / 2);
        if (test(m)) {
            goods.push(m);
            R = m - 1;
        }
        else {
            bads.push(m);
            L = m + 1;
        }
        const transition = goods.find(g => bads.some(b => g - b === 1));
        if (transition) {
            return transition;
        }
    }
    throw new Error("Search failed");
}
