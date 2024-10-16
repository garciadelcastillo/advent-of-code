// https://adventofcode.com/2015

import fs from 'fs';
import path, {
  parse
} from 'path';

const print = console.log;

// GLOBAL VARS
const input_filename = 'day23_input.txt'


// Load input
const __dirname =
  import.meta.dirname;
const input = fs.readFileSync(path.join(__dirname, input_filename), 'utf-8');
console.log(`Number of chars loaded: `, input.length);

const lines = input.split('\n').filter(line => line !== '')
console.log(`Number of lines loaded: `, lines.length);
console.log();

// --- Day 23: Opening the Turing Lock ---

// Little Jane Marie just got her very first computer for Christmas from some unknown benefactor. It comes with instructions and an example program, but the computer itself seems to be malfunctioning. She's curious what the program does, and would like you to help her run it.

// The manual explains that the computer supports two registers and six instructions (truly, it goes on to remind the reader, a state-of-the-art technology). The registers are named a and b, can hold any non-negative integer, and begin with a value of 0. The instructions are as follows:

//     hlf r sets register r to half its current value, then continues with the next instruction.
//     tpl r sets register r to triple its current value, then continues with the next instruction.
//     inc r increments register r, adding 1 to it, then continues with the next instruction.
//     jmp offset is a jump; it continues with the instruction offset away relative to itself.
//     jie r, offset is like jmp, but only jumps if register r is even ("jump if even").
//     jio r, offset is like jmp, but only jumps if register r is 1 ("jump if one", not odd).

// All three jump instructions work with an offset relative to that instruction. The offset is always written with a prefix + or - to indicate the direction of the jump (forward or backward, respectively). For example, jmp +1 would simply continue with the next instruction, while jmp +0 would continuously jump back to itself forever.

// The program exits when it tries to run an instruction beyond the ones defined.

// For example, this program sets a to 2, because the jio instruction causes it to skip the tpl instruction:

// inc a
// jio a, +2
// tpl a
// inc a

// What is the value in register b when the program in your puzzle input is finished executing?


const program = lines.map(line => {
  let split = line.split(" ");
  let ins, reg, off;
  ins = split[0];
  if (split.length == 2) {
    if (ins == "jmp") {
      off = Number.parseInt(split[1]);
    } else {
      reg = split[1];
    }
  } else {
    reg = split[1][0];
    off = Number.parseInt(split[2]);
  }

  return {
    line,
    ins,
    reg,
    off
  }
});
console.log("PROGRAM:",program);

const action = {
  'hlf': (ins, reg, curs) => {

  }
}

const apply = (ins, reg, curs) => {
  switch (ins['ins']) {
    case "inc":
      reg[ins['reg']]++;
      return curs + 1;

    case "tpl":
      reg[ins['reg']] *= 3;
      return curs + 1;

    case "hlf":
      reg[ins['reg']] /= 2;
      return curs + 1;

    case "jmp":
      return curs + ins['off'];

    case "jie":
      if (reg[ins['reg']] % 2 == 0) {
        return curs + ins['off'];
      } else {
        return curs + 1;
      }

    case "jio":
      if (reg[ins['reg']] == 1) {
        return curs + ins['off'];
      } else {
        return curs + 1;
      }
  }
}


let registers = {
  a: 0,
  b: 0
};

let cursor = 0;
let it = 0
while (cursor >= 0 && cursor < program.length 
  && it++ < 100000 
  ) {
  cursor = apply(program[cursor], registers, cursor);
}

console.log("Registers:", registers);
console.log();



// --- Part Two ---

// The unknown benefactor is very thankful for releasi-- er, helping little Jane Marie with her computer. Definitely not to distract you, what is the value in register b after the program is finished executing if register a starts as 1 instead?


registers = {
  a: 1,
  b: 0
};

cursor = 0;
it = 0
while (cursor >= 0 && cursor < program.length 
  && it++ < 100000 
  ) {
  cursor = apply(program[cursor], registers, cursor);
}

console.log("Registers:", registers);
console.log();