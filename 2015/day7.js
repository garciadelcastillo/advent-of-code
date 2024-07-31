// https://adventofcode.com/2015

// --- Day 7: Some Assembly Required ---

// This year, Santa brought little Bobby Tables a set of wires and bitwise logic gates! Unfortunately, little Bobby is a little under the recommended age range, and he needs help assembling the circuit.

// Each wire has an identifier (some lowercase letters) and can carry a 16-bit signal (a number from 0 to 65535). A signal is provided to each wire by a gate, another wire, or some specific value. Each wire can only get a signal from one source, but can provide its signal to multiple destinations. A gate provides no signal until all of its inputs have a signal.

// The included instructions booklet describes how to connect the parts together: x AND y -> z means to connect wires x and y to an AND gate, and then connect its output to wire z.

// For example:

//     123 -> x means that the signal 123 is provided to wire x.
//     x AND y -> z means that the bitwise AND of wire x and wire y is provided to wire z.
//     p LSHIFT 2 -> q means that the value from wire p is left-shifted by 2 and then provided to wire q.
//     NOT e -> f means that the bitwise complement of the value from wire e is provided to wire f.

// Other possible gates include OR (bitwise OR) and RSHIFT (right-shift). If, for some reason, you'd like to emulate the circuit instead, almost all programming languages (for example, C, JavaScript, or Python) provide operators for these gates.

// For example, here is a simple circuit:

// 123 -> x
// 456 -> y
// x AND y -> d
// x OR y -> e
// x LSHIFT 2 -> f
// y RSHIFT 2 -> g
// NOT x -> h
// NOT y -> i

// After it is run, these are the signals on the wires:

// d: 72
// e: 507
// f: 492
// g: 114
// h: 65412
// i: 65079
// x: 123
// y: 456

// In little Bobby's kit's instructions booklet (provided as your puzzle input), what signal is ultimately provided to wire a?



import fs from 'fs';

const __dirname =
  import.meta.dirname;
const input = fs.readFileSync(__dirname + '/day7_input.txt', 'utf-8');
console.log(`Loaded ${input.length} characters`);

const instStrings = input.split('\n').filter(line => line !== '')
console.log(`Loaded instructions: `, instStrings.length);


const parseInst = (str, id) => {
  const io = str.split('->');
  const o = io[1].replaceAll(' ', '');
  
  const i = io[0].split(' ').filter(e => e !== '');

  let inputs = [];
  let type = "";
  let target = o;
  let f0, f1;

  if (i.length == 1) {
    // Pure signal
    type = 'ASSIGN';
    f0 = parseFloat(i[0]);
    inputs.push(isNaN(f0) ? i[0] : f0);  // could be value (36 -> x) or pass through (z -> x)
    inputs.push(null);
  } else if (i.length == 2) {
    type = 'NOT';
    f0 = parseFloat(i[1]);
    inputs.push(isNaN(f0) ? i[1] : f0);
    inputs.push(null);
  } else if (i.length == 3) {
    type = i[1];
    f0 = parseFloat(i[0]);
    f1 = parseFloat(i[2]);
    inputs.push(isNaN(f0) ? i[0] : f0);
    inputs.push(isNaN(f1) ? i[2] : f1);
  }

  return {
    id,
    type,
    inputs,
    inputIds: [null, null],
    inputObjs: [null, null],
    target,
    targetIds: [],
    targetObjs: []
  }
}

// Create an array of objs
const instructions = instStrings.map(parseInst);

// Now link nodes together into a graph structure
for (let i = 0; i < instructions.length; i++) {
  const ins = instructions[i];
  const target = ins.target;

  for (let j = 0; j < instructions.length; j++) {
    const index = instructions[j].inputs.indexOf(target);
    if (index != -1) {
      instructions[j].inputIds[index] = ins.id;
      instructions[j].inputObjs[index] = ins;
      ins.targetIds.push(instructions[j].id);
      ins.targetObjs.push(instructions[j]);
    }
  }
}
// console.log(instructions);

