// https://adventofcode.com/2015

import { match } from 'assert';
import {
  table
} from 'console';
import fs from 'fs';
import path, {
  parse
} from 'path';

const print = console.log;

// GLOBAL VARS
const input_filename = 'day16_input.txt'


// Load input
const __dirname =
  import.meta.dirname;
const input = fs.readFileSync(path.join(__dirname, input_filename), 'utf-8');
console.log(`Number of chars loaded: `, input.length);

const lines = input.split('\n').filter(line => line !== '')
console.log(`Number of lines loaded: `, lines.length);



// --- Day 16: Aunt Sue ---

// Your Aunt Sue has given you a wonderful gift, and you'd like to send her a thank you card. However, there's a small problem: she signed it "From, Aunt Sue".

// You have 500 Aunts named "Sue".

// So, to avoid sending the card to the wrong person, you need to figure out which Aunt Sue (which you conveniently number 1 to 500, for sanity) gave you the gift. You open the present and, as luck would have it, good ol' Aunt Sue got you a My First Crime Scene Analysis Machine! Just what you wanted. Or needed, as the case may be.

// The My First Crime Scene Analysis Machine (MFCSAM for short) can detect a few specific compounds in a given sample, as well as how many distinct kinds of those compounds there are. According to the instructions, these are what the MFCSAM can detect:

//     children, by human DNA age analysis.
//     cats. It doesn't differentiate individual breeds.
//     Several seemingly random breeds of dog: samoyeds, pomeranians, akitas, and vizslas.
//     goldfish. No other kinds of fish.
//     trees, all in one group.
//     cars, presumably by exhaust or gasoline or something.
//     perfumes, which is handy, since many of your Aunts Sue wear a few kinds.

// In fact, many of your Aunts Sue have many of these. You put the wrapping from the gift into the MFCSAM. It beeps inquisitively at you a few times and then prints out a message on ticker tape:

// children: 3
// cats: 7
// samoyeds: 2
// pomeranians: 3
// akitas: 0
// vizslas: 0
// goldfish: 5
// trees: 3
// cars: 2
// perfumes: 1

// You make a list of the things you can remember about each Aunt Sue. Things missing from your list aren't zero - you simply don't remember the value.

// What is the number of the Sue that got you the gift?




// Parse input
const parseAunt = (line) => {
  const i = line.indexOf(":");
  const name = line.slice(0, i);
  const id = parseInt(name.split(" ")[1]);

  let stuff = line
    .slice(i + 2)
    .split(",")
    .map(elem => {
      const kv = elem.split(":");
      const v = parseInt(kv[1].trim());
      return {
        name: kv[0].trim(),
        count: v
      }
    })
    // ERROR
    // .reduce((acc, val) => acc['name'] = 'foo', {});
    
    // THIS ONE WORKS
    // .reduce((acc, val) => {
    //   const obj = { ...acc }
    //   obj[val['name']] = val['count'];
    //   return obj;
    // }, {});

    // https://www.amitmerchant.com/reduce-array-of-objects-to-an-object-in-javascript/
    // SAME THING THAN THE SPREAD OPERATOR?? 
    .reduce((acc, val) => Object.assign(acc, {
      [val['name']]: val['count']
    }), {})
  // console.log(stuff);

  return {
    id,
    stuff
  }
}


const aunts = lines.map(parseAunt);
console.log("AUNTS:", aunts);
console.log();

const things = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1
}
console.log("THINGS:", things);
console.log();


/**
 * Returns true if all properties of `subset` object are
 * present in `original`, and their values match. 
 * @param {*} subset 
 * @param {*} original 
 */
const isSubsetOfObject = (subset, original) => {
  for (const prop in subset) {
    // Has prop?
    if (!Object.hasOwn(original, prop)) return false;
    
    // Value match?
    if (original[prop] !== subset[prop]) return false;
  }

  return true;
}


let possibleSues = [];
for (const aunt of aunts) {
  if (isSubsetOfObject(aunt.stuff, things)) possibleSues.push(aunt);
}
console.log("Possible Aunt Sues:", possibleSues);
if (possibleSues.length === 1) {
  console.log(`Aunt Sue #${possibleSues[0].id} sent the gift!! ❤`);
}
console.log();



// --- Part Two ---

// As you're about to send the thank you note, something in the MFCSAM's instructions catches your eye. Apparently, it has an outdated retroencabulator, and so the output from the machine isn't exact values - some of them indicate ranges.

// In particular, the cats and trees readings indicates that there are greater than that many (due to the unpredictable nuclear decay of cat dander and tree pollen), while the pomeranians and goldfish readings indicate that there are fewer than that many (due to the modial interaction of magnetoreluctance).

// What is the number of the real Aunt Sue?

const greaterThan = [
  'cats',
  'trees'
];
const fewerThan = [
  'pomeranians',
  'goldfish'
];

const matchStuff = (subset, original) => {
  for (const prop in subset) {
    // Has prop?
    if (!Object.hasOwn(original, prop)) return false;
    
    // Value match?
    let comparison = 0;
    if (greaterThan.findIndex(elem => elem == prop) != -1) comparison = 1;
    if (fewerThan.findIndex(elem => elem == prop) != -1) comparison = 2;
      
    switch (comparison) {
      case 1: 
        if (original[prop] >= subset[prop]) return false;
        break;
      case 2: 
        if (original[prop] <= subset[prop]) return false;
        break;
      default:
        if (original[prop] != subset[prop]) return false;
        break;
    }
  }

  return true;
}

possibleSues = [];
for (const aunt of aunts) {
  const positiveMatch = matchStuff(aunt.stuff, things);
  if (positiveMatch) possibleSues.push(aunt);
}
console.log("Possible Aunt Sues with new algorithm:", possibleSues);
if (possibleSues.length === 1) {
  console.log(`Aunt Sue #${possibleSues[0].id} sent the gift!! ❤`);
}

