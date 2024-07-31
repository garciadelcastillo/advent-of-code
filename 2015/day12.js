// https://adventofcode.com/2015

import fs from 'fs';
import path from 'path';

// GLOBAL VARS
const input_filename = 'day12_input.txt'


// // Load input
const __dirname = import.meta.dirname;
const input = fs.readFileSync(path.join(__dirname, input_filename), 'utf-8');
console.log(`Number of chars loaded: `, input.length);

// const lines = input.split('\n').filter(line => line !== '')
// console.log(`Number of lines loaded: `, lines.length);

const inputJSON = JSON.parse(input);
// console.log(inputJSON);





// --- Day 12: JSAbacusFramework.io ---

// Santa's Accounting-Elves need help balancing the books after a recent order. Unfortunately, their accounting software uses a peculiar storage format. That's where you come in.

// They have a JSON document which contains a variety of things: arrays ([1,2,3]), objects ({"a":1, "b":2}), numbers, and strings. Your first job is to simply find all of the numbers throughout the document and add them together.

// For example:

//     [1,2,3] and {"a":2,"b":4} both have a sum of 6.
//     [[[3]]] and {"a":{"b":4},"c":-1} both have a sum of 3.
//     {"a":[-1,1]} and [-1,{"a":1}] both have a sum of 0.
//     [] and {} both have a sum of 0.

// You will not encounter any strings containing numbers.

// What is the sum of all numbers in the document?


// https://stackoverflow.com/a/8511350/1934487
const isObject = thing => typeof thing === 'object' && !Array.isArray(thing) && thing !== null;
const isArray = Array.isArray;
const isNumber = thing => typeof thing === 'number';
const isRealNumber = thing => typeof thing === 'number' && isFinite(thing);  // https://stackoverflow.com/a/20169362/1934487
const isString = thing => typeof thing === 'string';

// const asdas = {};
// console.log(isObject(asdas));
// console.log(isObject(inputJSON));
// console.log(isArray(inputJSON));
// console.log();

// console.log(isNumber(0));
// console.log(isNumber(10));
// console.log(isNumber(-1.2));
// console.log(isNumber(NaN));
// console.log(isNumber(Infinity));
// console.log(isNumber(-Infinity));
// console.log();

// console.log(isRealNumber(0));
// console.log(isRealNumber(10));
// console.log(isRealNumber(-1.2));
// console.log(isRealNumber(NaN));
// console.log(isRealNumber(Infinity));
// console.log(isRealNumber(-Infinity));
// console.log();


const dissectArray = arr => {
  arr.forEach(element => {
    if (isArray(element) || isObject(element)) {
      pile.push(element);
    } else if (isRealNumber(element)) {
      total += element 
    } else if (isString(element)) {
      // Do nothing 
    } else {
      console.log(`ARR Don't know what to do with:`, element);
    }
  });
}

const dissectObject = obj => {
  for (const [key, value] of Object.entries(obj)) {
    // console.log(`${key}: ${value}`);
    if (isArray(value) || isObject(value)) {
      pile.push(value);
    } else if (isRealNumber(value)) {
      total += value 
    } else if (isString(value)) {
      // Do nothing 
    } else {
      console.log(`OBJ Don't know what to do with:`, value);
    }
  }
}


let its = 0;
let total = 0;
let pile = [inputJSON];
while (pile.length > 0 && its++ < 10000) {
  const last = pile.pop();
  if (isArray(last)) dissectArray(last);
  else if (isObject(last)) dissectObject(last);
}

console.log(`Total:`, total);
console.log(`Elements left in pile:`, pile.length);
console.log(`Computed in iterations:`, its);
console.log();


// --- Part Two ---

// Uh oh - the Accounting-Elves have realized that they double-counted everything red.

// Ignore any object (and all of its children) which has any property with the value "red". Do this only for objects ({...}), not arrays ([...]).

//     [1,2,3] still has a sum of 6.
//     [1,{"c":"red","b":2},3] now has a sum of 4, because the middle object is ignored.
//     {"d":"red","e":[1,2,3,4],"f":5} now has a sum of 0, because the entire structure is ignored.
//     [1,"red",5] has a sum of 6, because "red" in an array has no effect.

const color = 'red';

const containsValue = (obj, val) => {
  for (const [key, value] of Object.entries(obj)) {
    // console.log(`${key}: ${value}`);
    if (value == val) return true;
  }
  return false;
}


its = 0;
total = 0;
pile = [inputJSON];
while (pile.length > 0 && its++ < 10000) {
  const last = pile.pop();
  if (isArray(last)) 
    dissectArray(last);
  else if (isObject(last) && !containsValue(last, color)) 
    dissectObject(last);
}

console.log(`Total:`, total);
console.log(`Elements left in pile:`, pile.length);
console.log(`Computed in iterations:`, its);
console.log();

