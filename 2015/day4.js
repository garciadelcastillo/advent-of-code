// --- Day 4: The Ideal Stocking Stuffer ---

// Santa needs help mining some AdventCoins (very similar to bitcoins) to use as gifts for all the economically forward-thinking little girls and boys.

// To do this, he needs to find MD5 hashes which, in hexadecimal, start with at least five zeroes. The input to the MD5 hash is some secret key (your puzzle input, given below) followed by a number in decimal. To mine AdventCoins, you must find Santa the lowest positive number (no leading zeroes: 1, 2, 3, ...) that produces such a hash.

// For example:

//     If your secret key is abcdef, the answer is 609043, because the MD5 hash of abcdef609043 starts with five zeroes (000001dbbfa...), and it is the lowest such number to do so.
//     If your secret key is pqrstuv, the lowest number it combines with to make an MD5 hash starting with five zeroes is 1048970; that is, the MD5 hash of pqrstuv1048970 looks like 000006136ef....

// Your puzzle input is bgvyzdsv.

import crypto from 'crypto';

// let hash = crypto.createHash('md5');

const start = performance.now();
const input = 'bgvyzdsv';
let it = 1;
let found = false;

while (!found && it < 1000000) {
    const key = input + it;
    const h = crypto.createHash('md5').update(key).digest('hex');
    if (h[0] === '0' &&
        h[1] === '0' &&
        h[2] === '0' &&
        h[3] === '0' &&
        h[4] === '0') {
        found = true;
    } else {
        it++;
    }
}

console.log(`The lowest positive number to mine AdventCoints with the secret key ${input} is: `, it);
console.log(`hash: `, crypto.createHash('md5').update(input + it).digest('hex'));



// --- Part Two ---

// Now find one that starts with six zeroes.

it = 0;
found = false;
while (!found && it < 10000000) {
    const key = input + it;
    const h = crypto.createHash('md5').update(key).digest('hex');
    if (h[0] === '0' &&
        h[1] === '0' &&
        h[2] === '0' &&
        h[3] === '0' &&
        h[4] === '0' &&
        h[5] === '0') {
        found = true;
    } else {
        it++;
    }
}

console.log(`The lowest positive number to mine AdventCoints with the secret key ${input} is: `, it);
console.log(`hash: `, crypto.createHash('md5').update(input + it).digest('hex'));

console.log(`Computed in ms: `, performance.now() - start);

// Found 204811055, but it was too high!