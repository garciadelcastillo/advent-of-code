import fs from 'fs';

const __dirname = import.meta.dirname;
const input = fs.readFileSync(__dirname + '/day3_input.txt', 'utf-8');
// console.log(input);
console.log(`Loaded ${input.length} characters`);


// --- Day 3: Perfectly Spherical Houses in a Vacuum ---

// Santa is delivering presents to an infinite two-dimensional grid of houses.

// He begins by delivering a present to the house at his starting location, and then an elf at the North Pole calls him via radio and tells him where to move next. Moves are always exactly one house to the north (^), south (v), east (>), or west (<). After each move, he delivers another present to the house at his new location.

// However, the elf back at the north pole has had a little too much eggnog, and so his directions are a little off, and Santa ends up visiting some houses more than once. How many houses receive at least one present?

// For example:

//     > delivers presents to 2 houses: one at the starting location, and one to the east.
//     ^>v< delivers presents to 4 houses in a square, including twice to the house at his starting/ending location.
//     ^v^v^v^v^v delivers a bunch of presents to some very lucky children at only 2 houses.


// DATA GRID
// const w = 1001;
// const h = 1001;
// const grid = Array.from({
//     length: w * h
// }).fill(0);
// // console.log(grid);
// console.log(grid.length);

// let pos = w * Math.floor(0.5 * h) + Math.floor(0.5 * w);
// console.log(pos);

// // first house
// grid[pos]++;

// SCRATH DAT, lets just use a dict

let dict = {};
let x = 0,
    y = 0;

const addPresent = (x, y) => {
    const key = `${x},${y}`;
    if (dict[key] === undefined) {
        dict[key] = 1;
    } else {
        dict[key]++
    }
}

// Init house
addPresent(x, y);

// follow the drunk elf
for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '>') x++
    else if (char === '<') x--
    else if (char === 'v') y++
    else if (char === '^') y--
    else {
        console.log(`Found weird char '${char}'`);
        continue;
    }

    addPresent(x, y);
}

// console.log(dict);
console.log(`Houses that got at least one gift: `, Object.keys(dict).length);


// --- Part Two ---

// The next year, to speed up the process, Santa creates a robot version of himself, Robo-Santa, to deliver presents with him.

// Santa and Robo-Santa start at the same location (delivering two presents to the same starting house), then take turns moving based on instructions from the elf, who is eggnoggedly reading from the same script as the previous year.

// This year, how many houses receive at least one present?

// For example:

//     ^v delivers presents to 3 houses, because Santa goes north, and then Robo-Santa goes south.
//     ^>v< now delivers presents to 3 houses, and Santa and Robo-Santa end up back where they started.
//     ^v^v^v^v^v now delivers presents to 11 houses, with Santa going one direction and Robo-Santa going the other.



dict = {};
let santa = {x:0, y:0},
    robot = {x:0, y:0};

const addPresentFrom = (gifter) => {
    const key = `${gifter.x},${gifter.y}`;
    if (dict[key] === undefined) {
        dict[key] = 1;
    } else {
        dict[key]++
    }
}

// Init house
addPresentFrom(santa);
addPresentFrom(robot);
console.log(dict);

// follow the drunk elf
for (let i = 0; i < input.length; i++) {
    const gifter = i % 2 == 0 ? santa : robot;
    const char = input[i];
    if (char === '>') gifter.x++
    else if (char === '<') gifter.x--
    else if (char === 'v') gifter.y++
    else if (char === '^') gifter.y--
    else {
        console.log(`Found weird char '${char}'`);
        continue;
    }

    addPresentFrom(gifter)
}

// console.log(dict);
console.log(`Houses that got at least one gift: `, Object.keys(dict).length);

