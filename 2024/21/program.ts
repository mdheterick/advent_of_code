import { fetchInput } from "../../fetchInput";
import { range, sum } from "../../utils";

const data = await fetchInput(2024, 21);

const example = `029A
980A
179A
456A
379A`;

/*
+---+---+---+
| 7 | 8 | 9 |
+---+---+---+
| 4 | 5 | 6 |
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
    | 0 | A |
    +---+---+

    +---+---+
    | ^ | A |
+---+---+---+
| < | v | > |
+---+---+---+
*/

const input = data;

const directionPriority = [ "v", "<", ">", "^",]; // Prioritise the directional buttons furthest away from A
const directionMap = {
    "<": {x: -1, y: 0},
    "v": {x: 0, y: 1},
    "^": {x: 0, y: -1},
    ">": {x: 1, y: 0},
    "A": {x: 0, y: 0}
};

abstract class DirectionBuilder {
    abstract readonly invalid: { x: number; y: number; };
    
    buildDirections(delta: {x: number, y: number}, _x: number, _y: number) {
        let dx = _x;
        let dy = _y;
        let directionsUnsorted: Array<keyof DirectionalRobot["buttonMap"]> = [];
        const directionGroups: Array<typeof directionsUnsorted> = [];
        let group: typeof directionsUnsorted = []; // Group button presses together (more important than directionPriority)
        for (const i of range(Math.abs(delta.x))) {
            group.push(delta.x < 0 ? "<" : ">");
        }
        directionGroups.push(group);
        group = [];
        for (const i of range(Math.abs(delta.y))) {
            group.push(delta.y < 0 ? "^" : "v");
        }
        directionGroups.push(group);
        directionGroups.sort((a, b) => directionPriority.indexOf(a[0]!) - directionPriority.indexOf(b[0]!));
        const directions: typeof directionsUnsorted = [];
        while (directionGroups.length) {
            const current = directionGroups.shift()!;
            if (current.length === 0) continue;
            const magnitude = current.length;
            const dir = directionMap[current[0]!];
            if (dx + (dir.x * magnitude) === this.invalid.x && dy + (dir.y * magnitude) === this.invalid.y) {
                directionGroups.push(current);
            }
            else {
                directions.push(...current);
                dx += dir.x * magnitude;
                dy += dir.y * magnitude;
            }
        }
        if (dx === this.invalid.x && dy === this.invalid.y) throw new Error("reached invalid location");
        directions.push("A");
        return {
            dx, dy, addedDirections: directions
        }
    }

    xbuildDirections(delta: {x: number, y: number}, x: number, y: number) {
        let dx = x;
        let dy = y;
        let directions: Array<keyof DirectionalRobot["buttonMap"]> = [];
        
        if (y !== this.invalid.y) {
            for (const i of range(Math.abs(delta.x))) {
                directions.push(delta.x < 0 ? "<" : ">");
            }
            for (const i of range(Math.abs(delta.y))) {
                directions.push(delta.y < 0 ? "^" : "v");
            }
        }
        else if (x !== this.invalid.x) {
            for (const i of range(Math.abs(delta.y))) {
                directions.push(delta.y < 0 ? "^" : "v");
            }
            for (const i of range(Math.abs(delta.x))) {
                directions.push(delta.x < 0 ? "<" : ">");
            }
        }
        dx += delta.x;
        dy += delta.y
        if (dx === this.invalid.x && dy === this.invalid.y) throw new Error("reached invalid location");
        directions.push("A");
        return {
            dx, dy, addedDirections: directions
        }
    }
}

class NumpadRobot extends DirectionBuilder {
    readonly buttonMap;
    readonly invalid: { x: number; y: number; };
    readonly start: { y: number; x: number; };
    constructor() {
        super();
        this.buttonMap = {
            "7": {x: 0, y: 0},
            "8": {x: 1, y: 0},
            "9": {x: 2, y: 0},
            "4": {x: 0, y: 1},
            "5": {x: 1, y: 1},
            "6": {x: 2, y: 1},
            "1": {x: 0, y: 2},
            "2": {x: 1, y: 2},
            "3": {x: 2, y: 2},
            "0": {x: 1, y: 3},
            "A": {x: 2, y: 3},
        }
        this.start = this.buttonMap.A;
        this.invalid = {x: 0, y: 3};
    }

    runCode(code: string) {
        const buttons = code.split("") as Array<keyof NumpadRobot["buttonMap"]>;
        const coordinates = [{x: this.start.x, y: this.start.y}, ...buttons.map(b => this.buttonMap[b])];
        const deltas: typeof coordinates = [];
        for (let i = 1; i < coordinates.length; i++) {
            deltas.push({
                x: coordinates[i].x - coordinates[i - 1].x,
                y: coordinates[i].y - coordinates[i - 1].y,
            });
        }
        const directions: Array<keyof DirectionalRobot["buttonMap"]> = [];
        let x = this.start.x;
        let y = this.start.y;
        for (const delta of deltas) {
            const {
                dx, dy, addedDirections
            } = this.buildDirections(delta, x, y);
            x = dx;
            y = dy;
            directions.push(...addedDirections);
        }
        if (x !== this.buttonMap.A.x || y !== this.buttonMap.A.y) throw new Error("not at A");
        return directions.join("");
    }
}

class DirectionalRobot extends DirectionBuilder {
    readonly buttonMap;
    readonly invalid: { x: number; y: number; };
    readonly start: { x: number; y: number; };
    constructor() {
        super();
        this.buttonMap = {
            "^": {x: 1, y: 0},
            "A": {x: 2, y: 0},
            "<": {x: 0, y: 1},
            "v": {x: 1, y: 1},
            ">": {x: 2, y: 1},
        }
        this.start = this.buttonMap.A;
        this.invalid = {x: 0, y: 0};
    }

    runCode(code: string) {
        const buttons = code.split("") as Array<keyof DirectionalRobot["buttonMap"]>;
        const coordinates = [{x: this.start.x, y: this.start.y}, ...buttons.map(b => this.buttonMap[b])];
        const deltas: typeof coordinates = [];
        for (let i = 1; i < coordinates.length; i++) {
            deltas.push({
                x: coordinates[i].x - coordinates[i - 1].x,
                y: coordinates[i].y - coordinates[i - 1].y,
            });
        }
        const directions: Array<keyof DirectionalRobot["buttonMap"]> = [];
        let x = this.start.x;
        let y = this.start.y;
        for (const delta of deltas) {
            const {
                dx, dy, addedDirections
            } = this.buildDirections(delta, x, y);
            x = dx;
            y = dy;
            directions.push(...addedDirections);
        }
        if (x !== this.buttonMap.A.x || y !== this.buttonMap.A.y) throw new Error("not at A");
        return directions.join("");
    }
}

function complexity(input: string, length: number) {
    return Number(input.replace("A", "")) * length;
}

const robots = range(2).map(() => new DirectionalRobot());


console.log("Part 1", sum(input.split("\n").map(_code => {
    let code = _code;
    code = new NumpadRobot().runCode(code);
    for (const robot of robots) {
        code = robot.runCode(code);
    }
    console.log(code.length, Number(_code.replace("A", "")))
    return complexity(_code, code.length);
})));
