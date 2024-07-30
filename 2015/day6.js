// --- Day 6: Probably a Fire Hazard ---

// Because your neighbors keep defeating you in the holiday house decorating contest year after year, you've decided to deploy one million lights in a 1000x1000 grid.

// Furthermore, because you've been especially nice this year, Santa has mailed you instructions on how to display the ideal lighting configuration.

// Lights in your grid are numbered from 0 to 999 in each direction; the lights at each corner are at 0,0, 0,999, 999,999, and 999,0. The instructions include whether to turn on, turn off, or toggle various inclusive ranges given as coordinate pairs. Each coordinate pair represents opposite corners of a rectangle, inclusive; a coordinate pair like 0,0 through 2,2 therefore refers to 9 lights in a 3x3 square. The lights all start turned off.

// To defeat your neighbors this year, all you have to do is set up your lights by doing the instructions Santa sent you in order.

// For example:

//     turn on 0,0 through 999,999 would turn on (or leave on) every light.
//     toggle 0,0 through 999,0 would toggle the first line of 1000 lights, turning off the ones that were on, and turning on the ones that were off.
//     turn off 499,499 through 500,500 would turn off (or leave off) the middle four lights.

// After following the instructions, how many lights are lit?


import fs from 'fs';

const __dirname =
  import.meta.dirname;
const input = fs.readFileSync(__dirname + '/day6_input.txt', 'utf-8');
console.log(`Loaded ${input.length} characters`);

const instructions = input.split('\n').filter(line => line !== '')
console.log(`Loaded instructions: `, instructions.length);

// https://regex101.com/r/We7Oz8/1
const numbRegex = /([0-9]+)/g;
const extractInsObj = str => {
  const type = str.includes('toggle') ? 'toggle' :
    str.includes('on') ? 'on' :
    str.includes('off') ? 'off' : 'unknown';
  const nums = str.match(numbRegex).map(num => parseInt(num));
  return {
    type,
    start: {
      x: nums[0],
      y: nums[1]
    },
    end: {
      x: nums[2],
      y: nums[3]
    }
  }
}
const instObjs = instructions.map(extractInsObj);


let w = 1000,
  h = 1000;
let lights = Array.from({
  length: w * h
}).fill(false);

const XYtoI = (x, y) => x + y * w;

let actions = {
  on: (lights, start, end) => {
    let i;
    for (let x = start.x; x <= end.x; x++) {
      for (let y = start.y; y <= end.y; y++) {
        i = XYtoI(x, y);
        lights[i] = true;
      }
    }
  }, 
  off : (lights, start, end) => {
    let i;
    for (let x = start.x; x <= end.x; x++) {
      for (let y = start.y; y <= end.y; y++) {
        i = XYtoI(x, y);
        lights[i] = false;
      }
    }
  },
  toggle: (lights, start, end) => {
    let i;
    for (let x = start.x; x <= end.x; x++) {
      for (let y = start.y; y <= end.y; y++) {
        i = XYtoI(x, y);
        lights[i] = !lights[i];
      }
    }
  }
}

const applyInstruction = ins => {
  actions[ins['type']](lights, ins['start'], ins['end']);
}
instObjs.forEach(applyInstruction);

const countOn = lights.reduce((acc,val) => acc + val, 0);
const countOff = lights.reduce((acc,val) => acc + !val, 0);
console.log(`Lights on:`, countOn);
console.log(`Lights off:`, countOff);
console.log(`Total: `, countOn + countOff);
console.log();



// --- Part Two ---

// You just finish implementing your winning light pattern when you realize you mistranslated Santa's message from Ancient Nordic Elvish.

// The light grid you bought actually has individual brightness controls; each light can have a brightness of zero or more. The lights all start at zero.

// The phrase turn on actually means that you should increase the brightness of those lights by 1.

// The phrase turn off actually means that you should decrease the brightness of those lights by 1, to a minimum of zero.

// The phrase toggle actually means that you should increase the brightness of those lights by 2.

// What is the total brightness of all lights combined after following Santa's instructions?

// For example:

//     turn on 0,0 through 0,0 would increase the total brightness by 1.
//     toggle 0,0 through 999,999 would increase the total brightness by 2000000.



actions = {
  on: (lights, start, end) => {
    let i;
    for (let x = start.x; x <= end.x; x++) {
      for (let y = start.y; y <= end.y; y++) {
        i = XYtoI(x, y);
        lights[i]++;
      }
    }
  }, 
  off : (lights, start, end) => {
    let i;
    for (let x = start.x; x <= end.x; x++) {
      for (let y = start.y; y <= end.y; y++) {
        i = XYtoI(x, y);
        lights[i]--;
        if (lights[i] < 0) lights[i] = 0;
      }
    }
  },
  toggle: (lights, start, end) => {
    let i;
    for (let x = start.x; x <= end.x; x++) {
      for (let y = start.y; y <= end.y; y++) {
        i = XYtoI(x, y);
        lights[i] += 2;
      }
    }
  }
}

lights.fill(0);

instObjs.forEach(applyInstruction);

const totalBrightness = lights.reduce((acc,val) => acc + val, 0);
console.log(`Total brightness: `, totalBrightness);
