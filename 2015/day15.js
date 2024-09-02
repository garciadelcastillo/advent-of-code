// https://adventofcode.com/2015

import {
  table
} from 'console';
import fs from 'fs';
import path, {
  parse
} from 'path';

const print = console.log;

// GLOBAL VARS
const input_filename = 'day15_input.txt'


// Load input
const __dirname =
  import.meta.dirname;
const input = fs.readFileSync(path.join(__dirname, input_filename), 'utf-8');
console.log(`Number of chars loaded: `, input.length);

const lines = input.split('\n').filter(line => line !== '')
console.log(`Number of lines loaded: `, lines.length);

// --- Day 15: Science for Hungry People ---

// Today, you set out on the task of perfecting your milk-dunking cookie recipe. All you have to do is find the right balance of ingredients.

// Your recipe leaves room for exactly 100 teaspoons of ingredients. You make a list of the remaining ingredients you could use to finish the recipe (your puzzle input) and their properties per teaspoon:

//     capacity (how well it helps the cookie absorb milk)
//     durability (how well it keeps the cookie intact when full of milk)
//     flavor (how tasty it makes the cookie)
//     texture (how it improves the feel of the cookie)
//     calories (how many calories it adds to the cookie)

// You can only measure ingredients in whole-teaspoon amounts accurately, and you have to be accurate so you can reproduce your results in the future. The total score of a cookie can be found by adding up each of the properties (negative totals become 0) and then multiplying together everything except calories.

// For instance, suppose you have these two ingredients:

// Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
// Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3

// Then, choosing to use 44 teaspoons of butterscotch and 56 teaspoons of cinnamon (because the amounts of each ingredient must add up to 100) would result in a cookie with the following properties:

//     A capacity of 44*-1 + 56*2 = 68
//     A durability of 44*-2 + 56*3 = 80
//     A flavor of 44*6 + 56*-2 = 152
//     A texture of 44*3 + 56*-1 = 76

// Multiplying these together (68 * 80 * 152 * 76, ignoring calories for now) results in a total score of 62842880, which happens to be the best score possible given these ingredients. If any properties had produced a negative total, it would have instead become zero, causing the whole score to multiply to zero.

// Given the ingredients in your kitchen and their properties, what is the total score of the highest-scoring cookie you can make?



// Parse input

const parseIngredient = (line) => {
  const name = line.split(":")[0];
  const props = line.split(":")[1]
    .trim()
    .split(",")
    .map(p => {
      return parseInt(p.trim().split(" ")[1]);
    });
  return {
    name,
    props
  }
}

let ingredients = lines.map(parseIngredient);
console.log("INGREDIENTS:", ingredients);
console.log();




/**
 * Adds all values in an array. 
 * @param {*} arr 
 * @returns 
 */
const sumArray = arr => {
  return arr.reduce((acc, val) => acc + val, 0);
}

const multArray = arr => {
  return arr.reduce((acc, val) => acc * val, 1);
}


/**
 * Computes all possible permutations of `propCount` values
 * adding up to exactly `total`. Zero values are allowed. 
 * For example, for 3 values to a total of 3:
 * [0,0,3]
 * [0,1,2]
 * [0,2,1]
 * [0,3,0]
 * [1,0,2]
 * [1,1,1]
 * [1,2,0]
 * [2,0,1]
 * [2,1,0]
 * [3,0,0]
 * @param {*} propCount 
 * @param {*} total 
 */
const computePermutations = (propCount, total) => {
  let perms = [];
  let current = Array.from({
    length: propCount - 1,
  }).fill(0);

  perms.push([...current, total]);

  while (current[0] < total) {  // stop when first item reaches 100
    // Increase last item
    current[propCount - 2]++;

    // If total is above limit, reset and carry over to the left
    while (sumArray(current) > total) {
      // Find last non-zero
      let j = -1; 
      for (let i = current.length - 1; i > 0; i--) {
        if (current[i] != 0) {
          j = i; 
          break;
        }
      }
      // Increase it
      current[j]++;

      // Re-check need to carry over
      if (sumArray(current) > total) {
        current[j] = 0;
        current[j - 1]++
      }
    }

    // Compute remainder
    const r = total - sumArray(current);

    // Push permutation adding to total
    const perm = [...current, r];
    // console.log(perm);
    perms.push(perm);
  }

  return perms;
}

// Compute all possible permutations of spoon quantities
const maxSpoons = 100; 
const maxProps = 4;
const permutations = computePermutations(maxProps, maxSpoons);
console.log("Number of possible ingredient permutations:", permutations.length);
console.log(permutations);


const computeScore = (ingredients, quantities) => {
  // console.log(ingredients);
  // console.log("quants:", quantities);
  const partials = [];

  let propCount = ingredients[0].props.length - 1;  // no calories yet
  for (let i = 0; i < propCount; i++) {
    let acc = 0;
    for (let j = 0; j < ingredients.length; j++) {
      acc += quantities[j] * ingredients[j].props[i];
    }
    acc = Math.max(acc, 0);
    partials.push(acc);
  }
  
  // console.log("partls:", partials);
  const score = multArray(partials);
  // console.log("score :", score);
  // console.log();
  return score; 
}

// Find the one with the highest score
let maxScore = 0;
let recipe = null;
permutations.forEach(quants => {
  const score = computeScore(ingredients, quants);
  // console.log(quants, " -> ", score);
  if (score > maxScore) {
    maxScore = score;
    recipe = quants;
  }
});
console.log("Max cookie score is:", maxScore);
console.log("Recipe is:");
recipe.forEach((quant, i) => {
  console.log(` ${ingredients[i].name}: ${quant} teaspoons`);
});
// console.log(recipe);

// [ 4, 46, 40, 10 ]  ->  1766400
// [ 4, 46, 50, 0 ]  ->  0
