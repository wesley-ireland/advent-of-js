import { readInput } from "../utils/fileReader.mjs";
import { time } from "../utils/timer.mjs";

const input = await readInput();
const regex = /^\w+:[ ]+(.+)/gm;

function getNumWaysToBeatRecord(raceTime, distanceRecord) {
    let numWays = 0;
    for (let i = 0; i <= raceTime; i++) {
        const timeHoldingButton = i;
        const speed = timeHoldingButton;
        const timeRacing = raceTime - timeHoldingButton;
        const distance = timeRacing * speed;
        if (distance > distanceRecord) numWays++;
    }
    return numWays;
}

time('Part 1', () => {
    const matches = input.matchAll(regex);
    const raceTimes = matches.next().value[1].split(' ').filter(el => el !== '');
    const distanceRecords = matches.next().value[1].split(' ').filter(el => el !== '');
    
    return raceTimes
        .map((el, i) => {
            const raceTime = raceTimes[i];
            const distanceRecord = distanceRecords[i];
            return getNumWaysToBeatRecord(raceTime, distanceRecord);
        })
        .reduce((acc, el) => acc * el, 1);
});

time('Part 2', () => {
    const matches = input.matchAll(regex);
    const raceTime = parseInt(matches.next().value[1].replaceAll(' ', ''));
    const distanceRecord = parseInt(matches.next().value[1].replaceAll(' ', ''));
    return getNumWaysToBeatRecord(raceTime, distanceRecord);
});