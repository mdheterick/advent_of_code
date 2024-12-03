import { fetchInput } from "../../fetchInput";
import { sum } from "../../utils";

const data = await fetchInput(2024, 3);

const example = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;
const example2 = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

const input = data;

const mulRegex = /mul\(\d{1,3},\d{1,3}\)/g;

function testMemory(memory: string) {
    const validExpressions = memory.match(mulRegex) || [];
    return sum(validExpressions?.map(runMul));
}


function runMul(mul: string) {
    const [a, b] = mul.split("mul(")[1].split(")")[0].split(",").map(arg => Number(arg));
    return a * b;
}

console.log("Part 1", testMemory(input));

const doRegex = /do\(\)/g;
const dontRegex = /don't\(\)/g;

const dos = [...input.matchAll(doRegex)].map(dos => ({do: true, dont: false, index: dos.index || Number.MAX_SAFE_INTEGER}));
const donts = [...input.matchAll(dontRegex)].map(dont => ({dont: true, do: false, index: dont.index || Number.MAX_SAFE_INTEGER}));
const conditions = [...dos, ...donts].sort((a, b) => a.index - b.index);

let filteredMemory = "";
let doing = true;
let currentIndex = 0;
for (const condition of conditions) {
    if (doing && condition.dont) {
        filteredMemory += input.substring(currentIndex, condition.index);
        doing = false;
    }
    if (!doing && condition.do) {
        currentIndex = condition.index;
        doing = true;
    }
}
if (doing) {
    filteredMemory += input.substring(currentIndex);
}
console.log("Part 2", testMemory(filteredMemory));
