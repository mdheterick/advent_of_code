import { fetchInput } from "../../fetchInput";
import { memoise } from "../../utils";

const data = await fetchInput(2024, 23);

const example = `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`;

const input = data;

const edges: Array<Edge> = [];

class Node {
    name: string;
    constructor(name: string) {
        this.name = name;

        this.getNeighbours = memoise(this.getNeighbours.bind(this));
    }

    getNeighbours() {
        const myLinks = edges.filter(e => e.start === this.name || e.end === this.name);
        return myLinks.map(l => l.start === this.name ? l.end : l.start);
    }
}

class Edge {
    end: string;
    start: string;
    constructor(start: string, end: string) {
        this.start = start;
        this.end = end;
    }
}

const nodes = new Map<string, Node>();

input.split("\n").forEach(link => {
    const [start, end] = link.split("-");
    if (!nodes.has(start)) nodes.set(start, new Node(start));
    if (!nodes.has(end)) nodes.set(end, new Node(end));
    edges.push(new Edge(start, end));
});

const clusters3 = new Set<string>();

const clusters = new Map<string, number>();

for (const tnode of nodes.values()) {
    const tNodeNeighbours = tnode.getNeighbours();
    const tNeighbours = new Set(tNodeNeighbours);
    for (const nodeName of tNodeNeighbours) {
        const node = nodes.get(nodeName)!;
        const nodeNeighbours = node.getNeighbours();
        const nNeighbours = new Set(nodeNeighbours);
        // @ts-expect-error new function
        const mutuals: Set<string> = tNeighbours.intersection(nNeighbours);
        const clusterKey = [tnode.name, nodeName, ...mutuals].sort().join(",");
        if (!clusters.has(clusterKey)) {
            clusters.set(clusterKey, 1);
        }
        else {
            clusters.set(clusterKey, clusters.get(clusterKey)! + 1);
        }
        if (tnode.name.startsWith("t")) {
            for (const mutual of mutuals) {
                clusters3.add([tnode.name, nodeName, mutual].sort().join(","));
            }
        }
    }
}
console.log("Part 1", clusters3.size);
console.log("Part 2", [...clusters.entries()].sort((a, b) => b[1] - a[1])[0][0]);
