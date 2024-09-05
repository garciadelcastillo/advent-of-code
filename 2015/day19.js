// https://adventofcode.com/2015

import fs from 'fs';
import path, {
  parse
} from 'path';

const print = console.log;

// GLOBAL VARS
const input_filename = 'day19_input.txt'


// Load input
const __dirname =
  import.meta.dirname;
const input = fs.readFileSync(path.join(__dirname, input_filename), 'utf-8');
console.log(`Number of chars loaded: `, input.length);

const lines = input.split('\n').filter(line => line !== '')
console.log(`Number of lines loaded: `, lines.length);



// --- Day 19: Medicine for Rudolph ---

// Rudolph the Red-Nosed Reindeer is sick! His nose isn't shining very brightly, and he needs medicine.

// Red-Nosed Reindeer biology isn't similar to regular reindeer biology; Rudolph is going to need custom-made medicine. Unfortunately, Red-Nosed Reindeer chemistry isn't similar to regular reindeer chemistry, either.

// The North Pole is equipped with a Red-Nosed Reindeer nuclear fusion/fission plant, capable of constructing any Red-Nosed Reindeer molecule you need. It works by starting with some input molecule and then doing a series of replacements, one per step, until it has the right molecule.

// However, the machine has to be calibrated before it can be used. Calibration involves determining the number of molecules that can be generated in one step from a given starting point.

// For example, imagine a simpler machine that supports only the following replacements:

// H => HO
// H => OH
// O => HH

// Given the replacements above and starting with HOH, the following molecules could be generated:

//     HOOH (via H => HO on the first H).
//     HOHO (via H => HO on the second H).
//     OHOH (via H => OH on the first H).
//     HOOH (via H => OH on the second H).
//     HHHH (via O => HH).

// So, in the example above, there are 4 distinct molecules (not five, because HOOH appears twice) after one replacement from HOH. Santa's favorite molecule, HOHOHO, can become 7 distinct molecules (over nine replacements: six from H, and three from O).

// The machine replaces without regard for the surrounding characters. For example, given the string H2O, the transition H => OO would result in OO2O.

// Your puzzle input describes all of the possible replacements and, at the bottom, the medicine molecule for which you need to calibrate the machine. How many distinct molecules can be created after all the different ways you can do one replacement on the medicine molecule?



// Parse input
const base_molecule = lines.pop();
console.log();
console.log("BASE MOLECULE:", base_molecule);
console.log();

const parseReplacements = (lines) => {
  const reps = {};

  for (const line of lines) {
    const parts = line.split(' => ');
    if (reps[parts[0]] == undefined) reps[parts[0]] = [];
    reps[parts[0]].push(parts[1])
  }

  return reps;
}

const replacements = parseReplacements(lines);
console.log("REPLACEMENT MOLECULES:", replacements);
console.log();

// Split the molecule in atoms based on capitalization of the string
// (the `e` atom in the key is nowhere to be found!)
const atoms = [];
let ascii_code;
for (let i = 0; i < base_molecule.length; i++) {
  ascii_code = base_molecule.charCodeAt(i);
  // console.log(base_molecule[i], ascii_code);
  // Uppercase?
  if (ascii_code < 97) { // 97 is 'a'
    // Add new atom
    atoms.push(base_molecule[i]);
  } else {
    // Attach to last atom
    atoms[atoms.length - 1] += base_molecule[i];
  }
}
console.log("BASE MOLECULE ATOMS: ", atoms);
console.log();


// Start computing permutations
const variations = new Set();

// for (const atom of atoms) {
for (let j = 0; j < atoms.length; j++) {
  const atom = atoms[j];
  if (replacements[atom] !== undefined) {
    // console.log("replace", atom, "with", replacements[atom][0]);
    for (let i = 0; i < replacements[atom].length; i++) {
      // The performance of this must be awful...
      const atoms_clone = [...atoms];
      atoms_clone[j] = replacements[atom][i];
      const molecule = atoms_clone.join('');
      variations.add(molecule);
    }
  }
}
console.log("Number of different variation of the molecule:", variations.size);
console.log();
console.log();



// --- Part Two ---

// Now that the machine is calibrated, you're ready to begin molecule fabrication.

// Molecule fabrication always begins with just a single electron, e, and applying replacements one at a time, just like the ones during calibration.

// For example, suppose you have the following replacements:

// e => H
// e => O
// H => HO
// H => OH
// O => HH

// If you'd like to make HOH, you start with e, and then make the following replacements:

