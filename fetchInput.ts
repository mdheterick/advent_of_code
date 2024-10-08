import { session } from "./env";

export async function fetchInput(year: number, day: number) {
    const saved = Bun.file(`${year}_${day}.input.txt`);
    if (await saved.exists()) {
        console.log("Input read from local file");
        return await saved.text();
    }
    console.log("input read from website");
    const response = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
        headers: {"Cookie": `session=${session}`}
    });
    const inputText = await response.text();
    await Bun.write(saved, inputText);
    return inputText;
}
