import * as fs from 'fs';

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
    const hasAdjacentSymbol = hasSymbolLeft(numberIndex, line) ||
        hasSymbolRight(numberIndex, number.toString().length, line) ||
        hasSymbolAbove(numberIndex, number, lineIndex, array) ||
        hasSymbolBelow(numberIndex, number, lineIndex, array);
    console.log(`Number ${number} hasAdjacentSymbol ${hasAdjacentSymbol} line length ${line.length}, lineindex ${lineIndex}, numberIndex: ${numberIndex}`)
    return hasAdjacentSymbol;
}

const part1 = lines.map((line, lineIndex, array) => {
    let lineSum = 0;
    const lineMatches = [...line.matchAll(/(\d+)/g)];
    lineMatches.forEach(match => {
        // console.log(line, match[1], lineIndex, array, match.index)
       if (hasAdjacentSymbol(line, parseInt(match[1]), lineIndex, array, match.index)) {
           lineSum += parseInt(match[1]);
       }
    });
    return lineSum;
}).reduce((acc, el) => acc + el, 0);

console.log(`Part 1: ${part1}`);
// console.log(`Part 2: ${part2}`);