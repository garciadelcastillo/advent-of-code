// https://adventofcode.com/2015

import fs from 'fs';
import path, {
  parse
} from 'path';

const print = console.log;

// // GLOBAL VARS
// const input_filename = 'day19_input.txt'


// // Load input
// const __dirname =
//   import.meta.dirname;
// const input = fs.readFileSync(path.join(__dirname, input_filename), 'utf-8');
// console.log(`Number of chars loaded: `, input.length);

// const lines = input.split('\n').filter(line => line !== '')
// console.log(`Number of lines loaded: `, lines.length);



// --- Day 20: Infinite Elves and Infinite Houses ---

// To keep the Elves busy, Santa has them deliver some presents by hand, door-to-door. He sends them down a street with infinite houses numbered sequentially: 1, 2, 3, 4, 5, and so on.

// Each Elf is assigned a number, too, and delivers presents to houses based on that number:

//     The first Elf (number 1) delivers presents to every house: 1, 2, 3, 4, 5, ....
//     The second Elf (number 2) delivers presents to every second house: 2, 4, 6, 8, 10, ....
//     Elf number 3 delivers presents to every third house: 3, 6, 9, 12, 15, ....

// There are infinitely many Elves, numbered starting with 1. Each Elf delivers presents equal to ten times his or her number at each house.

// So, the first nine houses on the street end up like this:

// House 1 got 10 presents.
// House 2 got 30 presents.
// House 3 got 40 presents.
// House 4 got 70 presents.
// House 5 got 60 presents.
// House 6 got 120 presents.
// House 7 got 80 presents.
// House 8 got 150 presents.
// House 9 got 130 presents.

// The first house gets 10 presents: it is visited only by Elf 1, which delivers 1 * 10 = 10 presents. The fourth house gets 70 presents, because it is visited by Elves 1, 2, and 4, for a total of 10 + 20 + 40 = 70 presents.

// What is the lowest house number of the house to get at least as many presents as the number in your puzzle input?

// Your puzzle input is 34000000.


const target_presents = 34000000;

let houseNum = 0;
let presents = 0;

// // NAIVE BRUTE FORCE: check all houses one at a time 
// const computePresents = houseNum => {
//   let total = 0;
//   for (let elf = 1; elf <= houseNum; elf++) {
//     if (houseNum % elf === 0) total += 10 * elf;
//   }
//   return total;
// }

// while (presents < target_presents) {
//   houseNum++;
//   presents = computePresents(houseNum);
//   if (houseNum % 1000 === 0) console.log(houseNum, presents);
// }
// console.log(`First house num with presents > ${target_presents}:`, houseNum);
// console.log("Present count:", presents);



// Took forever! yielded:
// First house num with presents > 34000000: 786240
// Present count: 34137600\



// Alternative approach: https://www.reddit.com/r/adventofcode/comments/3xjpp2/day_20_solutions/
// Precompute all values in an array, avoiding division checks
let houses = Array.from({length: target_presents}).fill(0);
for (let i = 1; i < houses.length; i++) 
{
  const inc = 10 * i;
  for (let j = i; j < houses.length; j += i) {
    houses[j] += inc; 
  }
}
console.log(`Done precomputing presents for ${houses.length} houses`);

// Find the first value over `target_presents`
for (let i = 1; i < houses.length; i++) {
  if (houses[i] > target_presents) {
    houseNum = i;
    presents = houses[i];
    break;
  }
}
console.log(`First house num with presents > ${target_presents}:`, houseNum);
console.log("Present count:", presents);
console.log();
// took a few seconds





// --- Part Two ---

// The Elves decide they don't want to visit an infinite number of houses. Instead, each Elf will stop after delivering presents to 50 houses. To make up for it, they decide to deliver presents equal to eleven times their number at each house.

// With these changes, what is the new lowest house number of the house to get at least as many presents as the number in your puzzle input?

// Your puzzle input is still 34000000.

const max_visits = 50;

const houses_bis = Array.from({length: target_presents}).fill(0);
for (let i = 1; i < houses_bis.length; i++) 
{
  const inc = 11 * i;

  // let id;
  // for (let j = 0; j < max_visits; j++) {
  //   id = i * (j + 1);
  //   houses_bis[id] += inc;
  // }

  let visits = 0;
  for (let j = i; j < houses_bis.length; j += i) {
    houses_bis[j] += inc;
    visits++;
    if (visits >= max_visits) break;     
  }
}
console.log(`Done precomputing presents for ${houses_bis.length} houses`);

for (let i = 1; i < houses_bis.length; i++) {
  if (houses_bis[i] > target_presents) {
    houseNum = i;
    presents = houses_bis[i];
    break;
  }
}
console.log(`First house num with presents > ${target_presents}:`, houseNum);
console.log("Present count:", presents);
// took a few seconds
