import { fetchInput } from "../../fetchInput";

const data = (await fetchInput(2021, 3)).split("\n");

const testData = [
    "00100",
    "11110",
    "10110",
    "10111",
    "10101",
    "01111",
    "00111",
    "11100",
    "10000",
    "11001",
    "00010",
    "01010",
];

const runData = data;

type Tree = {
    [key: string]: {} | Tree;
}

function buildTree(input: typeof runData) {
    const tree: Tree = {};
    input.forEach(row => {
        let level = tree;
        row.split("").forEach(bit => {
            if (!level[bit]) {
                level[bit] = {};
            }
            level = level[bit];
        })
    });
    return tree;
}

function leavesForBranch(branch: Tree): number {
    if (!branch) return 0;
    const keys = Object.keys(branch);
    if (keys.length === 0) return 1;
    return keys.reduce<number>((sum, k) => sum + leavesForBranch(branch[k]), 0);
}

function part1(input: typeof runData) {
    const start = input[0].split("").map(b => 0); // init to all zeros with correct length
    const sums = input.reduce((sums, row) => {
        const rowValues = row.split("").map(b => Number(b === "1"));
        rowValues.forEach((v, idx) => {
            sums[idx] += v;
        });
        return sums;
    }, start);
    const halfLength = input.length / 2;
    const gamma = parseInt(sums.map(v => Number(v > halfLength)).join(""), 2);
    const epsilon = parseInt(sums.map(v => Number(v < halfLength)).join(""), 2);
    return gamma * epsilon;
}

function part2(input: typeof runData) {
    const bTree = buildTree(input);

    function getBitCount(level: Tree) {
        const keys = Object.keys(level);
        const leaves = keys.reduce<Record<string, number>>((l, k) => {
            l[k] = leavesForBranch(level[k]);
            return l;
        }, {});
        const sortedKeys = [...keys];
        sortedKeys.sort((a, b) => leaves[a] - leaves[b]);
        const uniqueCounts = new Set(Object.values(leaves));
        const equal = sortedKeys.length > 2 && uniqueCounts.size === 1;
        return {
            mcb: equal ? "1" : sortedKeys[sortedKeys.length - 1],
            lcb: equal ? "0" : sortedKeys[0]
        };
    }
    
    function traverse(level: Tree, type: "mcb" | "lcb"): string {
        if (!level) return "";
        if (Object.keys(level).length === 0) return "";
        const relevantBit = getBitCount(level)[type];
        return relevantBit + traverse(level[relevantBit], type);
    }
    const oxyGenRating = parseInt(traverse(bTree, "mcb"), 2);
    const co2ScrubRating = parseInt(traverse(bTree, "lcb"), 2);
    return oxyGenRating * co2ScrubRating;
}

console.log(part1(runData));
console.log(part2(runData));
