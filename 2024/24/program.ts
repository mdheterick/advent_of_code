import { fetchInput } from "../../fetchInput";

const data = await fetchInput(2024, 24);

const example = `x00: 1
x01: 1
x02: 1
y00: 0
y01: 1
y02: 0

x00 AND y00 -> z00
x01 XOR y01 -> z01
x02 OR y02 -> z02`;

const example2 = `x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj`;

const example3 = `x00: 0
x01: 1
x02: 0
x03: 1
x04: 0
x05: 1
y00: 0
y01: 0
y02: 1
y03: 1
y04: 0
y05: 1

x00 AND y00 -> z05
x01 AND y01 -> z02
x02 AND y02 -> z01
x03 AND y03 -> z03
x04 AND y04 -> z04
x05 AND y05 -> z00`;

const input = data;

class Wire {
    value: boolean | null;
    name: string;
    initial: boolean | null;
    constructor(data: string, initial = true) {
        const [name, value] = data.split(": ");
        this.name = name;
        if (initial) {
            this.value = Boolean(Number(value));
        }
        else {
            this.value = null;
        }
        this.initial = this.value;
    }

    getValue() {
        if (this.value === null) throw new Error("blah");
        return this.value;
    }

    reset() {
        this.value = this.initial;
    }
}

class Gate {
    in1: string;
    gate: "AND" | "OR" | "XOR";
    in2: string;
    out: string;
    in1Wire: Wire | null;
    in2Wire: Wire | null;
    outWire: Wire | null;
    constructor(data: string) {
        const [in1, gate, in2, , out] = data.split(" ");
        this.in1 = in1;
        this.gate = gate as "AND" | "OR" | "XOR";
        this.in2 = in2;
        this.out = out;

        this.in1Wire = null;
        this.in2Wire = null;
        this.outWire = null;
    }

    AND() {
        if (!this.outWire || !this.in1Wire || !this.in2Wire) throw new Error(`Invalid Gate: ${this.in1} ${this.in2} ${this.out}`);
        this.outWire.value = this.in1Wire.value && this.in2Wire.value;
    }

    OR() {
        if (!this.outWire || !this.in1Wire || !this.in2Wire) throw new Error(`Invalid Gate: ${this.in1} ${this.in2} ${this.out}`);
        this.outWire.value = this.in1Wire.value || this.in2Wire.value;
    }

    XOR() {
        if (!this.outWire || !this.in1Wire || !this.in2Wire) throw new Error(`Invalid Gate: ${this.in1} ${this.in2} ${this.out}`);
        this.outWire.value = this.in1Wire.value !== this.in2Wire.value;
    }

    run() {
        this[this.gate]();
    }
}
const [initialWires, initialGates] = input.split("\n\n");

function buildSystem(_initialWires: string, _initialGates: string) {
    const wires = new Map<string, Wire>();
    _initialWires.split("\n").forEach(w => {
        const wire = new Wire(w);
        wires.set(wire.name, wire);
    });
    const gates = _initialGates.split("\n").map(g => new Gate(g));
    
    const gatesToResolve = [...gates];
    while (gatesToResolve.length > 0) {
        const current = gatesToResolve.shift()!;
        if (wires.has(current.in1)) {
            current.in1Wire = wires.get(current.in1)!;
        }
        else {
            const wire = new Wire(current.in1, false);
            wires.set(wire.name, wire);
            current.in1Wire = wire;
        }
        if (wires.has(current.in2)) {
            current.in2Wire = wires.get(current.in2)!;
        }
        else {
            const wire = new Wire(current.in2, false);
            wires.set(wire.name, wire);
            current.in2Wire = wire;
        }
        if (wires.has(current.out)) {
            current.outWire = wires.get(current.out)!;
        }
        else {
            const wire = new Wire(current.out, false);
            wires.set(wire.name, wire);
            current.outWire = wire;
        }
    }
    
    const zwires = [...wires.values()].filter(w => w.name.startsWith("z")).sort((a, b) => Number(b.name.substring(1)) - Number(a.name.substring(1)));
    const xwires = [...wires.values()].filter(w => w.name.startsWith("x")).sort((a, b) => Number(b.name.substring(1)) - Number(a.name.substring(1)));
    const ywires = [...wires.values()].filter(w => w.name.startsWith("y")).sort((a, b) => Number(b.name.substring(1)) - Number(a.name.substring(1)));

    return {zwires, xwires, ywires, wires, gates};
}