//     e => O to get O
//     O => HH to get HH
//     H => OH (on the second H) to get HOH

// So, you could make HOH after 3 steps. Santa's favorite molecule, HOHOHO, can be made in 6 steps.

// How long will it take to make the medicine? Given the available replacements and the medicine molecule in your puzzle input, what is the fewest number of steps to go from e to the medicine molecule?


// JLX:
// This might be the first one that I truly don't know how to tackle!
/*
  I am going to try:
    - Do a reverse map of replacements
    - Launch a recursive process where:
      - Scan the molecule for all possible substrings that match any rep
      - Perform all replacements
      - Store the replacement in an array
      - Do this recursively with the resulting molecule
*/



const parseInverseReplacements = (lines) => {
  const reps = {};

  for (const line of lines) {
    const parts = line.split(' => ');
    // if (reps[parts[1]] == undefined) reps[parts[1]] = [];
    // reps[parts[1]].push(parts[0])
    reps[parts[1]] = parts[0]; // no arrays: there are no overlapping keys
  }

  return reps;
}

const inv_replacements = parseInverseReplacements(lines);
console.log("INVERSE REPLACEMENT MOLECULES:", inv_replacements);
console.log();


const replace = (match, replacements) => {
  // const input = match.input;
  const sub = match[1]
  const rep = replacements[sub];

  const out =
    match.input.slice(0, match.index) +
    rep +
    match.input.slice(match.index + sub.length);

  return out;
}


// // TEST 1: how many different substitutions can we make on the original molecule?
// const substitutions = [];
// for (const key in inv_replacements) {
//   // We create a "look-ahead" to include overlapping strings.
//   // E.g. search for 'TiTi' in 'TiTiTiTi' should yield 3 matches, not 2 (regexp default)
//   // https://regex101.com/r/fwZlqO/1
//   // https://stackoverflow.com/a/33903830/1934487
//   const re = new RegExp('(?=(' + key + '))', 'g');
//   const ms = base_molecule.matchAll(re);
//   const m_array = [...ms];
//   // console.log(m_array);

//   for (const m of m_array) {
//     // console.log(m[0]);
//     // console.log(base_molecule.slice(0, m.index));
//     const rep = { 
//       sub: m[1],
//       rep: inv_replacements[m[1]],
//       index: m.index,
//       out: replace(m, inv_replacements)
//     };
//     // console.log(rep);
//     substitutions.push(rep);
//   }
// }
// console.log("Possible replacements found on the original molecule:", substitutions.length);



// // TEST 2: try to implement a recursive substitution
// const subMolecule = (history) => {
//   /*
//     Pseudo: 
//       - Input equals 'e'? 
//         - Return history
//       - Any match left? 
//         - Replace string
//         - Push to history
//         - Return recursive
//       - Otherwise,
//         - (leftover string that cannot be replaced)
//         - Debug
//           - Push some kind of error object? 
//           - Return history
//         - Release 
//           - Return null
//   */

//   // Done?
//   if (history.out === 'e') return history;

//   // Continue matching? 
//   for (const key in inv_replacements) {
//     // We create a "look-ahead" to include overlapping strings.
//     // E.g. search for 'TiTi' in 'TiTiTiTi' should yield 3 matches, not 2 (regexp default)
//     // https://regex101.com/r/fwZlqO/1
//     // https://stackoverflow.com/a/33903830/1934487
//     const re = new RegExp('(?=(' + key + '))', 'g');
//     const ms = base_molecule.matchAll(re);
//     const m_array = [...ms];

//     for (const m of m_array) {
//       const rep = { 
//         sub: m[1],
//         rep: inv_replacements[m[1]],
//         index: m.index,
//         out: replace(m, inv_replacements)
//       };

//       const h = [...history, rep];
//       return subMolecule(h);
//     }
//   }

//   // If here, no match was found
//   return [...history, {
//     out: null
//   }];

// }

// const subtree = subMolecule([{
//   out: base_molecule
// }])
// console.log(subtree);  // ERROR: max stack size!


// TEST 3: try to implement a "recursive" substitution using breath first and no actual recursion



