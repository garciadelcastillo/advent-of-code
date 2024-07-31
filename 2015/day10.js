// https://adventofcode.com/2015

import fs from 'fs';
import path from 'path';

// // GLOBAL VARS
// const input_filename = 'day9_input.txt'


// // Load input
const __dirname = import.meta.dirname;
// const input = fs.readFileSync(path.join(__dirname, input_filename), 'utf-8');
// console.log(`Number of chars loaded: `, input.length);

// const lines = input.split('\n').filter(line => line !== '')
// console.log(`Number of lines loaded: `, lines.length);





// --- Day 10: Elves Look, Elves Say ---

// Today, the Elves are playing a game called look-and-say. They take turns making sequences by reading aloud the previous sequence and using that reading as the next sequence. For example, 211 is read as "one two, two ones", which becomes 1221 (1 2, 2 1s).

// Look-and-say sequences are generated iteratively, using the previous value as input for the next step. For each step, take the previous value, and replace each run of digits (like 111) with the number of digits (3) followed by the digit itself (1).

// For example:

//     1 becomes 11 (1 copy of digit 1).
//     11 becomes 21 (2 copies of digit 1).
//     21 becomes 1211 (one 2 followed by one 1).
//     1211 becomes 111221 (one 1, one 2, and two 1s).
//     111221 becomes 312211 (three 1s, two 2s, and one 1).

// Starting with the digits in your puzzle input, apply this process 40 times. What is the length of the result?

// Your puzzle input is 3113322113.


const start = '3113322113';

const lookAndSay = seq => {
  let las = '';
  let char = seq[0];
  let count = 1;
  for (let i = 1; i < seq.length; i++) {
    if (seq[i] === char) {
      count++;
    } else {
      las += `${count}${char}`;
      char = seq[i];
      count = 1;
    }
    // console.log(i, char, count, las);
  }
  las += `${count}${char}`;
  return las;
}

// console.log(lookAndSay('111221'));

let its = 40;
let total = start;
for (let i = 0; i < its; i++) {
  total = lookAndSay(total);
}
console.log(`The length of the result after ${its} iterations is:`, total.length);
// fs.writeFileSync(path.join(__dirname, `day10_output_its${its}.txt`), total);








// --- Part Two ---

// Neat, right? You might also enjoy hearing John Conway talking about this sequence (that's Conway of Conway's Game of Life fame).

// Now, starting again with the digits in your puzzle input, apply this process 50 times. What is the length of the new result?

its = 50;
total = start;
for (let i = 0; i < its; i++) {
  total = lookAndSay(total);
}
console.log(`The length of the result after ${its} iterations is:`, total.length);
// fs.writeFileSync(path.join(__dirname, `day10_output_its${its}.txt`), total);
