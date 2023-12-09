import { readInput } from "../utils/fileReader.mjs";
import { time } from "../utils/timer.mjs";

const input = await readInput();
const inputRegex = /seeds: (?<seedsStr>.*)\n\nseed-to-soil map:\n(?<seed2soilStr>.*?)\n\nsoil-to-fertilizer map:\n(?<soil2fertStr>.*?)\n\nfertilizer-to-water map:\n(?<fert2waterStr>.*?)\n\nwater-to-light map:\n(?<water2lightStr>.*?)\n\nlight-to-temperature map:\n(?<light2tempStr>.*?)\n\ntemperature-to-humidity map:\n(?<temp2humidStr>.*?)\n\nhumidity-to-location map:\n(?<humid2locationStr>.*)/s;
const {seedsStr, seed2soilStr, soil2fertStr, fert2waterStr, water2lightStr, light2tempStr, temp2humidStr, humid2locationStr} = inputRegex.exec(input).groups;

function parseMap(inputStr) {
    const lines = inputStr.split('\n');
    const regex = /^(?<destRangeStartStr>\d+) (?<sourceRangeStartStr>\d+) (?<rangeLenStr>\d+)$/;
    return lines.map(line => {
        const { destRangeStartStr, sourceRangeStartStr, rangeLenStr } = regex.exec(line).groups;
        return {
            sourceRangeStart: parseInt(sourceRangeStartStr),
            sourceRangeEnd: parseInt(sourceRangeStartStr) + parseInt(rangeLenStr) - 1,
            destRangeStart: parseInt(destRangeStartStr),
            destRangeEnd: parseInt(destRangeStartStr) + parseInt(rangeLenStr) - 1,
            source2Dest: parseInt(destRangeStartStr) - parseInt(sourceRangeStartStr)
        };
    })
}

const seed2soilMap = parseMap(seed2soilStr);
const soil2fertMap = parseMap(soil2fertStr);
const fert2waterMap = parseMap(fert2waterStr);
const water2lightMap = parseMap(water2lightStr);
const light2tempMap = parseMap(light2tempStr);
const temp2humidMap = parseMap(temp2humidStr);
const humid2locationMap = parseMap(humid2locationStr);

function getDestination(source, map) {
   for (let i = 0; i < map.length; i++) {
       if (source >= map[i].sourceRangeStart && source <= map[i].sourceRangeEnd) {
           return source + map[i].source2Dest;
       }
   }
   return source;
}

function getSource(dest, map) {
    if (dest === null) return null;
    for (let i = 0; i < map.length; i++) {
        if (dest >= map[i].destRangeStart && dest <= map[i].destRangeEnd) {
            return dest - map[i].source2Dest;
        }
    }
    return null;
}

function getLocation(seed) {
    const soil = getDestination(seed, seed2soilMap);
    const fert = getDestination(soil, soil2fertMap);
    const water = getDestination(fert, fert2waterMap);
    const light = getDestination(water, water2lightMap);
    const temp = getDestination(light, light2tempMap);
    const humid = getDestination(temp, temp2humidMap);
    return getDestination(humid, humid2locationMap);
}

time('Part 1', () => {
    const seeds = seedsStr.split(' ').map(seed => parseInt(seed));
    return Math.min(...seeds.map(getLocation));
});

function isInSeedRange(soil, seedRanges) {
    for (const seedRange of seedRanges) {
        if (soil >= seedRange.startRange && soil <= seedRange.endRange) {
            console.log(soil, seedRange)
            return true; 
        }
    }
    return false;
}
time('Part 2', () => {
    const seedRanges = [...seedsStr.matchAll(/(\d+ \d+)/g)].reduce((acc, seedMatch) => {
        const startRange = parseInt(seedMatch[1].split(' ')[0]);
        const rangeLen = parseInt(seedMatch[1].split(' ')[1]);
        acc.push({startRange, endRange: startRange + rangeLen});
        return acc;
    }, []);
    
    for (let i = 46521000; i <= 46522200; i+= 1) {
        const humid = getSource(i, humid2locationMap);
        const temp = getSource(humid, temp2humidMap);
        const light = getSource(temp, light2tempMap);
        const water = getSource(light, water2lightMap);
        const fert = getSource(water, fert2waterMap);
        const soil = getSource(fert, soil2fertMap);
        console.log(i, humid, temp, light, water, fert, soil, isInSeedRange(soil,seedRanges))
        if (isInSeedRange(soil, seedRanges)) return i;
    }
    return 'not found'
});
