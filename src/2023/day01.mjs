import * as fs from 'fs';

const data = await fs.promises.readFile('inputs/day01.txt', 'utf8');
const lines = data.split(/\r?\n/);  

function toDigit(str) {
    const map = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 };
    const digit = parseInt(str);
    return isNaN(digit) ? map[str] : digit;
}

const part1 = lines.map(line => {
    const first = line.match(/(\d)/)[1];
    const last = line.match(/(\d)(?=\D*$)/)[1];
    return parseInt(`${first}${last}`);
}).reduce((acc, el) => acc + el, 0);

const part2 = lines.map(line => {
    const first = toDigit(line.match(/(\d|one|two|three|four|five|six|seven|eight|nine)/)[1]);
    const last = toDigit(line.match(/^.*(\d|one|two|three|four|five|six|seven|eight|nine).*$/)[1]);
    return parseInt(`${first}${last}`);
}).reduce((acc, el) => acc + el, 0);

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);