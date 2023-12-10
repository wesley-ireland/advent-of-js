import { readInput } from "../utils/fileReader.mjs";
import { time } from "../utils/timer.mjs";

const lines = (await readInput()).split(/\r?\n/);

const handTypes = { fiveOfAKind: 7, fourOfAKind: 6, fullHouse: 5, threeOfAKind: 4, twoPair: 3, pair: 2, highCard: 1 };

const isFiveOfAKind = handMap => Object.values(handMap).includes(5);
const isFourOfAKind = handMap => Object.values(handMap).includes(4);
const isFullHouse = handMap => Object.values(handMap).includes(3) && Object.values(handMap).includes(2);
const isThreeOfAKind = handMap => Object.values(handMap).includes(3) && !Object.values(handMap).includes(2);
const isTwoPair = handMap => Object.values(handMap).filter(cardCount => cardCount === 2).length === 2;
const isPair = handMap => Object.values(handMap).filter(cardCount => cardCount === 2).length === 1;
const isHighCard = handMap => Object.values(handMap).filter(cardCount => cardCount === 1).length === 5;

function getCardCountMap(hand) {
    const handMap = { A:0, K:0, Q:0, J:0, T:0, 9:0, 8:0, 7:0, 6:0, 5:0, 4:0, 3:0, 2:0 };
    hand.split('').forEach(card => {
        handMap[card] += 1
    });
    return handMap;
}

function determineHandType(hand, part) {
    const handMap = getCardCountMap(hand);
    const numWild = handMap.J;
    if (isFiveOfAKind(handMap)) return handTypes.fiveOfAKind;
    if (isFourOfAKind(handMap)) {
        if (numWild > 0 && part === 2) return handTypes.fiveOfAKind;
        return handTypes.fourOfAKind;
    }
    if (isFullHouse(handMap)) {
        if (numWild > 0 && part === 2) return handTypes.fiveOfAKind;
        return handTypes.fullHouse;
    } 
    if (isThreeOfAKind(handMap)) {
        if (numWild === 3 && part === 2 && Object.values(handMap).includes(2)) return handTypes.fiveOfAKind
        if (numWild === 3 && part === 2) return handTypes.fourOfAKind
        if (numWild === 2 && part === 2) return handTypes.fiveOfAKind;
        if (numWild === 1 && part === 2) return handTypes.fourOfAKind;
        return handTypes.threeOfAKind; 
    } 
    if (isTwoPair(handMap)) {
        if (numWild === 2 && part === 2) return handTypes.fourOfAKind;
        if (numWild === 1 && part === 2) return handTypes.fullHouse;
        return handTypes.twoPair;
    }
    if (isPair(handMap)) {
        if (numWild > 0 && part === 2) return handTypes.threeOfAKind;
        return handTypes.pair;  
    } 
    if (isHighCard(handMap)) {
        if (numWild > 0 && part === 2) return handTypes.pair;
        return handTypes.highCard;
    }
    throw new Error(`Couldn't find hand type for hand: ${hand}`);
}

function tieBreaker(handA, handB, part) {
    const tieBreakerCardStrengths = part === 1 
        ? { A:13, K:12, Q:11, J:10, T:9, 9:8, 8:7, 7:6, 6:5, 5:4, 4:3, 3:2, 2:1 }
        : { A:13, K:12, Q:11, T:10, 9:9, 8:8, 7:7, 6:6, 5:5, 4:4, 3:3, 2:2, J:1 }

    const handACards = handA.split('');
    const handBCards = handB.split('');
    for (let i = 0; i < handACards.length; i++) {
        // if A is the better hand, sort A after B
        if (tieBreakerCardStrengths[handACards[i]] > tieBreakerCardStrengths[handBCards[i]]) return 1;
        if (tieBreakerCardStrengths[handACards[i]] < tieBreakerCardStrengths[handBCards[i]]) return -1;
    }
    throw new Error(`Couldn't resolve tie for hands: ${handA}, ${handB}`)
}

function sortByStrength(lineA, lineB, part) {
    const handAType = determineHandType(lineA.cards, part);
    const handBType = determineHandType(lineB.cards, part);
    // if A is the better hand, sort A after B
    if (handAType > handBType) return 1;
    if (handAType < handBType) return -1;
    return tieBreaker(lineA.cards, lineB.cards, part);
}

time('Part 1', () => {
    return lines
        .map(line => {
            const cards = line.split(' ')[0];
            const bid = line.split(' ')[1];
            return { cards, bid }
        })
        .sort((a, b) => sortByStrength(a, b, 1))
        .map((hand, i) => ({ ...hand, rank: i + 1 }))
        .reduce((acc, hand) => acc + hand.rank * hand.bid, 0);
});

time('Part 2', () => {
    return lines
        .map(line => {
            const cards = line.split(' ')[0];
            const bid = line.split(' ')[1];
            return { cards, bid }
        })
        .sort((a, b) => sortByStrength(a, b, 2))
        .map((hand, i) => ({ ...hand, rank: i + 1 }))
        .reduce((acc, hand) => acc + hand.rank * hand.bid, 0); 
});