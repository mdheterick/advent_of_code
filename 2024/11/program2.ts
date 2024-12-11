import { fetchInput } from "../../fetchInput";
import { memoise, sum } from "../../utils";

const data = await fetchInput(2024, 11);


const example = `0 1 10 99 999`;
const example2 = `125 17`;

const input = data;

function applyRules(value: number) {
    if (value === 0) return [1];
    if (value.toString().length % 2 === 0) {
        const v = value.toString();
        const length = v.length;
        const left = v.substring(0, length / 2);
        const right = v.substring(length / 2);
        return [Number(left), Number(right)];
    }
    return [value * 2024];
}

const countStones = memoise((stone: number, blinksRemaining: number) => {
    if (blinksRemaining === 0) return 1;
    const afterSplit = applyRules(stone);
    return sum(afterSplit.map(v => countStones(v, blinksRemaining - 1)));
});

console.log(sum(data.split(" ").map(n => countStones(Number(n), 10))));