function evaluateWires(_wires: Array<Wire>) {
    let bin = "";
    return _wires.reduce<bigint>((total, current, index) => {
        bin += Number(current.getValue()).toString();
        return total + (BigInt(current.getValue()) << BigInt(_wires.length - index - 1));
    }, BigInt(0));
}
function evaluateWiresBinary(_wires: Array<Wire>) {
    return _wires.reduce<string>((total, current, index) => {
        return total + Number(current.getValue()).toString();
    }, "");
}


function resolveWire(w: Wire, gates: Array<Gate>) {
    if (w.value === null) {
        const relevantGate = gates.find(g => g.outWire === w);
        if (!relevantGate) throw new Error(`Could not find gate for ${w.name}`);
        if (relevantGate.in1Wire?.value === null) resolveWire(relevantGate.in1Wire, gates);
        if (relevantGate.in2Wire?.value === null) resolveWire(relevantGate.in2Wire, gates);
        relevantGate.run();
    }
}


function part1() {
    const {xwires, ywires, zwires, gates} = buildSystem(initialWires, initialGates);
    zwires.forEach(g => resolveWire(g, gates));
    const zValue = evaluateWires(zwires);
    console.log("Part 1", zValue.toString());
}
part1();

function part2() {
    const {xwires, ywires, zwires, wires, gates} = buildSystem(initialWires, initialGates);

    function initialiseWires(value: bigint, _wires: Array<Wire>) {
        const bin = value.toString(2).padStart(48, "0");
        bin.split("").reverse().forEach((b, i) => {
            if (_wires.length - 1 - i >= 0) {
                _wires[_wires.length - 1 - i].value = Boolean(Number(b));
            }
        });
    }
    function swap(aname: string, bname: string) {
        const agate = gates.find(g => g.out === aname)!;
        const bgate = gates.find(g => g.out === bname)!;
        const temp = agate.outWire;
        agate.outWire = bgate.outWire;
        bgate.outWire = temp;
        agate.out = bname;
        bgate.out = aname;
    }
    swap("ggn", "z10")
    swap("grm", "z32")
    swap("twr", "z39")
    swap("jcb", "ndw")

    // Test case ripples all bits
    // @ts-expect-error
    let x = 35184372088831n
    initialiseWires(x, xwires);
    // @ts-expect-error
    let y = 1n
    initialiseWires(y, ywires);
    zwires.forEach(g => resolveWire(g, gates));

    console.log([evaluateWiresBinary(xwires).padStart(48, "0"), evaluateWiresBinary(ywires).padStart(48, "0"), evaluateWiresBinary(zwires).padStart(48, "0")].join("\n"));
    
    const actual = evaluateWiresBinary(zwires).padStart(48, "0");
    // let expected = (x & y).toString(2).padStart(48, "0");
    const expected = (x + y).toString(2).padStart(48, "0");
    const badBits = expected.split("").map((b, i) => actual[i] !== b);
    const badIndexes = badBits.map((b, i) => Number(b) * (badBits.length - 1 - i)).filter(Boolean);
    // console.log(badBits, badIndexes); // Help narrow down where bits are going bad

    // The following searches narrow down gates with bad logic
    const xyXOR = initialGates.split("\n").filter(g => g.includes("x") && g.includes("y") && g.includes("XOR"));
    const zXOR = initialGates.split("\n").filter(g => g.includes("XOR") && g.includes("z"));
    // All XOR leading to a z should have an input which is an XOR of an x and y
    const notDirect = zXOR.filter(g => !xyXOR.some(xyg => g.includes(xyg.split("> ")[1])))
    console.log(notDirect);
    // All XOR should either input x and y, or output z
    console.log(initialGates.split("\n").filter(g => g.includes("XOR")).filter(g => !g.includes("x") && !g.includes("y") && !g.includes("z")))
    // All z should be input with XOR
    console.log(initialGates.split("\n").filter(g => g.includes("z")).filter(g => !g.includes("XOR")).filter(g => !g.includes("45")))
    console.log("Part 2", ["ggn", "grm", "twr", "jcb", "z10", "z32", "z39", "ndw"].sort().join(","))
    // manually guessed which gates to swap with each other 
}
part2();
