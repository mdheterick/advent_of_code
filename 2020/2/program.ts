import { fetchInput } from "../../fetchInput";

const data = (await fetchInput(2020, 2)).split("\n");


const reg = /(\d*)-(\d*) (.): (.*)/;

class Password {
    value: string;
    min: number;
    max: number;
    char: string;
    constructor(line: string) {
        const [, min, max, char, value] = reg.exec(line);
        this.value = value;
        this.min = parseInt(min, 10);
        this.max = parseInt(max, 10);
        this.char = char;
    }

    isValid1() {
        const bits = this.value.split("").sort();
        const firstOccurrence = bits.findIndex(a => a === this.char);
        if (firstOccurrence === -1 && this.min !== 0) return false;
        if (bits[firstOccurrence + this.min - 1] !== this.char) return false;
        if (bits[firstOccurrence + this.max] === this.char) return false;
        return true;
    }

    isValid2() {
        const first = this.value[this.min - 1];
        const second = this.value[this.max - 1];
        if ((first === this.char || second === this.char) && first !== second) return true;
        return false;
    }
}

const passwords = data.map(p => new Password(p));

console.log(passwords.filter(p => p.isValid1()).length, passwords.filter(p => p.isValid2()).length);
