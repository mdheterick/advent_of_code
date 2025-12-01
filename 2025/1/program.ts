import { fetchInput } from "../../fetchInput";
import { sum } from "../../utils";

const data = await fetchInput(2025, 1);

const example = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;

const runData = data;

class Dial {
    i: number;
    max: number;
    zeros: number;
    constructor(init: number, max: number) {
        this.i = init;
        this.max = max + 1;
        this.zeros = 0;
    }

    runStep(line: string) {
        const [_dir, ..._amount] = line.split("");
        const amount = Number(_amount.join(""));
        const dir = _dir === "L" ? -1 : 1;
        const before = this.i;
        this.i += dir * amount;
        while (this.i < 0) {
            this.i += this.max;
            this.zeros++;
        }
        if (_dir === "L") { // should have just brute-forced
            if (this.i === 0) this.zeros++;
            if (before === 0) {
                this.zeros--;
            }
        }
        while (this.i >= this.max) {
            this.i -= this.max;
            this.zeros++;
        }
        return this.i === 0;
    }

    runStepDumb(line: string) {
        const [_dir, ..._amount] = line.split("");
        const amount = Number(_amount.join(""));
        const dir = _dir === "L" ? -1 : 1;
        for (let i = 0; i < amount; i++) {
            this.i += dir;
            if (this.i === -1) this.i = 99;
            if (this.i === 100) this.i = 0;
            if (this.i === 0) this.zeros++;
        }
        return this.i === 0;
    }
}

const dial = new Dial(50, 99);

const results = runData.split("\n").map(line => dial.runStep(line));

console.log("Part 1", sum(results)); // 1097
console.log("Part 2", dial.zeros); // 7101
