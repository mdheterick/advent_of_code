import { fetchInput } from "../../fetchInput";
import { range, sum } from "../../utils";

const data = await fetchInput(2024, 9);

const example = `2333133121414131402`;

class Block {
    id: number;
    constructor(id: number) {
        this.id = id;
    }
}

class File {
    blocks: Array<Block>;
    id: number;
    constructor(id: number) {
        this.id = id;
        this.blocks = [];
    }
}

class Register {
    blocks: Array<Block | null>;
    files: Array<File>;
    constructor(sizes: Array<number>) {
        this.blocks = range(sum(sizes)).map(() => null);
        this.files = [];
        let pointer = 0;
        let free = false;
        let fileId = 0;
        for (const size of sizes) {
            if (free) {
                free = false;
            }
            else {
                const file = new File(fileId);
                for (const b of range(size)) {
                    const block = new Block(fileId);
                    this.blocks[pointer + b] = block;
                    file.blocks.push(block);
                }
                this.files.push(file);
                free = true;
                fileId++;
            }
            pointer += size;
        }
    }

    print() {
        console.log(this.blocks.map(b => b === null ? "." : b.id).join(""));
    }

    compressByBlock() {
        for (let i = 0; i < this.blocks.length; i++) {
            if (this.blocks[i] === null) {
                const lastIndex = this.blocks.findLastIndex(j => j);
                if (i < lastIndex) {
                    this.blocks[i] = this.blocks[lastIndex];
                    this.blocks[lastIndex] = null;
                }
            }
        }
    }

    compressByFile() {
        for (const file of this.files.reverse()) {
            const fileIndex = this.blocks.findIndex(b => b?.id === file.id);
            for (let n = 0; n < this.blocks.length; n++) {
                if (this.blocks[n] === null) {
                    if (n < fileIndex && range(file.blocks.length).every(i => this.blocks[n + i] === null)) {
                        for (let i = 0; i < this.blocks.length; i++) {
                            if (this.blocks[i]?.id === file.id) {
                                this.blocks[i] = null;
                            }
                        }
                        for (let i = 0; i < file.blocks.length; i++) {
                            this.blocks[n + i] = file.blocks[i];
                        }
                        break;
                    }
                }
            }
        }
    }

    checksum() {
        return sum(this.blocks.map((b, i) => b ? b.id * i : 0));
    }
}

const input = data;

const sizes = input.split("").map(s => Number(s));

const register1 = new Register(sizes);
const register2 = new Register(sizes);
register1.compressByBlock();
register2.compressByFile();
console.log("Part 1", register1.checksum());
console.log("Part 2", register2.checksum());