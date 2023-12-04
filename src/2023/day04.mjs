import { readInput } from "../utils/fileReader.mjs";
import { time } from "../utils/timer.mjs";

const lines = (await readInput()).split(/\r?\n/);

time('Part 1', () => {
    const map = { '0':0, '1':1, '2':2, '3':4, '4':8, '5':16, '6':32, '7':64, '8':128, '9':256, '10':512 };

    return lines
        .map((line, lineIndex, array) => {
            const winningNumbers = line.match(/\d+: (.*) \|/)[1].split(' ');
            const yourNumbers = line.match(/\d+: .* \| (.*)/)[1].split(' ');
            const numWins = yourNumbers.reduce((acc, yourNumber) => {
                if (yourNumber === '') return acc;
                return winningNumbers.includes(yourNumber) ? acc + 1 : acc;
            }, 0);
            return map[numWins];})
        .reduce((acc, el) => acc + el, 0);
});

time('Part 2', () => {
    return lines
        .map((line, lineIndex, array) => {
            const winningNumbers = line.match(/\d+: (.*) \|/)[1].split(' ');
            const yourNumbers = line.match(/\d+: .* \| (.*)/)[1].split(' ');
            return yourNumbers.reduce((acc, yourNumber) => {
                if (yourNumber === '') return acc;
                return winningNumbers.includes(yourNumber) ? acc + 1 : acc;
            }, 0)
        })
        .reduce((acc, cardWins, index) => {
            for (let i = 1; i <= cardWins; i++) {
                acc[index + i] += acc[index];
            }
            return acc;
        }, new Array(lines.length).fill(1))
        .reduce((acc, el) => acc + el, 0);
});