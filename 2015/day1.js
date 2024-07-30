
import fs from 'fs';

// read the input file
const __dirname = import.meta.dirname;
const input = fs.readFileSync(__dirname + '/day1_input.txt', 'utf-8');
// console.log(input);

let floor = 0;
for (let i = 0; i < input.length; i++) {
    if (input[i] === '(') {
        floor++;
    } else if (input[i] === ')') {
        floor--;
    }
}
console.log(`Santa is on floor ${floor}`);

// Part 2
floor = 0;
for (let i = 0; i < input.length; i++) {
    if (input[i] === '(') {
        floor++;
    } else if (input[i] === ')') {
        floor--;
    }

    if (floor === -1) {
        console.log(`Santa entered the basement at position ${i + 1}`);
        break;
    }
}