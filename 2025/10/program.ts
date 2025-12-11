import { fetchInput } from "../../fetchInput";
import { alphabet, sum } from "../../utils";

import { init, Arith, Bool } from "z3-solver";

const data = await fetchInput(2025, 10);

const example = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;

const runData = data;

type Lights = Array<boolean>;
type Joltages = Array<number>;
type Button = Array<number>;

const { Context } = await init();

class Machine {
    lightDiagram: Lights;
    buttons: Button[];
    joltageRequirement: number[];
    indicatorLights: boolean[];
    joltageCounters: number[];
    constructor(line: string) {
        const parts = line.split(" ");
        this.lightDiagram = parts[0].split("").slice(1, -1).map(l => l === "#");
        this.buttons = parts.slice(1, -1).map(wd => wd.substring(1, wd.length - 1).split(",").map(w => Number(w)));
        this.joltageRequirement = parts[parts.length - 1].substring(1, parts[parts.length - 1].length - 1).split(",").map(j => Number(j));

        this.indicatorLights = this.lightDiagram.map(_ => false);
        this.joltageCounters = this.joltageRequirement.map(_ => 0);
    }

    findFewestPressesForLights() {
        const queue = this.buttons.map((_, idx) => ({
            lights: [...this.indicatorLights],
            buttonIndex: idx,
            presses: 0,
            pressedButtons: [] as Array<number>
        }));
        while (queue.length) {
            const next = queue.shift()!;
            const afterPress = this.doLightsPress(next.lights, next.buttonIndex);
            const presses = next.presses + 1;
            if (this.lightsFinished(afterPress)) return presses;
            queue.push(...this.buildLightsButtonOptions(afterPress, presses, [...next.pressedButtons, next.buttonIndex]));
        }
    }

    buildLightsButtonOptions(lights: Lights, presses: number, pressedButtons: Array<number>) {
        return this.buttons.map((_, idx) => ({
            lights: lights,
            buttonIndex: idx,
            presses,
            pressedButtons
        })).filter(b => !pressedButtons.includes(b.buttonIndex));
    }

    doLightsPress(lights: Lights, button: number): Lights {
        const buttonIndexes = this.buttons[button];
        const ret = [...lights];
        buttonIndexes.map(idx => (ret[idx] = ret[idx] !== true));
        return ret;
    }

    lightsFinished(lights: Lights) {
        return this.lightDiagram.every((l, idx) => l === lights[idx]);
    }

    async findFewestPressesForJoltage() {
        const { Optimize, Int} = Context("main");

        const variables: Array<ReturnType<typeof Int.const>> = [];

        const solver = new Optimize();

        for (let ind = 0; ind < this.buttons.length; ind++) {
            const v = Int.const(alphabet[ind]);
            solver.add(v.ge(0));
            variables.push(v);
        }

        for (let i = 0; i < this.joltageRequirement.length; i++) {
            let condition: Arith<"main"> | Bool<"main"> = Int.val(0);
            for (let j = 0; j < this.buttons.length; j++) {
                if (this.buttons[j].includes(i)) condition = condition.add(variables[j]);
            }
            condition = condition.eq(Int.val(this.joltageRequirement[i]));
        }

        const sum = variables.reduce((a, x) => a.add(x), Int.val(0));
        solver.minimize(sum);
        const result = await solver.check();
        if (result === "sat") return Number(solver.model().eval(sum));
        console.log("idunno")
        return 0;
    }
}

const machines = runData.split("\n").map(m => new Machine(m));

console.log("Part 1", sum(machines.map(m => m.findFewestPressesForLights())));
// Bun can't run z3-solver https://github.com/oven-sh/bun/issues/19453
// console.log(await machines[0].findFewestPressesForJoltage())
// console.log("Part 2", await Promise.all(machines.map(m => m.findFewestPressesForJoltage())))
