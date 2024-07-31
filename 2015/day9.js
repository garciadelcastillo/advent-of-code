// https://adventofcode.com/2015

import fs from 'fs';
import path, { parse } from 'path';

// GLOBAL VARS
const input_filename = 'day9_input.txt'


// Load input
const __dirname =
  import.meta.dirname;
const input = fs.readFileSync(path.join(__dirname, input_filename), 'utf-8');
console.log(`Number of chars loaded: `, input.length);

const lines = input.split('\n').filter(line => line !== '')
console.log(`Number of lines loaded: `, lines.length);




// --- Day 9: All in a Single Night ---

// Every year, Santa manages to deliver all of his presents in a single night.

// This year, however, he has some new locations to visit; his elves have provided him the distances between every pair of locations. He can start and end at any two (different) locations he wants, but he must visit each location exactly once. What is the shortest distance he can travel to achieve this?

// For example, given the following distances:

// London to Dublin = 464
// London to Belfast = 518
// Dublin to Belfast = 141

// The possible routes are therefore:

// Dublin -> London -> Belfast = 982
// London -> Dublin -> Belfast = 605
// London -> Belfast -> Dublin = 659
// Dublin -> Belfast -> London = 659
// Belfast -> Dublin -> London = 605
// Belfast -> London -> Dublin = 982

// The shortest of these is London -> Dublin -> Belfast = 605, and so the answer is 605 in this example.

// What is the distance of the shortest route?



// JLX
// Looks like a fully connected graph, so this boils down
// to creating a bunch of crossed tables with distances, 
// with the trickiest part perhaps computing all possible
// permutations of trips? 

// Permutations:
// - Can start/end anywhere, order may matter
// - No repeated nodes
// Since it is few elements, perhaps a recursive 
// algo will do?



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

// let perm = [];
// const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
// permuteRecursive(perm, [], letters);
// console.log(perm);
// console.log(`Permutation count:`, perm.length);


const parseConnection = str => {
  const parts = str.split(' ');
  return {
    start: parts[0],
    end: parts[2], 
    dist: parseFloat(parts[4])
  }
}


let connections = lines.map(parseConnection);
console.log(`CONNECTIONS: `, connections);

let locations = Array.from(connections.reduce((acc, val) => {
    acc.add(val.start);
    acc.add(val.end);
    return acc;
  }, new Set()));
console.log(`LOCATIONS:`, locations);

let distances = {};
locations.forEach(loc => {
  distances[loc] = locations.reduce((acc, val) => {
    const obj = { ...acc }
    obj[val] = 0;
    return obj;
  }, {});
})

connections.forEach(conn => {
  distances[conn['start']][conn['end']] = conn['dist'];
  distances[conn['end']][conn['start']] = conn['dist'];
})
console.log(`DISTANCES:`,distances);


let trips = [];
permuteRecursive(trips, [], locations);
// console.log(trips);

const computeDistance = (trip) => {
  let totalDist = 0;
  for (let i = 0; i < trip.length - 1; i++) {
    totalDist += distances[trip[i]][trip[i+1]];
  }
  return {
    trip, 
    totalDist
  }
}

trips = trips.map(computeDistance);
// console.log(trips);

const shortest = trips.reduce((acc, val) => 
  val.totalDist < acc.totalDist ? val : acc, trips[0]);

console.log();
console.log(`The shortest trip is:`, shortest.trip);
console.log(`It's total distance is:`, shortest.totalDist);




// --- Part Two ---

// The next year, just to show off, Santa decides to take the route with the longest distance instead.

// He can still start and end at any two (different) locations he wants, and he still must visit each location exactly once.

// For example, given the distances above, the longest route would be 982 via (for example) Dublin -> London -> Belfast.

// What is the distance of the longest route?

const longest = trips.reduce((acc, val) => 
  val.totalDist > acc.totalDist ? val : acc, trips[0]);

console.log();
console.log(`The longest trip is:`, longest.trip);
console.log(`It's total distance is:`, longest.totalDist);