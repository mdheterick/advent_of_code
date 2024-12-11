import { fetchInput } from "../../fetchInput";
import { range, sum } from "../../utils";

const data = await fetchInput(2024, 11);


const example = `0 1 10 99 999`;
const example2 = `125 17`;

const input = data;

class Stone {
    value: number;
    constructor(value: number) {
        this.value = value;
    }

    applyRules() {
        if (this.value === 0) {
            return this.has0();
        }
        if (this.value.toString().length % 2 === 0) {
            return this.evenDigits();
        }
        return this.default();
    }

    has0() {
        return [new Stone(1)];
    }

    evenDigits() {
        const value = this.value.toString();
        const length = value.length;
        const left = value.substring(0, length / 2);
        const right = value.substring(length / 2);
        return [new Stone(Number(left)), new Stone(Number(right))];
    }

    default() {
        return [new Stone(this.value * 2024)];
    }
}

let stones = input.split(" ").map(s => new Stone(Number(s)));

const memo: Record<number, number> = {};
stones.forEach(s => {
    const occurences = memo[s.value] || 0;
    memo[s.value] = occurences + 1;
})

for (const blink in range(25)) {
    Object.entries(memo).forEach(([stone, occurences]) => {
        memo[Number(stone)] = memo[Number(stone)] - occurences;
        for (const s of (new Stone(Number(stone))).applyRules()) {
            const o = memo[s.value] || 0;
            memo[s.value] = o + occurences;
        }
    });
}
console.log(sum(Object.values(memo)));
