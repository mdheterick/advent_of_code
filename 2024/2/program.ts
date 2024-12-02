import { fetchInput } from "../../fetchInput";
import { popIndex } from "../../utils";

const data = await fetchInput(2024, 2);


const example = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

const input = data;

class Report {
    levels: number[];
    constructor(report: string) {
        this.levels = report.split(" ").map(l => Number(l));
    }

    monotonic1() {
        let direction = (this.levels[1] - this.levels[0]) / Math.abs(this.levels[1] - this.levels[0]);
        if (isNaN(direction)) {
            direction = (this.levels[2] - this.levels[1]) / Math.abs(this.levels[2] - this.levels[1]);
        }
        if (isNaN(direction)) {
            return false;
        }
        for (let i = 0; i < this.levels.length - 1; i++) {
            const current = this.levels[i];
            const next = this.levels[i + 1];
            if (!this.checkSafe(direction, current, next)) {
                return false;
            }
        }
        return true;
    }

    checkSafe(direction: number, current: number, next: number) {
        const delta = (next - current) * direction;
        if (current === next || delta > 3 || delta < 1) {
            return false;
        }
        return true;
    }
}

const reports = input.split("\n").map(r => new Report(r));

const safe = reports.filter(r => r.monotonic1());
const unsafe = reports.filter(r => !r.monotonic1());

const dampened = unsafe.filter(u => {
    for (const i in u.levels) {
        if ((new Report(popIndex(u.levels, Number(i)).join(" "))).monotonic1()) return true;
    }
});

console.log("Part 1", safe.length, "Part 2", safe.length + dampened.length)
