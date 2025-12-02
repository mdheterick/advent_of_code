import { fetchInput } from "../../fetchInput";

const data = await fetchInput(2025, 2);

const example = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`;

const runData = data;

class IdRange {
    start: number;
    end: number;
    constructor(range: string) {
        const [start, end] = range.split("-");
        this.start = Number(start);
        this.end = Number(end);
    }

    * invalids1() {
        for (let i = this.start; i <= this.end; i++) {
            const stringed = i.toString();
            if (stringed.length % 2 === 1) continue;
            const parts = this.splitTimes(stringed, 2);
            if (this.allEqual(parts)) {
                yield i;
            }
        }
    }

    * invalids2() {
        for (let i = this.start; i <= this.end; i++) {
            const stringed = i.toString();
            for (let len = 2; len < stringed.length + 1; len++) {
                if (this.allEqual(this.splitTimes(stringed, len))) {
                    yield i;
                    break;
                }
            }
        }
    }

    splitTimes(str: string, times: number) {
        const strLength = str.length;
        if (strLength % times !== 0) return [];
        const chunkSize = strLength / times;
        const parts = [];
        for (let i = 0; i < times; i++) {
            parts.push(str.substring(i * chunkSize, (i + 1) * chunkSize));
        }
        return parts;
    }

    allEqual(parts: Array<string>) {
        const first = parts[0];
        if (!first) return false;
        return parts.every(p => p === first);
    }
}

const ranges = runData.split(",").map(r => new IdRange(r));

let total = 0;
for (const range of ranges) {
    for (const invalid of range.invalids1()) {
        total += invalid;
    }
}
console.log("Part 1", total);
total = 0;
for (const range of ranges) {
    for (const invalid of range.invalids2()) {
        total += invalid;
    }
}
console.log("Part 2", total);