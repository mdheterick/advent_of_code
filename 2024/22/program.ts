import { fetchInput } from "../../fetchInput";
import { sum } from "../../utils";

const data = await fetchInput(2024, 22);

const example = `1
10
100
2024`;

const example2 = `1
2
3
2024`;

const input = data;

class Secret {
    current: bigint;
    initial: number;
    window: [number?, number?, number?, number?];
    history;
    constructor(initial: number) {
        this.initial = initial;
        this.current = BigInt(initial);

        this.window = [];
        this.history = new Map<string, number>();
    }

    mix(given: bigint) {
        this.current = this.current ^ given;
    }

    prune() {
        this.current = this.current % BigInt(16777216);
    }

    next() {
        const prevOnes = this.onesDigit();
        const step1 = this.current * BigInt(64);
        this.mix(step1);
        this.prune();
        const step2 = this.current / BigInt(32);
        this.mix(step2);
        this.prune();
        const step3 = this.current * BigInt(2048);
        this.mix(step3);
        this.prune();
        const newOnes = this.onesDigit();
        this.addHistory(newOnes - prevOnes);
    }

    addHistory(change: number) {
        this.window.push(change);
        while (this.window.length > 4) this.window.shift();
        if (this.window.length === 4) {
            const sequence = this.window.toString();
            if (!this.history.has(sequence)) {
                this.history.set(sequence, this.onesDigit());
            }
        }
    }

    onesDigit() {
        const stringified = Number(this.current).toString();
        return Number(stringified.charAt(stringified.length - 1));
    }
}

const secrets = input.split("\n").map(s => new Secret(Number(s)));

for (let i = 0; i < 2000; i++) {
    secrets.forEach(s => s.next());
}
console.log("Part 1", sum(secrets.map(s => Number(s.current))));

const sequencesToCheck = new Set<string>();
secrets.forEach(s => {
    for (const sequence of s.history.keys()) {
        sequencesToCheck.add(sequence);
    }
});
let best = 0;
let bestSequence = "";
for (const sequence of sequencesToCheck.values()) {
    const total = sum(secrets.map(s => s.history.get(sequence) || 0));
    if (total > best) {
        best = total;
        bestSequence = sequence;
    }
}
console.log("Part 2", best, bestSequence);

