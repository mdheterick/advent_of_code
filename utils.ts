
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

    * directionsManhattan() {
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
}
