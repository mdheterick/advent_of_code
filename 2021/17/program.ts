import { fetchInput } from "../../fetchInput";

const data = (await fetchInput(2021, 17));


const testData = `target area: x=20..30, y=-10..-5`;


const runData = data;

const NUMBER_TEST = /\-?\d+/g;

function parseInput(input: string) {
    return input.match(NUMBER_TEST)!.map(n => parseInt(n, 10));
}


const DECELERATION = 1;


class Probe {
    _vx: number;
    _vy: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    ax: number;
    ay: number;
    maxy: number;
    constructor(vx: number, vy: number) {
        this._vx = vx;
        this._vy = vy;
        this.x = 0;
        this.y = 0;
        this.vx = vx;
        this.vy = vy;
        this.ax = -DECELERATION;
        this.ay = -DECELERATION;

        this.maxy = this.y;
    }

    step() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx = Math.max(0, this.vx + this.ax);
        this.vy =this.vy + this.ay;

        if (this.y > this.maxy) {
            this.maxy = this.y;
        }
    }

    simulate(minx: number, maxx: number, miny: number, maxy: number) {
        while(!this.beyondRange(maxx, miny)) {
            this.step();
            if (this.withinRange(minx, maxx, miny, maxy)) return true;
        }
        return false;
    }

    withinRange(minx: number, maxx: number, miny: number, maxy: number) {
        if (this.x < minx) return false;
        if (this.x > maxx) return false;
        if (this.y < miny) return false;
        if (this.y > maxy) return false;
        return true;
    }

    beyondRange(maxx: number, miny: number) {
        return this.x > maxx || this.y < miny;
    }
}


function part12(input: typeof runData) {
    const [x1, x2, y1, y2] = parseInput(input);

    const maxVx = x2;
    let maxY = 0;
    let count = 0;
    for (let vx = 0; vx <= maxVx; vx++) {
        const maxSteps = Math.ceil(vx / DECELERATION);
        const maxVy = Math.floor(y2 / maxSteps + maxSteps * maxSteps / 2);
        for (let vy = y1; vy <= Math.max(y1 + 1, maxVy * 2); vy++) {
            const probe = new Probe(vx, vy);
            if (probe.simulate(x1, x2, y1, y2)) {
                if (probe.maxy > maxY) {
                    maxY = probe.maxy;
                }
                count++;
            }
        }
    }
    return [maxY, count];
}
console.log(part12(runData));
