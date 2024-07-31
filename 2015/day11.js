// https://adventofcode.com/2015

import fs from 'fs';
import path from 'path';

// // GLOBAL VARS
// const input_filename = 'day9_input.txt'


// // Load input
const __dirname = import.meta.dirname;
// const input = fs.readFileSync(path.join(__dirname, input_filename), 'utf-8');
// console.log(`Number of chars loaded: `, input.length);

// const lines = input.split('\n').filter(line => line !== '')
// console.log(`Number of lines loaded: `, lines.length);



// --- Day 11: Corporate Policy ---

// Santa's previous password expired, and he needs help choosing a new one.

// To help him remember his new password after the old one expires, Santa has devised a method of coming up with a password based on the previous one. Corporate policy dictates that passwords must be exactly eight lowercase letters (for security reasons), so he finds his new password by incrementing his old password string repeatedly until it is valid.

// Incrementing is just like counting with numbers: xx, xy, xz, ya, yb, and so on. Increase the rightmost letter one step; if it was z, it wraps around to a, and repeat with the next letter to the left until one doesn't wrap around.

// Unfortunately for Santa, a new Security-Elf recently started, and he has imposed some additional password requirements:

//     Passwords must include one increasing straight of at least three letters, like abc, bcd, cde, and so on, up to xyz. They cannot skip letters; abd doesn't count.
//     Passwords may not contain the letters i, o, or l, as these letters can be mistaken for other characters and are therefore confusing.
//     Passwords must contain at least two different, non-overlapping pairs of letters, like aa, bb, or zz.

// For example:

//     hijklmmn meets the first requirement (because it contains the straight hij) but fails the second requirement requirement (because it contains i and l).
//     abbceffg meets the third requirement (because it repeats bb and ff) but fails the first requirement.
//     abbcegjk fails the third requirement, because it only has one double letter (bb).
//     The next password after abcdefgh is abcdffaa.
//     The next password after ghijklmn is ghjaabcc, because you eventually skip all the passwords that start with ghi..., since i is not allowed.

// Given Santa's current password (your puzzle input), what should his next password be?

// Your puzzle input is hxbxwxba.




// UTILS
const stringToBytes = (str) => {
  let utf8Encode = new TextEncoder();
  return utf8Encode.encode(str);  // returns Uint8Array, inconvenient
  // return Array.from(utf8Encode.encode(str));  // switch to regular array right away
}

const bytesToString = (byteArray) => {
  if (byteArray instanceof Uint8Array == false) {
    byteArray = new Uint8Array(byteArray);
  }
  let utf8Decode = new TextDecoder();
  return utf8Decode.decode(byteArray);
}

// console.log(stringToBytes('az'));
// console.log(stringToBytes('ABC'));

// // console.log(bytesToString(stringToBytes('az')));

// console.log(bytesToString([97, 122]));  // 'az'







const startPass = 'hxbxwxba';  
console.log(`Start password:`, startPass);


// // Password incrementation
// const incrementString = (str) => {
//   let buffer = stringToBytes(str);

//   // Find last non-z char ('z' = 122)
//   let i = buffer.length - 1;
//   while(buffer[i] == 122 && i > 0) i--;
//   // console.log(`position of last non-'z':`, i);

//   // Increase it
//   buffer[i]++;

//   // Update all trailing to 'a' (= 97)
//   while (++i < buffer.length) {
//     buffer[i] = 97;
//   }

//   // back to string
//   let ascii = bytesToString(buffer);
//   return ascii;
// }
// // console.log(incrementString('aslkjsfz'));
// // console.log(incrementString('aszzz'));
// // console.log(`Test for incrementing '${input}':`, incrementString(input));


// Password incrementation (bytes)
const incrementBytes = bytes => {
  const buffer = [...bytes];

  // Find last non-z char ('z' = 122)
  let i = buffer.length - 1;
  while(buffer[i] == 122 && i > 0) i--;
  // console.log(`position of last non-'z':`, i);

  // Increase it
  buffer[i]++;

  // Update all trailing to 'a' (= 97)
  while (++i < buffer.length) {
    buffer[i] = 97;
  }

  return buffer;
}


// // Password validity
// const forbiddenChars = ['i','o','l'];
// const hasForbiddenChars = str => {
//   for (let i = 0; i < str.length; i++) {
//     if (forbiddenChars.includes(str[i])) return true;
//   }
//   return false;
// }

// Password validity (bytes)
// console.log(stringToBytes('ilo'));
const forbiddenBytes = [105, 108, 111];
const hasForbiddenBytes = bytes => {
  for (let i = 0; i < bytes.length; i++) {
    if (forbiddenBytes.includes(bytes[i])) return true;
  }
  return false;
}


// const hasValidPairs = str => {
//   let pairs = new Set();
//   for (let i = 0; i < str.length - 1; i++) {
//     if (str[i] === str[i + 1]) {
//       pairs.add(str[i])
//       i++;  // skip the pair
//     }
//   }
//   return pairs.size > 1;
// }

const hasValidBytePairs = bytes => {
  let pairs = new Set();
  for (let i = 0; i < bytes.length - 1; i++) {
    if (bytes[i] === bytes[i + 1]) {
      pairs.add(bytes[i])
      i++;  // skip the pair
    }
  }
  return pairs.size > 1;
}


const hasValidTriplet = bytes => {
  for (let i = 0; i < bytes.length - 2; i++) {
    if ((bytes[i] === bytes[i + 1] - 1)
      && (bytes[i] === bytes[i + 2] - 2)) {
        return true;
    }
  }
  return false;
}


const isValidPassword = passBytes => {
  return !hasForbiddenBytes(passBytes) 
    && hasValidBytePairs(passBytes)
    && hasValidTriplet(passBytes);
}
 


// Iteratively generate passwords until finding a valid one
let its = 0;
let newPass = stringToBytes(startPass);
do {
  newPass = incrementBytes(newPass);
  its++;
} 
while (!isValidPassword(newPass) && its < 1000000000);

console.log(`Incr. password:`, bytesToString(newPass));
console.log(`Found after iterations:`, its);
console.log();


// --- Part Two ---

// Santa's password expired again. What's the next one?

console.log(`Start second password:`, bytesToString(newPass));
its = 0;
do {
  newPass = incrementBytes(newPass);
  its++;
  // if (its % 24 == 0) console.log(bytesToString(newPass));
} 
while (!isValidPassword(newPass) && its < 1000000000);

console.log(`Incr. second password:`, bytesToString(newPass));
console.log(`Found after iterations:`, its);
console.log();

