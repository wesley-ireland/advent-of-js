import * as fs from 'fs';

const data = await fs.promises.readFile('inputs/day03.txt', 'utf8');
const lines = data.split(/\r?\n/);

function getLeftAdjacentNumbers(gearIndex, line) {
    return [...line.matchAll(/(\d+)/g)]
        .filter(numberMatch => gearIndex - numberMatch.index - numberMatch[1].length === 0)
        .map(numberMatch => parseInt(numberMatch[1]));
}

function getRightAdjacentNumbers(gearIndex, line) {
    return [...line.matchAll(/(\d+)/g)]
        .filter(numberMatch => numberMatch.index - gearIndex === 1)
        .map(numberMatch => parseInt(numberMatch[1]));
}

function getAboveAdjacentNumbers(gearIndex, lineIndex, array) {
    if (lineIndex === 0) return [];
    const lineAbove = array[lineIndex - 1];
    return [...lineAbove.matchAll(/(\d+)/g)]
        .filter(numberMatch => numberMatch.index === gearIndex
            || numberMatch.index === gearIndex + 1
            || (numberMatch.index <= gearIndex - 1 && numberMatch.index + numberMatch[1].length - 1 >= gearIndex - 1))
        .map(numberMatch => parseInt(numberMatch[1]));
}

function getBelowAdjacentNumbers(gearIndex, lineIndex, array) {
    if (lineIndex === array.length - 1) return [];
    const lineBelow = array[lineIndex + 1];
    return [...lineBelow.matchAll(/(\d+)/g)]
        .filter(numberMatch => numberMatch.index === gearIndex
            || numberMatch.index === gearIndex + 1
            || (numberMatch.index <= gearIndex - 1 && numberMatch.index + numberMatch[1].length - 1 >= gearIndex - 1))
        .map(numberMatch => parseInt(numberMatch[1]));
}

function getAdjacentNumbers(line, lineIndex, gearIndex, array) {
    const left = getLeftAdjacentNumbers(gearIndex, line);
    const right = getRightAdjacentNumbers(gearIndex, line);
    const above = getAboveAdjacentNumbers(gearIndex, lineIndex, array);
    const below = getBelowAdjacentNumbers(gearIndex, lineIndex, array);
    return [...left, ...right, ...above, ...below];
}

const part2 = lines.map((line, lineIndex, array) => {
    return [...line.matchAll(/([*])/g)].map(gearMatch => {
        const adjacentNumbers = getAdjacentNumbers(line, lineIndex, gearMatch.index, array);
        if (adjacentNumbers.length === 2) {
            return adjacentNumbers[0] * adjacentNumbers[1];
        }
        return 0;
    }).reduce((acc, el) => acc + el, 0);
}).reduce((acc, el) => acc + el, 0);

console.log(`Part 2: ${part2}`);