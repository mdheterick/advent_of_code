import { fetchInput } from "../../fetchInput";
import { product } from "../../utils";

const data = await fetchInput(2025, 8);

const example = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`;

const runData = data;

class Coordinate3d {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    distance(other: Coordinate3d) {
        // ignore sqrt to save computations
        return (other.x - this.x) ** 2 + (other.y - this.y) ** 2 + (other.z - this.z) ** 2;
    }

    serialise() {
        return `${this.x},${this.y},${this.z}`;
    }
}

class Connection {
    p1: Coordinate3d;
    p2: Coordinate3d;
    distance: number;
    constructor(p1: Coordinate3d, p2: Coordinate3d) {
        this.p1 = p1;
        this.p2 = p2;
        this.distance = p1.distance(p2);
    }

    matches(other: Connection) {
        return this.p1 === other.p2 && this.p2 === other.p1;
    }
}

class Circuit {
    points: Set<Coordinate3d>;
    destroyed: boolean;
    constructor() {
        this.points = new Set();
        this.destroyed = false;
    }

    checkConnection(conn: Connection) {
        for (const point of this.points) {
            if (conn.p1 === point || conn.p2 === point) return true;
        }
        return false;
    }

    addConnection(conn: Connection) {
        this.points.add(conn.p1);
        this.points.add(conn.p2);
    }

    checkOtherCircuit(other: Circuit) {
        if (this.destroyed || other.destroyed) return false;
        return !this.points.isDisjointFrom(other.points);
    }

    mergeCircuits(other: Circuit) {
        if (this.destroyed || other.destroyed) return;
        this.points = this.points.union(other.points);
        other.destroyed = true;
    }

    _pretty() {
        return [...this.points].map(p => p.serialise()).join("-");
    }
}

const points = runData.split("\n").map(p => {
    const [x, y, z] = p.split(",");
    return new Coordinate3d(Number(x), Number(y), Number(z));
});

function part1() {
    const numConnections = runData === example ? 10 : 1000;

    const connections: Array<Connection> = [];
    for (const p1 of points) {
        for (let ip2 = points.indexOf(p1); ip2 < points.length; ip2++) {
            const p2 = points[ip2];
            if (p1 === p2) continue;
            const connection = new Connection(p1, p2);
            connections.push(connection);
            connections.sort((a, b) => a.distance - b.distance);
            while (connections.length > numConnections) connections.pop();
        }
    }

    const circuits = connections.reduce<Array<Circuit>>((_circuits, connection) => {
        let existing = _circuits.find(c => c.checkConnection(connection));
        if (!existing) {
            existing = new Circuit();
            _circuits.push(existing);
        }
        existing.addConnection(connection);
        return _circuits;
    }, []);

    for (let i = 0; i < 10; i++) {
        for (const c1 of circuits) {
            for (const c2 of circuits) {
                if (c1 === c2) continue;
                if (c1.checkOtherCircuit(c2)) {
                    c1.mergeCircuits(c2);
                }
            }
        }
    }

    const top3 = circuits.sort((a, b) => b.points.size - a.points.size).filter(c => !c.destroyed).slice(0, 3);

    console.log("Part 1", product(top3.map(c => c.points.size)));
}

part1();

function part2() {
    let circuits: Array<Circuit> = [];
    const connections: Array<Connection> = [];
    for (const p1 of points) {
        for (let ip2 = points.indexOf(p1); ip2 < points.length; ip2++) {
            const p2 = points[ip2];
            if (p1 === p2) continue;
            const connection = new Connection(p1, p2);
            connections.push(connection);
        }
    }
    connections.sort((a, b) => a.distance - b.distance);
    for (const connection of connections) {
        let existing = circuits.find(c => c.checkConnection(connection));
        if (!existing) {
            existing = new Circuit();
            circuits.push(existing);
        }
        existing.addConnection(connection);
        for (const c1 of circuits) {
            for (const c2 of circuits) {
                if (c1 === c2) continue;
                if (c1.checkOtherCircuit(c2)) {
                    c1.mergeCircuits(c2);
                    circuits = circuits.filter(c => !c.destroyed);
                }
            }
        }
        if (circuits.find(c => c.points.size === points.length)) {
            console.log("Part 2", connection.p1.x * connection.p2.x);
            return;
        }
    }
}

part2();
