import { fetchInput } from "../../fetchInput";
import { memoise, sum } from "../../utils";

const data = await fetchInput(2024, 19);

const example = `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`;

const input = data;


const [_towels, _designs] = input.split("\n\n");

const towels = _towels.split(", ");

function isPossible(design: string) {
    const applicableTowels = towels.filter(t => design.startsWith(t));
    if (design.length === 0) {
        return 1;
    }
    let sum = 0;
    for (const towel of applicableTowels) {
        const next = design.replace(towel, "");
        sum += memoised(next);
    }
    return sum;
}

const memoised = memoise(isPossible);

const designs = _designs.split("\n");

const combinations = designs.map(d => {
    return memoised(d);
});
console.log("Part 1", sum(combinations.map(c => c > 0)));
console.log("Part 2", sum(combinations));
