import { fetchInput } from "../../fetchInput";

const data = (await fetchInput(2021, 16));

const testData = [
    "8A004A801A8002F478",
    "620080001611562C8802118E34",
    "C0015000016115A2E0802F182340",
    "A0016C880162017C3686B18A3D4780",
    "C200B40A82",
    "04005AC33890",
    "880086C3E88112",
    "CE00C43D881120",
    "D8005AC2A8F0"
]

const runData = data;

function packetToBinaryString(packet: string) {
    const bits = packet.split("").map(c => parseInt(c, 16).toString(2).padStart(4, "0")).join("");
    return bits;
}

class Packet {
    version: number;
    type: number;
    bits: string;
    static create(packetString: string) {
        const bits = packetToBinaryString(packetString);
        return Packet.createFromBits(bits);
    }

    static createFromBits(bits: string) {
        const version = parseInt(bits.slice(0, 3), 2);
        const type = parseInt(bits.slice(3, 6), 2);
        if (type === 4) return new Literal(version, type, bits);
        else if (bits[6] === "0") return new OperatorLength(version, type, bits);
        else return new OperatorNum(version, type, bits);
    }
    
    constructor(version: number, type: number, bits: string) {
        this.version = version;
        this.type = type;
        this.bits = bits;
    }
}


class Literal extends Packet {
    numBits: string;
    number: number;
    constructor(version: number, type: number, bits: string) {
        super(version, type, bits);

        let num = "";
        let ptr = 6;
        while (true) {
            num += bits.slice(ptr + 1, ptr + 5);
            if (bits[ptr] === "0") {
                break;
            }
            ptr += 5;
        }
        this.numBits = num;
        this.bits = bits.slice(0, ptr + 5);
        this.number = parseInt(num, 2);
    }

    get versionTotal() {
        return this.version;
    }

    get value() {
        return this.number;
    }
}

class Operator extends Packet {
    lengthTypeId: any;
    subpackets: any[];
    constructor(version: number, type: number, bits: string) {
        super(version, type, bits);
        this.lengthTypeId = bits[6];
        this.subpackets = []
    }

    get versionTotal() {
        return this.version + this.subpackets.reduce((sum, p) => sum + p.versionTotal, 0);
    }

    get value() {
        if (this.type === 0) return this.sum();
        if (this.type === 1) return this.product();
        if (this.type === 2) return this.minimum();
        if (this.type === 3) return this.maximum();
        if (this.type === 5) return this.gt();
        if (this.type === 6) return this.lt();
        if (this.type === 7) return this.equal();
    }

    sum() {
        return this.subpackets.reduce((sum, p) => sum + p.value, 0);
    }

    product() {
        return this.subpackets.reduce((product, p) => product * p.value, 1);
    }

    minimum() {
        return Math.min(...this.subpackets.map(p => p.value));
    }

    maximum() {
        return Math.max(...this.subpackets.map(p => p.value));
    }

    gt() {
        return this.subpackets[0].value > this.subpackets[1].value ? 1 : 0;
    }

    lt() {
        return this.subpackets[0].value < this.subpackets[1].value ? 1 : 0;
    }

    equal() {
        return this.subpackets[0].value === this.subpackets[1].value ? 1 : 0;
    }
}

class OperatorLength extends Operator {
    length: number;
    constructor(version: number, type: number, bits: string) {
        super(version, type, bits);
        this.length = parseInt(bits.slice(7, 22), 2);

        const packetBits = bits.slice(22, 22 + this.length);
        let ptr = 0;
        this.bits = bits.slice(0, 22);
        while (ptr < this.length) {
            const pkt = Packet.createFromBits(packetBits.slice(ptr));
            ptr += pkt.bits.length;
            this.subpackets.push(pkt);
            this.bits += pkt.bits;
        }
    }
}

class OperatorNum extends Operator {
    numPackets: number;
    constructor(version: number, type: number, bits: string) {
        super(version, type, bits);
        this.numPackets = parseInt(bits.slice(7, 18), 2);
        const packetBits = bits.slice(18);
        let ptr = 0;
        this.bits = bits.slice(0, 18);
        while (this.subpackets.length < this.numPackets) {
            const pkt = Packet.createFromBits(packetBits.slice(ptr));
            ptr += pkt.bits.length;
            this.subpackets.push(pkt);
            this.bits += pkt.bits;
        }
    }
}

function part1(input: typeof runData) {
    const packet = Packet.create(input);
    return packet.versionTotal;
}

function part2(input: typeof runData) {
    const packet = Packet.create(input);
    return packet.value;
}

console.log(part1(runData));
console.log(part2(runData));