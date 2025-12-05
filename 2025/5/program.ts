import { fetchInput } from "../../fetchInput";
import { sum } from "../../utils";

const data = await fetchInput(2025, 5);

const example = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;


const runData = data;


class Range {
    start: number;
    end: number;
    constructor(line: string) {
        const [start, end] = line.split("-");
        this.start = Number(start);
        this.end = Number(end);
    }

    test(id: number) {
        return id >= this.start && id <= this.end;
    }

    overlaps(range: Range) {
        return !(this.end < range.start) && !(this.start > range.end);
    }

    merge(b: Range) {
        const start = Math.min(this.start, b.start);
        const end = Math.max(this.end, b.end);
        this.start = start;
        this.end = end;
    }

    size() {
        return this.end - this.start + 1;
    }
}

const [_ranges, _ids] = runData.split("\n\n");
const ranges = _ranges.split("\n").map(r => new Range(r)).sort((a, b) => a.start - b.start);
const ids = _ids.split("\n").map(i => Number(i));

console.log("Part 1", ids.filter(i => ranges.some(r => r.test(i))).length);

function mergeRanges(_rra: Array<Range>) {
    const rra = [..._rra];
    const rrb: Array<Range> = [];
    while (rra.length) {
        const next = rra.pop();
        if (!next) break;
        let merged = false;
        for (const c of rrb) {
            if (c.overlaps(next)) {
                c.merge(next);
                merged = true;
                break;
            }
        }
        if (!merged) {
            rrb.push(next);
        }
    }
    return rrb;
}

let oldRanges = [...ranges];
while (true) {
    const newRanges = mergeRanges(oldRanges);
    if (newRanges.length === oldRanges.length) break;
    oldRanges = newRanges;
}

console.log("Part 2", sum([...oldRanges].map(c => c.size())));
