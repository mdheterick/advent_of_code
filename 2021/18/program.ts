import { fetchInput } from "../../fetchInput";

const data = (await fetchInput(2021, 18));

const testData = `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
[7,[5,[[3,8],[1,4]]]]
[[2,[2,2]],[8,[8,1]]]
[2,9]
[1,[[[9,3],9],[[9,0],[0,7]]]]
[[[5,[7,4]],7],1]
[[[[4,2],2],6],[8,7]]`;

const testData2 = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`;

const runData = data;

const INTEGER_TEST = /\d+/;
const _int = (n: string) => parseInt(n, 10);
const isInt = (n: string | null) => n !== null && INTEGER_TEST.test(n);

type SnailFishPair = [number | SnailFishPair, number | SnailFishPair];

class SfNumber {
    n: string;
    constructor(n: string) {
        this.n = n
    }

    canExplode() {
        let depth = 0;
        const parts = this._split();
        for (let charIndex = 0; charIndex < parts.length; charIndex++) {
            if (parts[charIndex] === "[") {
                depth += 1;
                if (depth > 4) {
                    return charIndex;
                }
            }
            if (parts[charIndex] === "]") {
                depth -= 1;
            }
        }
        return -1;
    }

    explode(index: number) {
        const parts = this._split();
        const pairLeft = parts[index + 1];
        const pairRight = parts[index + 3];
        for (let i = index; i >= 0; i--) {
            if (isInt(parts[i])) {
                parts[i] = (_int(parts[i]) + _int(pairLeft)).toString();
                break;
            }
        }
        for (let i = index + 5; i < parts.length; i++) {
            if (isInt(parts[i])) {
                parts[i] = (_int(parts[i]) + _int(pairRight)).toString();
                break;
            }
        }
        parts.splice(index, 5, "0");
        this.n = parts.join("");
    }

    canSplit() {
        const parts = this._split();
        for (let charIndex = 0; charIndex < parts.length; charIndex++) {
            if (parts[charIndex].length > 1) {
                return charIndex;
            }
        }
        return -1;
    }

    split(index: number) {
        const parts = this._split();
        const num = _int(parts[index]);
        const insert = ["[", Math.floor(num / 2), ",", Math.ceil(num / 2), "]"].map(i => i.toString());
        parts.splice(index, 1, ...insert);
        this.n = parts.join("");
    }

    _split() {
        const ret = [];
        let prev = null;
        for (const char of this.n) {
            if (isInt(prev) && isInt(char)) {
                ret[ret.length - 1] = prev + char;
            }
            else {
                ret.push(char);
            }
            prev = ret[ret.length - 1];
        }
        return ret;
    }

    reduce() {
        while (true) {
            const canExplode = this.canExplode();
            if (canExplode > -1) {
                this.explode(canExplode);
                continue;
            }
            const canSplit = this.canSplit();
            if (canSplit > -1) {
                this.split(canSplit);
                continue;
            }
            break;
        }
    }

    add(other: SfNumber) {
        const result = new SfNumber(`[${this.n},${other.n}]`);
        result.reduce();
        return result;
    }

    magnitude() {
        const pairs: SnailFishPair = JSON.parse(this.n);
        return this._magnitude(pairs);
    }

    _magnitude([left, right]: SnailFishPair): number {
        const leftMag = 3 * (Array.isArray(left) ?  this._magnitude(left) : left);
        const rightMag = 2 * (Array.isArray(right) ?  this._magnitude(right) : right);
        return leftMag + rightMag;
    }

    static addChain(chain: Array<SfNumber>) {
        let temp = chain[0];
        for (let i = 1; i < chain.length; i++) {
            temp = temp.add(chain[i]);
        }
        return temp;
    }
}


function part1(input: typeof runData) {
    const numbers = input.split("\n").map(n => new SfNumber(n));
    const result = SfNumber.addChain(numbers);
    return result.magnitude();
}

function part2(input: typeof runData) {
    const numbers = input.split("\n").map(n => new SfNumber(n));
    let max = 0;
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
            if (i !== j) {
                const sum = numbers[i].add(numbers[j]);
                const magnitude = sum.magnitude();
                if (magnitude > max) {
                    max = magnitude;
                }
            }
        }
    }
    return max;
}

console.log(part1(runData));
console.log(part2(runData));