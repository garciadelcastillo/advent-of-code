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
const input_filename = 'day17_input.txt'


// Load input
const __dirname =
  import.meta.dirname;
const input = fs.readFileSync(path.join(__dirname, input_filename), 'utf-8');
console.log(`Number of chars loaded: `, input.length);

const lines = input.split('\n').filter(line => line !== '')
console.log(`Number of lines loaded: `, lines.length);


// --- Day 17: No Such Thing as Too Much ---

// The elves bought too much eggnog again - 150 liters this time. To fit it all into your refrigerator, you'll need to move it into smaller containers. You take an inventory of the capacities of the available containers.

// For example, suppose you have containers of size 20, 15, 10, 5, and 5 liters. If you need to store 25 liters, there are four ways to do it:

//     15 and 10
//     20 and 5 (the first 5)
//     20 and 5 (the second 5)
//     15, 5, and 5

// Filling all containers entirely, how many different combinations of containers can exactly fit all 150 liters of eggnog?



// Parse input
const parseContainers = (line) => parseInt(line);

const containers = lines.map(parseContainers);
console.log("CONTAINERS:", containers);
console.log(containers.length, "total containers");
console.log();

const intToBinaryArray = (num, bits) => {
  let binArray = (num >>> 0)
    .toString(2)
    .padStart(bits, '0')
    .split('')
    .map(str => parseInt(str));
  // console.log(bin);
  return binArray;
}

const generateBinaryPermutations = (bits) => {
  const perms = [];
  const count = Math.pow(2, bits);
  for (let i = 0; i < count; i++) {
    perms.push(intToBinaryArray(i, bits));
  }
  return perms;  
}

const permutations = generateBinaryPermutations(containers.length);
// console.log(permutations);
console.log("Number of possible container permutations:", permutations.length);




const sumArray = arr => {
  // print(arr)
  return arr.reduce((acc, val) => acc + val, 0);
}

const multArray = arr => {
  return arr.reduce((acc, val) => acc * val, 1);
}

const multArrays = (arrA, arrB) => {
  const res = Array.from({
    length: arrA
  });
  for (let i = 0; i < arrA.length; i++) {
    res[i] = arrA[i] * arrB[i];
  }
  return res;
}

const targetValue = 150;
const validCombinations = [];
for (const perm of permutations) {
  if (sumArray(multArrays(perm, containers)) == targetValue) {
    validCombinations.push(perm);
  }
}
console.log("Valid combinations:", validCombinations);
console.log("Total valid combinations:", validCombinations.length);





// --- Part Two ---

// While playing with all the containers in the kitchen, another load of eggnog arrives! The shipping and receiving department is requesting as many containers as you can spare.

// Find the minimum number of containers that can exactly fit all 150 liters of eggnog. How many different ways can you fill that number of containers and still hold exactly 150 litres?

// In the example above, the minimum number of containers was two. There were three ways to use that many containers, and so the answer there would be 3.



// Find minimum amount of containers
let min = containers.length;
let contCount;
// for (const perm in validCombinations) {
validCombinations.forEach(perm => {
  contCount = sumArray(perm)
  if (contCount < min) min = contCount; 
})
console.log("Minimum number of containers required:", min);

// Find how many combos with these amount of containers
let minCombCount = 0;
validCombinations.forEach(perm => {
  contCount = sumArray(perm)
  if (contCount == min) minCombCount++; 
})
console.log(`Number of combinations with ${min} containers:`, minCombCount);

