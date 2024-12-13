import { fetchInput } from "../../fetchInput";
import { sum } from "../../utils";

const data = await fetchInput(2024, 13);

const example = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`;

const input = data;

class Machine {
    a: { x: number; y: number; };
    b: { x: number; y: number; };
    prize: { x: number; y: number; };
    constructor(data: string, offset = 0) {
        const [a, b, prize] = data.split("\n");
        this.a = Machine.getButtonScales(a);
        this.b = Machine.getButtonScales(b);
        this.prize = Machine.getPrizeLocation(prize, offset);
    }

    static getButtonScales(button: string) {
        const [,x, y] = button.split("+");
        return {x: Number(x.split(",")[0]), y: Number(y)};
    }

    static getPrizeLocation(prize: string, offset: number) {
        const [,x, y] = prize.split("=");
        return {x: offset + Number(x.split(",")[0]), y: offset + Number(y)};
    }

    calculatePresses() {
        const a = -this.b.x / this.a.x;
        const c = this.prize.x / this.a.x;
        const b = -this.b.y / this.a.y;
        const d = this.prize.y / this.a.y;

        let bPresses = (d - c) / (a - b);
        let aPresses = a * bPresses + c;

        return {a: Math.round(aPresses), b: Math.round(bPresses)};
    }

    calculateCost() {
        const presses = this.calculatePresses();
        if (this.a.x * presses.a + this.b.x * presses.b === this.prize.x && this.a.y * presses.a + this.b.y * presses.b === this.prize.y) {
            return presses.a * 3 + presses.b;
        }
        return 0;
    }
}

const machines1 = input.split("\n\n").map(i => new Machine(i));
const machines2 = input.split("\n\n").map(i => new Machine(i, 10000000000000));
console.log("Part 1", sum(machines1.map(m => m.calculateCost())));
console.log("Part 2", sum(machines2.map(m => m.calculateCost())));
