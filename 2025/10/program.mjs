
// Converted my TS file to JS so I could run it in node because bun can't run z3-solver
// approach stolen from ./cheat.js
// Linear programming days are the worst

import fs from "fs";
import z3_solver_1  from "z3-solver";
const data = fs.readFileSync("./2025_10.input.txt", {encoding: "utf-8"}).replace(/\r/g, "");
var example = "[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}\n[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}\n[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}";
var runData = data;

const alphabet = "abcdefghijklmnopqrstuvwxyz";
var Machine = /** @class */ (function () {
    function Machine(line) {
        var parts = line.split(" ");
        this.lightDiagram = parts[0].split("").slice(1, -1).map(function (l) { return l === "#"; });
        this.buttons = parts.slice(1, -1).map(function (wd) { return wd.substring(1, wd.length - 1).split(",").map(function (w) { return Number(w); }); });
        this.joltageRequirement = parts[parts.length - 1].substring(1, parts[parts.length - 1].length - 1).split(",").map(function (j) { return Number(j); });
        this.indicatorLights = this.lightDiagram.map(function (_) { return false; });
        this.joltageCounters = this.joltageRequirement.map(function (_) { return 0; });
    }
    Machine.prototype.findFewestPressesForLights = function () {
        var _this = this;
        var queue = this.buttons.map(function (_, idx) { return ({
            lights: [... _this.indicatorLights],
            buttonIndex: idx,
            presses: 0,
            pressedButtons: []
        }); });
        while (queue.length) {
            var next = queue.shift();
            var afterPress = this.doLightsPress(next.lights, next.buttonIndex);
            var presses = next.presses + 1;
            if (this.lightsFinished(afterPress))
                return presses;
            queue.push.apply(queue, this.buildLightsButtonOptions(afterPress, presses, [...next.pressedButtons, next.buttonIndex]));
        }
    };
    Machine.prototype.buildLightsButtonOptions = function (lights, presses, pressedButtons) {
        return this.buttons.map(function (_, idx) { return ({
            lights: lights,
            buttonIndex: idx,
            presses: presses,
            pressedButtons: pressedButtons
        }); }).filter(function (b) { return !pressedButtons.includes(b.buttonIndex); });
    };
    Machine.prototype.doLightsPress = function (lights, button) {
        var buttonIndexes = this.buttons[button];
        var ret = [...lights];
        buttonIndexes.map(function (idx) { return (ret[idx] = ret[idx] !== true); });
        return ret;
    };
    Machine.prototype.lightsFinished = function (lights) {
        return this.lightDiagram.every(function (l, idx) { return l === lights[idx]; });
    };
    Machine.prototype.findFewestPressesForJoltage = function (Context) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, Optimize, Int, variables, solver, ind, v, i, condition, j, sum, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = Context("main"), Optimize = _a.Optimize, Int = _a.Int;
                        variables = [];
                        solver = new Optimize();
                        for (ind = 0; ind < this.buttons.length; ind++) {
                            v = Int.const(alphabet[ind]);
                            solver.add(v.ge(0));
                            variables.push(v);
                        }
                        for (i = 0; i < this.joltageRequirement.length; i++) {
                            condition = Int.val(0);
                            for (j = 0; j < this.buttons.length; j++) {
                                if (this.buttons[j].includes(i))
                                    condition = condition.add(variables[j]);
                            }
                            condition = condition.eq(Int.val(this.joltageRequirement[i]));
                            solver.add(condition);
                        }
                        sum = variables.reduce(function (a, x) { return a.add(x); }, Int.val(0));
                        solver.minimize(sum);
                        return [4 /*yield*/, solver.check()];
                    case 1:
                        result = _b.sent();
                        if (result === "sat")
                            return [2 /*return*/, Number(solver.model().eval(sum))];
                        console.log("idunno");
                        return [2 /*return*/, 0];
                }
            });
        });
    };
    return Machine;
}());
var machines = runData.split("\n").map(function (m) { return new Machine(m); });
console.log("Part 1", (machines.map(function (m) { return m.findFewestPressesForLights(); })).reduce((sum, i) => sum + i, 0));
z3_solver_1.init().then(async ({Context}) => {
    console.log("Part 2", (await Promise.all(machines.map(m => m.findFewestPressesForJoltage(Context)))).reduce((sum, i) => i + sum, 0))
})
