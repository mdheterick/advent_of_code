
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
