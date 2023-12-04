import * as fs from 'fs';
import {time} from "../utils/timer.mjs";

const data = await fs.promises.readFile('inputs/day03.txt', 'utf8');
const lines = data.split(/\r?\n/);
 
const isSymbol = (char) => '!@#$%^&*()_+-=[]\\{}|;:\'",<>/?'.indexOf(char) !== -1;

function hasSymbolLeft(numberIndex, line) {
    if (numberIndex === 0) return false;
    return isSymbol(line[numberIndex - 1]);  
}

function hasSymbolRight(numberIndex, numberLength, line) {
    if (numberIndex + numberLength === line.length) return false;
    return isSymbol(line[numberIndex + numberLength]);
}

function hasSymbolAbove(numberIndex, number, lineIndex, array) {
    if (lineIndex === 0) return false;
    const lineAbove = array[lineIndex - 1];
    const stringAbove = lineAbove.slice(numberIndex, numberIndex + number.toString().length);
    for (const char of stringAbove.split('')) {
       if (isSymbol(char)) return true;
    }
    if (number === '1') {
        console.log(lineAbove[numberIndex], lineAbove[numberIndex+number.toString().length])
        console.log(numberIndex+number.toString().length, numberIndex)
    }
    return hasSymbolLeft(numberIndex, lineAbove) || hasSymbolRight(numberIndex, number.toString().length, lineAbove);
}

function hasSymbolBelow(numberIndex, number, lineIndex, array) {
    if (lineIndex === array.length - 1) return false;
    const lineBelow = array[lineIndex + 1];
    const stringBelow = lineBelow.slice(numberIndex, numberIndex + number.toString().length);
    for (const char of stringBelow.split('')) {
        if (isSymbol(char)) return true;
    }
    return hasSymbolLeft(numberIndex, lineBelow) || hasSymbolRight(numberIndex, number.toString().length, lineBelow); 
}

function hasAdjacentSymbol(line, number, lineIndex, array, numberIndex) {
    return hasSymbolLeft(numberIndex, line) ||
        hasSymbolRight(numberIndex, number.toString().length, line) ||
        hasSymbolAbove(numberIndex, number, lineIndex, array) ||
        hasSymbolBelow(numberIndex, number, lineIndex, array);
}

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

time('Part 1', () => {
    return lines.map((line, lineIndex, array) => {
        return [...line.matchAll(/(\d+)/g)].map(numberMatch => {
            const number = parseInt(numberMatch[1]);
            if (hasAdjacentSymbol(line, number, lineIndex, array, numberMatch.index)) {
                return number;
            };
            return 0;
        }).reduce((acc, el) => acc + el, 0);
    }).reduce((acc, el) => acc + el, 0);
});

time('Part 2', () => {
    return lines.map((line, lineIndex, array) => {
        return [...line.matchAll(/([*])/g)].map(gearMatch => {
            const adjacentNumbers = getAdjacentNumbers(line, lineIndex, gearMatch.index, array);
            if (adjacentNumbers.length === 2) {
                return adjacentNumbers[0] * adjacentNumbers[1];
            }
            return 0;
        }).reduce((acc, el) => acc + el, 0);
    }).reduce((acc, el) => acc + el, 0);
});
