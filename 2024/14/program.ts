import { fetchInput } from "../../fetchInput";
import { Coordinate, product, range } from "../../utils";

const data = await fetchInput(2024, 14);

const example = `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`;

const exampleMax = {x: 11, y: 7};
const _max = {x: 101, y: 103};

class Robot extends Coordinate {
    dx: number;
    dy: number;
    constructor(robot: string) {
        const [pos, speed] = robot.split(" ");
        const [x, y] = pos.split("=")[1].split(",").map(n => Number(n));
        super(x, y);
        const [dx, dy] = speed.split("=")[1].split(",").map(n => Number(n));
        this.dx = dx;
        this.dy = dy;
    }

    step(max: typeof _max, times: number) {
        this.x = this.x + this.dx * times;
        this.y = this.y + this.dy * times;
        while (this.x < 0) {
            this.x = this.x + max.x;
        }
        while (this.y < 0) {
            this.y = this.y + max.y;
        }
        while (this.x >= max.x) {
            this.x = this.x - max.x;
        }
        while (this.y >= max.y) {
            this.y = this.y - max.y
        }
    }

    quadrant(midX: number, midY: number) {
        if (this.x === midX || this.y === midY) return "none";
        let qx = "L";
        let qy = "T";
        if (this.x > midX) {
            qx = "R";
        }
        if (this.y > midY) {
            qy = "B";
        }
        return qy + qx;
    }
}

function printGrid(max: typeof _max, robots: Array<Robot>) {
    const grid: Array<string> = [];
    for (const y of range(max.y)) {
        const row: Array<string> = [];
        for (const x of range(max.x)) {
            const robotsAtCoordinate = robots.filter(r => r.matches(x, y));
            row.push(robotsAtCoordinate.length ? String(robotsAtCoordinate.length) : ".");
        }
        grid.push(row.join(""));
    }
    console.log(grid.join("\n"));
}

function part1(input: string, max: typeof _max) {
    const robots = input.split("\n").map(r => new Robot(r));

    robots.forEach(r => r.step(max, 100));
    const midX = Math.floor(max.x / 2);
    const midY = Math.floor(max.y / 2);
    const quadrants: Record<string, number> = {"TL": 0, "TR": 0, "BL": 0, "BR": 0};
    robots.forEach(r => {
        const quadrant = r.quadrant(midX, midY);
        if (quadrant !== "none") {
            quadrants[quadrant] = quadrants[quadrant] + 1
        }
    });
    // printGrid(max, robots)
    console.log("Part 1", product(Object.values(quadrants)));

}

function part2(input: string, max: typeof _max) {
    const robots = input.split("\n").map(r => new Robot(r));
    let count = 0;
    while (true) {
        robots.forEach(r => r.step(max, 1));
        count++;
        for (const robotA of robots) {
            // Tree will certainly have a large number of robots in a horizontal contiguous line
            // Find a robot that has at least 25 other robots on the same row, and within 25 columns (nearby)
            // Originally tried threshold = something like 15, then revised after seeing the result
            // Was too lazy to check for robots actually sitting next to each other, so this could have a false positive if 24 robots are sitting
            // in the same square next to the robots being tested, but I didn't encounter that
            const threshold = 25;
            const onSameRow = robots.filter(r => r.y === robotA.y && r.x !== robotA.x && Math.abs(r.x - robotA.x) < threshold);
            if (onSameRow.length > (threshold)) {
                // printGrid(max, robots)
                console.log("Part 2", count);
                return;
            }
        }
    }
}

part1(data, _max);
part2(data, _max);
