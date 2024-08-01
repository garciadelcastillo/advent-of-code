// https://adventofcode.com/2015

import { table } from 'console';
import fs from 'fs';
import path, { parse } from 'path';

// GLOBAL VARS
const input_filename = 'day13_input.txt'


// Load input
const __dirname =
  import.meta.dirname;
const input = fs.readFileSync(path.join(__dirname, input_filename), 'utf-8');
console.log(`Number of chars loaded: `, input.length);

const lines = input.split('\n').filter(line => line !== '')
console.log(`Number of lines loaded: `, lines.length);




// --- Day 13: Knights of the Dinner Table ---

// In years past, the holiday feast with your family hasn't gone so well. Not everyone gets along! This year, you resolve, will be different. You're going to find the optimal seating arrangement and avoid all those awkward conversations.

// You start by writing up a list of everyone invited and the amount their happiness would increase or decrease if they were to find themselves sitting next to each other person. You have a circular table that will be just big enough to fit everyone comfortably, and so each person will have exactly two neighbors.

// For example, suppose you have only four attendees planned, and you calculate their potential happiness as follows:

// Alice would gain 54 happiness units by sitting next to Bob.
// Alice would lose 79 happiness units by sitting next to Carol.
// Alice would lose 2 happiness units by sitting next to David.
// Bob would gain 83 happiness units by sitting next to Alice.
// Bob would lose 7 happiness units by sitting next to Carol.
// Bob would lose 63 happiness units by sitting next to David.
// Carol would lose 62 happiness units by sitting next to Alice.
// Carol would gain 60 happiness units by sitting next to Bob.
// Carol would gain 55 happiness units by sitting next to David.
// David would gain 46 happiness units by sitting next to Alice.
// David would lose 7 happiness units by sitting next to Bob.
// David would gain 41 happiness units by sitting next to Carol.

// Then, if you seat Alice next to David, Alice would lose 2 happiness units (because David talks so much), but David would gain 46 happiness units (because Alice is such a good listener), for a total change of 44.

// If you continue around the table, you could then seat Bob next to Alice (Bob gains 83, Alice gains 54). Finally, seat Carol, who sits next to Bob (Carol gains 60, Bob loses 7) and David (Carol gains 55, David gains 41). The arrangement looks like this:

//      +41 +46
// +55   David    -2
// Carol       Alice
// +60    Bob    +54
//      -7  +83

// After trying every other seating arrangement in this hypothetical scenario, you find that this one is the most optimal, with a total change in happiness of 330.

// What is the total change in happiness for the optimal seating arrangement of the actual guest list?


const parseHappiness = str => {
  // remove last period
  str = str.slice(0, str.length - 1);
  const parts = str.split(' ');
  return {
    from: parts[0],
    to: parts[10], 
    happiness: parseFloat(parts[3]) * (parts[2] === 'gain' ? 1 : -1)
  }
}

let connections = lines.map(parseHappiness);
// console.log(`CONNECTIONS: `, connections);

let people = Array.from(connections.reduce((acc, val) => {
  acc.add(val.from);
  acc.add(val.to);
  return acc;
}, new Set()));
// console.log(`PEOPLE: `, people);

let happiness = {};
people.forEach(person => {
  happiness[person] = people.reduce((acc, val) => {
    const obj = { ...acc }
    obj[val] = 0;
    return obj;
  }, {});
})

connections.forEach(conn => {
  happiness[conn['from']][conn['to']] = conn['happiness'];
})
// console.log(`HAPPINESS:`,happiness);


const permuteRecursive = (out, sequence, left) => {
  if (left.length > 0) {
    for (let i = 0; i < left.length; i++) {
      permuteRecursive(
        out, 
        [...sequence, left[i]],
        left.toSpliced(i, 1)
      );
    }
  } else {
    out.push(sequence);
  }
}


let seatings = []; 
permuteRecursive(seatings, [], people);
// console.log(tableArrangements);

const computeHappiness = (seating) => {
  let totalHappiness = 0;
  let len = seating.length;
  for (let i = 0; i < len; i++) {
    totalHappiness += happiness[seating[i]][seating[(i+1) % len]];
    totalHappiness += happiness[seating[(i+1) % len]][seating[i]];
  }
  return {
    seating, 
    totalHappiness
  }
}

seatings = seatings.map(computeHappiness);
// console.log(seatings);

let happiest = seatings.reduce((acc,val) => 
  val.totalHappiness > acc.totalHappiness ? val : acc, seatings[0]);
console.log(`The happiest arrangement is:`, happiest);

let saddest = seatings.reduce((acc,val) => 
  val.totalHappiness < acc.totalHappiness ? val : acc, seatings[0]);
console.log(`The saddest arrangement is:`, saddest);
console.log();

// --- Part Two ---

// In all the commotion, you realize that you forgot to seat yourself. At this point, you're pretty apathetic toward the whole thing, and your happiness wouldn't really go up or down regardless of who you sit next to. You assume everyone else would be just as ambivalent about sitting next to you, too.

// So, add yourself to the list, and give all happiness relationships that involve you a score of 0.

// What is the total change in happiness for the optimal seating arrangement that actually includes yourself?


const me = 'ApatheticSanta';

happiness[me] = {};
people.push(me);
people.forEach(person => {
  happiness[person][me] = 0;
  happiness[me][person] = 0;
});
// console.log(happiness);

seatings = []; 
permuteRecursive(seatings, [], people);
// console.log(seatings);

seatings = seatings.map(computeHappiness);
// console.log(seatings);

let newHappiest = seatings.reduce((acc,val) => 
  val.totalHappiness > acc.totalHappiness ? val : acc, seatings[0]);
console.log(`The happiest arrangement including ${me} is:`, newHappiest);
