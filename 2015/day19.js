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
  if (ascii_code < 97) {  // 97 is 'a'
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






