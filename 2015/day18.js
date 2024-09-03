// https://adventofcode.com/2015

import fs from 'fs';
import path, {
  parse
} from 'path';

const print = console.log;

// GLOBAL VARS
const input_filename = 'day18_input.txt'
// const input_filename = 'day18_test.txt'


// Load input
const __dirname =
  import.meta.dirname;
const input = fs.readFileSync(path.join(__dirname, input_filename), 'utf-8');
console.log(`Number of chars loaded: `, input.length);

const lines = input.split('\n').filter(line => line !== '')
console.log(`Number of lines loaded: `, lines.length);


// --- Day 18: Like a GIF For Your Yard ---

// After the million lights incident, the fire code has gotten stricter: now, at most ten thousand lights are allowed. You arrange them in a 100x100 grid.

// Never one to let you down, Santa again mails you instructions on the ideal lighting configuration. With so few lights, he says, you'll have to resort to animation.

// Start by setting your lights to the included initial configuration (your puzzle input). A # means "on", and a . means "off".

// Then, animate your grid in steps, where each step decides the next configuration based on the current one. Each light's next state (either on or off) depends on its current state and the current states of the eight lights adjacent to it (including diagonals). Lights on the edge of the grid might have fewer than eight neighbors; the missing ones always count as "off".

// For example, in a simplified 6x6 grid, the light marked A has the neighbors numbered 1 through 8, and the light marked B, which is on an edge, only has the neighbors marked 1 through 5:

// 1B5...
// 234...
// ......
// ..123.
// ..8A4.
// ..765.

// The state a light should have next is based on its current state (on or off) plus the number of neighbors that are on:

//     A light which is on stays on when 2 or 3 neighbors are on, and turns off otherwise.
//     A light which is off turns on if exactly 3 neighbors are on, and stays off otherwise.

// All of the lights update simultaneously; they all consider the same current state before moving to the next.

// Here's a few steps from an example configuration of another 6x6 grid:

// Initial state:
// .#.#.#
// ...##.
// #....#
// ..#...
// #.#..#
// ####..

// After 1 step:
// ..##..
// ..##.#
// ...##.
// ......
// #.....
// #.##..

// After 2 steps:
// ..###.
// ......
// ..###.
// ......
// .#....
// .#....

// After 3 steps:
// ...#..
// ......
// ...#..
// ..##..
// ......
// ......

// After 4 steps:
// ......
// ......
// ..##..
// ..##..
// ......
// ......

// After 4 steps, this example has four lights on.

// In your grid of 100x100 lights, given your initial configuration, how many lights are on after 100 steps?

// JLX: so basically, Conway's Game of Life!



// Parse input
const parseLightRow = (line) => {
  const lights = Array.from({
    length: line.length
  });

  for (let i = 0; i < line.length; i++) {
    lights[i] = line[i] === '#';
  }

  return lights;
}

const lightGrid = lines.map(parseLightRow);
// console.log(lightGrid);
// console.log(lightGrid[0]);
const rows = lightGrid.length;
const cols = lightGrid[0].length;
console.log(`Parsed grid of ${rows}x${cols} lights`);
console.log();



const neighborCount = (grid, x, y) => {
  let c = 0;
  if (grid[y - 1] != undefined) {
    c += grid[y - 1][x - 1] ? 1 : 0;
    c += grid[y - 1][x    ] ? 1 : 0;
    c += grid[y - 1][x + 1] ? 1 : 0;
  }

  c += grid[y    ][x - 1] ? 1 : 0;
  c += grid[y    ][x + 1] ? 1 : 0;

  if (grid[y + 1] != undefined) {
    c += grid[y + 1][x - 1] ? 1 : 0;
    c += grid[y + 1][x    ] ? 1 : 0;
    c += grid[y + 1][x + 1] ? 1 : 0;
  }

  return c; 
}

const cycleGOL = (grid, lockCornersOn = false) => {
  const rows = grid.length;
  const cols = grid[0].length;

  const newGrid = [];
  let cell, ns;
  for (let y = 0; y < rows; y++) {
    const newRow = Array.from({length:cols}).fill(false);
    for (let x = 0; x < cols; x++) {
      cell = grid[y][x];
      ns = neighborCount(grid, x, y);
      
      if (cell) {
        // Stay alive
        if (ns == 2 || ns == 3) {
          newRow[x] = true;
        }
      } else {
        // Come to life? 
        if (ns == 3) {
          newRow[x] = true;
        }
      }
    }
    if (lockCornersOn) {
      if (y == 0 || y == rows - 1) {
        newRow[0] = true;
        newRow[cols - 1] = true;
      }
    }
    newGrid.push(newRow)
  }
  return newGrid;
}


let cycleCount = 100;
let gridState = lightGrid;
for (let i = 0; i < cycleCount; i++) {
  gridState = cycleGOL(gridState);
}

let lightOnCount = 0;
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    if (gridState[y][x]) lightOnCount++;
  }
}

console.log(`Number of lights after ${cycleCount} iterations: `, lightOnCount);

const gridToChars = (grid, on, off) => {
  const rows = grid.length;
  const cols = grid[0].length;
  let str = '';

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      str += grid[y][x] ? on : off
    }
    str += '\n'
  }

  return str;
}
fs.writeFileSync('day18_final_state_i.txt', gridToChars(gridState, '#', '.'))
console.log();




// --- Part Two ---

// You flip the instructions over; Santa goes on to point out that this is all just an implementation of Conway's Game of Life. At least, it was, until you notice that something's wrong with the grid of lights you bought: four lights, one in each corner, are stuck on and can't be turned off. The example above will actually run like this:

// Initial state:
// ##.#.#
// ...##.
// #....#
// ..#...
// #.#..#
// ####.#

// After 1 step:
// #.##.#
// ####.#
// ...##.
// ......
// #...#.
// #.####

// After 2 steps:
// #..#.#
// #....#
// .#.##.
// ...##.
// .#..##
// ##.###

// After 3 steps:
// #...##
// ####.#
// ..##.#
// ......
// ##....
// ####.#

// After 4 steps:
// #.####
// #....#
// ...#..
// .##...
// #.....
// #.#..#

// After 5 steps:
// ##.###
// .##..#
// .##...
// .##...
// #.#...
// ##...#

// After 5 steps, this example now has 17 lights on.

// In your grid of 100x100 lights, given your initial configuration, but with the four corners always in the on state, how many lights are on after 100 steps?


gridState = lightGrid;

// Turn corners on in initial configuration
gridState[0][0] = true;
gridState[0][cols - 1] = true;
gridState[rows - 1][cols - 1] = true;
gridState[rows - 1][0] = true;

for (let i = 0; i < cycleCount; i++) {
  gridState = cycleGOL(gridState, true);
}

lightOnCount = 0;
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    if (gridState[y][x]) lightOnCount++;
  }
}

console.log(`Number of lights after ${cycleCount} iterations (with locked on corners): `, lightOnCount);

fs.writeFileSync('day18_final_state_ii.txt', gridToChars(gridState, '#', '.'))
console.log();