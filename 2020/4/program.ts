import { fetchInput } from "../../fetchInput";

const passportsBlobs = (await fetchInput(2020, 4)).split("\n\n");

class Passport {
    byr: string;
    iyr: string;
    eyr: string;
    hgt: string;
    hcl: string;
    ecl: string;
    pid: string;
    cid: string;
    constructor(passportBlob: string) {
        this.byr = this.getPattern("byr", passportBlob);
        this.iyr = this.getPattern("iyr", passportBlob);
        this.eyr = this.getPattern("eyr", passportBlob);
        this.hgt = this.getPattern("hgt", passportBlob);
        this.hcl = this.getPattern("hcl", passportBlob);
        this.ecl = this.getPattern("ecl", passportBlob);
        this.pid = this.getPattern("pid", passportBlob);
        this.cid = this.getPattern("cid", passportBlob);
    }

    getPattern(key: string, blob: string) {
        const [,value] = (new RegExp(`${key}:(\\S*)`)).exec(blob) || [];
        return value;
    }

    isValid1() {
        return this.byr && this.iyr && this.eyr && this.hgt && this.hcl && this.ecl && this.pid;
    }

    isValid2() {
        const byrValid = /^(19[2-9]\d)|(200[012])$/.test(this.byr);
        const iyrValid = /^(201\d)|2020$/.test(this.iyr);
        const eyrValid = /^(202\d)|2030$/.test(this.eyr);
        const hgtValid = /(^((1[5-8]\d)|(19[0123]))cm$)|(^(59|(6\d)|(7[0123456]))in$)/.test(this.hgt);
        const hclValid = /^#[\da-f]{6}$/.test(this.hcl);
        const eclValid = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(this.ecl);
        const pidValid = /^\d{9}$/.test(this.pid);
        return this.isValid1() &&  byrValid && iyrValid && eyrValid && hgtValid && hclValid && eclValid && pidValid;
    }
}

const passports = passportsBlobs.map(p => new Passport(p));
console.log(passports.filter(p => p.isValid1()).length)
console.log(passports.filter(p => p.isValid2()).length)