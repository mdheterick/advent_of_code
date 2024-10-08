import { fetchInput } from "../../fetchInput";

const data = (await fetchInput(2021, 4));

const testData = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`;

const runData = data;

class Board {
    rows: string[][];
    constructor(boardString: string) {
        const rows = boardString.split("\n");
        this.rows = rows.map(r => r.replace(/\s+/g, " ").replace(/^ /g, "").split(" "));
    }

    drawNumbers(numbers: Array<string>) {
        for (let i = 4; i < numbers.length; i++) {
            const score = this.checkWin(numbers.slice(0, i + 1));
            if (score) {
                return {
                    draw: i,
                    score: score * parseInt(numbers[i], 10)
                };
            }
        }
        throw new Error("Could not find draw number")
    }

    checkWin(numbers: Array<string>) {
        const matches = Array.from(this.rows, row => Array.from(row, () => false));
        for (const n of numbers) {
            for (const r in this.rows) {
                for (const c in this.rows[r]) {
                    if (this.rows[r][c] === n) {
                        matches[r][c] = true;
                    }
                }
            }
        }
        for (let r = 0; r < matches.length; r++) {
            let colMatched = true;
            let rowMatched = true;
            for (let c = 0; c < matches[r].length; c++) {
                rowMatched = rowMatched && matches[r][c];
                colMatched = colMatched && matches[c][r];
            }
            if (rowMatched || colMatched) {
                return this.rows.reduce((sum, row, rowIdx) => {
                    for (const col in row) {
                        if (!matches[rowIdx][col]) {
                            sum += parseInt(row[col], 10);
                        }
                    }
                    return sum;
                }, 0);
            };
        }
    }
}

function parseData(input: typeof runData) {
    const [numbers, ...boards] = input.split("\n\n");
    return {
        numbers: numbers.split(","),
        boards: boards.map(b => new Board(b))
    }
}

function part1(input: typeof runData) {
    const {numbers, boards} = parseData(input);
    const draws = boards.map(b => b.drawNumbers(numbers)).sort((a, b) => a.draw - b.draw);
    return draws[0].score;
}

function part2(input: typeof runData) {
    const {numbers, boards} = parseData(input);
    const draws = boards.map(b => b.drawNumbers(numbers)).sort((a, b) => a.draw - b.draw);
    return draws[draws.length - 1].score;
}

console.log(part1(runData));
console.log(part2(runData));