const createReplacementChildren = branch => {
  const last_rep = branch[branch.length - 1];
  const children = [];
  for (const key in inv_replacements) {
    // We create a "look-ahead" to include overlapping strings.
    // E.g. search for 'TiTi' in 'TiTiTiTi' should yield 3 matches, not 2 (regexp default)
    // https://regex101.com/r/fwZlqO/1
    // https://stackoverflow.com/a/33903830/1934487
    const re = new RegExp('(?=(' + key + '))', 'g');
    const ms = last_rep.out.matchAll(re);
    const m_array = [...ms];

    for (const m of m_array) {
      const rep = {
        sub: m[1],
        rep: inv_replacements[m[1]],
        index: m.index,
        out: replace(m, inv_replacements)
      };

      const h = [...branch, rep];
      // return subMolecule(h);
      children.push(h);
    }
  }

  // If nothing was found, flag it with an empty last object
  if (children.length === 0) {
    children.push({
      out: null
    })
  }

  return children;
}

const compareBranches = (branchA, branchB) => {
  const lenA = branchA[branchA.length - 1].out.length;
  const lenB = branchB[branchB.length - 1].out.length;
  return lenA - lenB;
}





let sub_completed = [];
let sub_failed = [];
let sub_pending = [
  [{
    out: base_molecule,
  }]
];

let it = 0;
// const TOP_COUNT = 1000;
const TOP_COUNT = 100;  // this still takes a while, but yields the right result!
while (sub_pending.length > 0) {

  console.log("Computing PENDING branches: ", sub_pending.length);
  const clone_pending = [...sub_pending];
  sub_pending = [];

  for (const branch of clone_pending) {
    let children = createReplacementChildren(branch);
    for (const child of children) {
      const leaf_out = child[child.length - 1].out;
      if (leaf_out === 'e') {
        sub_completed.push(child);
      } else if (leaf_out === null) {
        sub_failed.push(child);
      } else {
        sub_pending.push(child);
      }
    }
  }

  console.log(" COMPLETED: ", sub_completed.length);
  console.log(" FAILED:    ", sub_failed.length);
  console.log(" PENDING:   ", sub_pending.length);
  if (sub_pending.length === 0) break;


  // If only doing the above, this crashes after 3 iterations! 
  // Tips from this guy: https://github.com/romellem/advent-of-code/blob/a0dcd15/2015/19/part-two.js
  //   - Assume there can be redundancy (equal strings in differnt branches) and clean them up.
  //   - Sort them by ascending length of the resulting string
  //   - Only push the best XXXX branches to the next phase
  // Otherwise, the problem grows EXPONENTIALLY

  // Clear redundancies
  // console.log("  Pending before cleanup: ", sub_pending.length);
  let cleaned = 0;
  const uniq = new Set();
  for (let i = sub_pending.length - 1; i >= 0; i--) {
    const branch = sub_pending[i];
    const last_step = branch[branch.length - 1];
    // console.log(last_step.out);
    if (uniq.has(last_step.out)) {
      sub_pending.splice(i, 1);
      cleaned++;
    } else {
      uniq.add(last_step.out)
    }
  }
  console.log("  Redundants cleaned:", cleaned);
  console.log(" PENDING:   ", sub_pending.length);
  if (sub_pending.length === 0) break;


  // Sort by the length of their outputs
  sub_pending.sort(compareBranches);
  const first = sub_pending[0];
  const last = sub_pending[sub_pending.length - 1];
  console.log("  Shortest molecule:", first[first.length - 1].out.length);
  console.log("  Longest  molecule:", last[last.length - 1].out.length);

  // // NAIVE: Keep all molecules with the length of the XXXth molecule or less
  // if (sub_pending.length > TOP_COUNT) {
  //   const nth = sub_pending[TOP_COUNT];
  //   const nth_len = nth[nth.length - 1].out.length; 
  //   console.log(`  Length of ${TOP_COUNT}th molecule: ${nth_len}`);

  //   // Find id of last molecule with this length
  //   let id = TOP_COUNT;
  //   while (sub_pending[id][sub_pending[id].length - 1].out.length === nth_len) {
  //     id++;
  //   }

  //   // Keep only up to here
  //   sub_pending = sub_pending.slice(0, id);
  //   console.log(" PENDING:   ", sub_pending.length);
  // }

  // EVEN MORE NAIVE: Keep all molecules up to the XXXth
  sub_pending = sub_pending.slice(0, TOP_COUNT);
  console.log(" PENDING:   ", sub_pending.length);
  if (sub_pending.length === 0) break;
}

sub_completed.sort(compareBranches);
const shortest = sub_completed[0]
console.log("FASTER REPLACEMENT:", shortest);
console.log("NUMBER OF STEPS", shortest.length - 1);

// // Triggers re-run! lol
// fs.writeFileSync('day19_part2_replacement_sequence.json', JSON.stringify(shortest));