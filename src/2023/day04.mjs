import * as fs from 'fs';

const data = await fs.promises.readFile('inputs/day04.txt', 'utf8');
const lines = data.split(/\r?\n/);

const map = { '0':0, '1':1, '2':2, '3':4, '4':8, '5':16, '6':32, '7':64, '8':128, '9':256, '10':512 };

const part1 = lines
    .map((line, lineIndex, array) => {
        const winningNumbers = line.match(/\d+: (.*) \|/)[1].split(' ');
        const yourNumbers = line.match(/\d+: .* \| (.*)/)[1].split(' ');
        const numWins = yourNumbers.reduce((acc, yourNumber) => {
            if (yourNumber === '') return acc;
            return winningNumbers.includes(yourNumber) ? acc + 1 : acc;
        }, 0);
        return map[numWins];})
    .reduce((acc, el) => acc + el, 0);

const part2 = lines
    .map((line, lineIndex, array) => {
        const winningNumbers = line.match(/\d+: (.*) \|/)[1].split(' ');
        const yourNumbers = line.match(/\d+: .* \| (.*)/)[1].split(' ');
        return yourNumbers.reduce((acc, yourNumber) => {
            if (yourNumber === '') return acc;
            return winningNumbers.includes(yourNumber) ? acc + 1 : acc;
        }, 0)})
    .reduce((acc, cardWins, index) => {
        for (let i = 1; i <= cardWins; i++) {
            acc[index + i] += acc[index];
        }
        return acc;
    }, new Array(lines.length).fill(1))
    .reduce((acc, el) => acc + el, 0);

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);