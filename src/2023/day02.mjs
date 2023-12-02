import * as fs from 'fs';

const data = await fs.promises.readFile('inputs/day02.txt', 'utf8');
const lines = data.split(/\r?\n/);

const part1 = lines.map(line => {
    const lineId = parseInt(line.match(/^Game (\d+)/)[1]);
    let possible = true;
    const maxRed = 12, maxGreen = 13, maxBlue = 14;
    const pulls = line.match(/^Game \d+: (.*)$/)[1].split(';');
    for (const pull of pulls) {
        const red = pull.match(/^.*?(\d+) red.*$/);
        const green = pull.match(/^.*?(\d+) green.*$/);
        const blue = pull.match(/^.*?(\d+) blue.*$/);
        if (red && parseInt(red[1]) > maxRed) possible = false;
        if (green && parseInt(green[1]) > maxGreen) possible = false;
        if (blue && parseInt(blue[1]) > maxBlue) possible = false;
    }
    return possible ? lineId : 0; 
}).reduce((acc, el) => acc + el, 0);

const part2 = lines.map(line => {
    let maxRed = 0, maxGreen = 0, maxBlue = 0;
    const pulls = line.match(/^Game \d+: (.*)$/)[1].split(';');
    for (const pull of pulls) {
        const red = pull.match(/^.*?(\d+) red.*$/);
        const green = pull.match(/^.*?(\d+) green.*$/);
        const blue = pull.match(/^.*?(\d+) blue.*$/);
        if (red && parseInt(red[1]) > maxRed) maxRed = parseInt(red[1]);
        if (green && parseInt(green[1]) > maxGreen) maxGreen = parseInt(green[1]);
        if (blue && parseInt(blue[1]) > maxBlue) maxBlue = parseInt(blue[1]);
    } 
    return maxRed * maxGreen * maxBlue;
}).reduce((acc, el) => acc + el, 0);

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);