const leafNodes = instructions.reduce((acc, val) => {
  if (val.targetIds.length == 0) {
    acc.push(val);
  }
  return acc
}, []);
// console.log(`Leaf nodes: `, leafNodes);

const parentNodes = instructions.reduce((acc, val) => {
  if (val.type === "ASSIGN" && typeof val.inputs[0] == "number") {
    acc.push(val);
  }
  return acc;
}, []);
// console.log(`Parent nodes: `, parentNodes);


// Now here I should traverse the graph and perform downstream calcs
// Add solving order by doing breath-first search

let currentLevel = parentNodes;
let level = 0;
while (currentLevel.length > 0 && level < 1000) {
  let nextLevel = []; 
  currentLevel.forEach(node => {
    if (node['level'] === undefined || node['level'] < level) {
      // if (node['level'] !== undefined && node['level'] < level && level - node['level'] > 1) console.log(`Replacing level to ${level} on: `, node);
      node['level'] = level;
      nextLevel = nextLevel.concat(node.targetObjs);
    }
  });

  currentLevel = nextLevel;
  level++;
}
// console.log(instructions);

// Any node without a level? 
let orphans = instructions.reduce((acc, val) => {
  if (val['level'] === undefined) acc.push(val);
  return acc;
}, []);
// console.log(`Orphan nodes:`, orphans);
// console.log(parentNodes);
// console.log(leafNodes);


// tests
let filtered = instructions.filter(node => node.type === 'ASSIGN');
// console.log(`Filtered nodes: `, filtered);

const getInputValues = node => {
  let inVals = [];
  for (let i = 0; i < node.inputObjs.length; i++) {
    if (node.inputObjs[i] == null) {
      inVals.push(node.inputs[i]);
    } else {
      inVals.push(node.inputObjs[i].result);
    }
  }
  return inVals;
}

// Solver functions!
let solve = {
  ASSIGN: (inputs) => {
    return inputs[0];
  },
  NOT: (inputs) => {
    return ~inputs[0];
  },
  AND: (inputs) => {
    return inputs[0] & inputs[1];
  },
  OR: (inputs) => {
    return inputs[0] | inputs[1];
  },
  LSHIFT: (inputs) => {
    return inputs[0] << inputs[1];
  },
  RSHIFT: (inputs) => {
    return inputs[0] >> inputs[1];
  },
}


// Breath-first solving! 
currentLevel = parentNodes;
level = 0;
while (currentLevel.length > 0 && level < 1000) {
  let nextLevel = []; 
  currentLevel.forEach(node => {
    const ins = getInputValues(node);
    if (solve[node.type] != undefined) {
      node['result'] = solve[node.type](ins);
      node.targetObjs.forEach(target => {
        if (target.level === level + 1) nextLevel.push(target);
      })
    }
  });

  currentLevel = nextLevel;
  level++;
}
// console.log(leafNodes);

// Zero-result nodes
let zeroNodes = instructions.filter(node => node.result === 0);
// console.log(`Zero results: `, zeroNodes);
// console.log(`Zero result count: `, zeroNodes.length);

let aNode = instructions.filter(node => node.target === 'a');
console.log(aNode);
console.log(`The result of node 'a' is`, aNode[0].result);
// 3176
console.log();

// --- Part Two ---

// Now, take the signal you got on wire a, override wire b to that signal, and reset the other wires (including wire a). What new signal is ultimately provided to wire a?

// Where is wire b?
const bNode = instructions.filter(node => node.target === 'b')[0];
// console.log(bNode);

bNode.inputs[0] = 3176;

// Breath-first solving! 
currentLevel = parentNodes;
level = 0;
while (currentLevel.length > 0 && level < 1000) {
  let nextLevel = []; 
  currentLevel.forEach(node => {
    const ins = getInputValues(node);
    if (solve[node.type] != undefined) {
      node['result'] = solve[node.type](ins);
      node.targetObjs.forEach(target => {
        if (target.level === level + 1) nextLevel.push(target);
      })
    }
  });

  currentLevel = nextLevel;
  level++;
}

console.log(aNode);
console.log(`The result of node 'a' is`, aNode[0].result)