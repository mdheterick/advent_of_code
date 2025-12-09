import { fetchInput } from "../../fetchInput";
import { Coordinate } from "../../utils";

const data = await fetchInput(2025, 9);

const example = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;

const runData = example;

const points = runData.split("\n").map(p => {
    const [x, y] = p.split(",");
    return new Coordinate(Number(x), Number(y));
});

let biggest = 0;
for (const p1 of points) {
    for (const p2 of points) {
        const area = (Math.abs(p1.x - p2.x) + 1) * (Math.abs(p1.y - p2.y) + 1);
        if (area > biggest) biggest = area;
    }
}

console.log("Part 1", biggest);


// Data is a big ellipse with a narrow cutout going from middle of left side, almost to right side (plot on excel to verify)
// Assume that largest box includes on of the two points in the cutout, and the other is on the opposite arc of the ellipse

/*   * * * * * *
   *             *
 *                 *
*----------------+ *
*----------------+ *
 *                 *
   *             *
     * * * * * *
*/
let pois = points.filter(p => p.x === 94927);
if (pois.length === 0) {
    pois = [...points]; // handle example case
}

biggest = 0;
for (const poi of pois) {
    for (const p2 of points) {
        if (poi.x === p2.x) continue;
        if (poi.y === p2.y) continue;
        // make sure we're compring to the right side of the ellipse, upper poi only goes up, lower poi only goes down
        if (poi.y === 50365 && poi.y > p2.y) continue;
        if (poi.y === 48406 && poi.y < p2.y) continue;
        const [smallX, largeX] = poi.x < p2.x ? [poi.x, p2.x] : [p2.x, poi.x];
        const [smallY, largeY] = poi.y < p2.y ? [poi.y, p2.y] : [p2.y, poi.y];
        const area = (Math.abs(poi.x - p2.x) + 1) * (Math.abs(poi.y - p2.y) + 1);
        // Account for rough edge of ellipse that cuts back sometimes
        if (area > biggest && points.every(p3 => !boxContainsPoint(smallX, largeX, smallY, largeY, p3))) {
            if (area > biggest) {
                biggest = area;
            }

        }
    }
}

console.log("Part 2", biggest);

function boxContainsPoint(x1: number, x2: number, y1: number, y2: number, p: Coordinate) {
    if (p.x <= x1) return false;
    if (p.x >= x2) return false;
    if (p.y <= y1) return false;
    if (p.y >= y2) return false;
    return true;
}