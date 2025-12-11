import { fetchInput } from "../../fetchInput";
import { product } from "../../utils";

const data = await fetchInput(2025, 11);

const example = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`;

const example2 = `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`;

const runData = data;

class Device {
    id: string;
    connectionsRaw: string[];
    outs: Device[];
    ins: Device[];
    constructor(line: string) {
        const [id, _c] = line.split(":");
        const connections = _c.trim().split(" ");
        this.id = id;
        this.connectionsRaw = connections;
        this.outs = [];
        this.ins = [];
    }

    // assume no loops
    * getNextHops() {
        for (const connection of this.outs) {
            yield connection;
        }
    }

    * getPreviousHops() {
        for (const connection of this.ins) {
            yield connection;
        }
    }
}

class Node {
    location: Device;
    hops: number;
    constructor(location: Device, hops: number) {
        this.location = location;
        this.hops = hops;
    }
}

const out = new Device("out:");
const devices = [...runData.split("\n").map(d => new Device(d)), out];
const deviceMap = devices.reduce<Record<string, Device>>((map, d) => {
    map[d.id] = d;
    return map;
}, {out});
devices.forEach(d => {
    d.outs = d.connectionsRaw.map(c => deviceMap[c]);
    d.ins = devices.filter(dd => dd.connectionsRaw.includes(d.id));
});

function findPaths(start: Device, end: Device, reverse = false) {
    const queue = [new Node(start, 0)];
    const possibleParents = new Set<Device>();
    let parentQueue = [end];
    while (parentQueue.length) {
        const current = parentQueue.shift()!;
        possibleParents.add(current);
        for (const parent of current.getPreviousHops()) {
            if (!possibleParents.has(parent) && !parentQueue.includes(parent)) {
                parentQueue.push(parent);
            }
        }
    }
    if (!possibleParents.has(start)) {
        console.log("early exist", start.id, end.id)
        return 0;
    }
    let outPaths = 0;
    while (queue.length) {
        const current = queue.shift()!;
        const hops = reverse ? current.location.getPreviousHops() : current.location.getNextHops();
        for (const next of hops) {
            if (next === end) {
                outPaths++;
            }
            else if (current.hops > 576) {
                console.log("loop")
            }
            else if (possibleParents.has(next)) {
                queue.push(new Node(next, current.hops + 1));
            }
        }
    }
    return outPaths;
}

const me = deviceMap["you"];

console.log("Part 1", findPaths(me, out))

const svr = deviceMap["svr"];
const dac = deviceMap["dac"];
const fft = deviceMap["fft"];

const dacFirst: Array<number> = [
    // findPaths(svr, dac),
    // findPaths(dac, fft), // 0
    // findPaths(fft, out),
]
const fftFirst = [
    findPaths(svr, fft), // 3879
    findPaths(fft, dac), // 19449090
    findPaths(dac, out), // 4811
];

console.log("Part 2", product(fftFirst));

// Apparently doing a recursive DFS with memoisation is much faster and probably simpler in implementation.
// This is just a naive BFS with an additional step to check all possible parents of the destination node, if the current node is not one of those parents we can just bail
