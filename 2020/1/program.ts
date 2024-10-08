import { fetchInput } from "../../fetchInput";

const data = (await fetchInput(2020, 1)).split("\n");
const dataNumbers = data.map(d => parseInt(d, 10));

const obj = dataNumbers.reduce((o, num) => {o[num] = true; return o;}, {});

// part 1
const match = dataNumbers.find(a => obj[2020 - a]);
if (match) {
    console.log(match, 2020 - match, match * (2020 - match));
}
else {
    console.log("part 1: no match found");
}

// part 2
dataNumbers.find(i => {
    return dataNumbers.find(j => {
        if (i !== j) {
            if (obj[2020 - i - j]) {
                const rem = 2020 - i - j;
                console.log(i, j, rem, i * j * rem);
                return rem;
            }
        }
    });
});
