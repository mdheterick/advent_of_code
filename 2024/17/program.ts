import { fetchInput } from "../../fetchInput";

const data = await fetchInput(2024, 17);

const example = `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`;

const example2 = `Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`; // base 8 to base 10, reverse, then move leftmost digit to right

const input = data;

const [_registers, _program] = input.split("\n\n");

type Instruction = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";

const eight = BigInt(8);
const two = BigInt(2);

class Computer {
    A: bigint;
    B: bigint;
    C: bigint;
    instructions;
    instructionPointer: number;
    output: bigint[];
    constructor(registers: [number, number, number]) {
        this.A = BigInt(registers[0]);
        this.B = BigInt(registers[1]);
        this.C = BigInt(registers[2]);

        this.instructionPointer = 0;

        this.output = [];

        this.instructions = {
            "0": (operand: string) => {
                this.A = this.A / (two**this.comboOperand(operand));
                this.instructionPointer += 2;
            },
            "1": (operand: string) => {
                this.B = this.B ^ this.literalOperand(operand);
                this.instructionPointer += 2;
            },
            "2": (operand: string) => {
                this.B = this.comboOperand(operand) % eight;
                this.instructionPointer += 2;
            },
            "3": (operand: string) => {
                if (this.A !== BigInt(0)) {
                    this.instructionPointer = Number(this.literalOperand(operand));
                }
                else {
                    this.instructionPointer += 2;
                }
            },
            "4": (operand: string) => {
                this.B = this.B ^ this.C;
                this.instructionPointer += 2;
            },
            "5": (operand: string) => {
                this.output.push(this.comboOperand(operand) % eight);
                this.instructionPointer += 2;
            },
            "6": (operand: string) => {
                this.B = this.A / (two**this.comboOperand(operand));
                this.instructionPointer += 2;
            },
            "7": (operand: string) => {
                this.C = this.A / (two**this.comboOperand(operand));
                this.instructionPointer += 2;
            }
        }
    }

    comboOperand(operand: string) {
        if (["0", "1", "2", "3"].includes(operand)) return BigInt(Number(operand));
        if (operand === "4") return this.A;
        if (operand === "5") return this.B;
        if (operand === "6") return this.C;
        throw new Error("Invalid combo operand " + operand);
    }

    literalOperand(operand: string) {
        return BigInt(Number(operand));
    }

    runProgram(program: Array<Instruction>) {
        while (this.instructionPointer < program.length) {
            const instruction = program[this.instructionPointer];
            const operand = program[this.instructionPointer + 1];
            this.instructions[instruction](operand);
        }
    }
}

const program = _program.split(" ")[1].split(",") as Array<Instruction>;
// @ts-expect-error
const computer = new Computer(_registers.split("\n").map(r => Number(r.match(/\d+/)?.[0])));
computer.runProgram(program);
console.log("Part 1", computer.output.join(","));
const pj = program.join(",");
let output = "";
let initial = BigInt(0o1137262025052);
while (output !== pj) {
    // @ts-expect-error
    const computer = new Computer(_registers.split("\n").map(r => Number(r.match(/\d+/)?.[0])));
    computer.A = initial;
    computer.runProgram(program);
    output = computer.output.join(",");
    initial += BigInt(0o1000000000000);
}
console.log("Part 2", Number(initial));
