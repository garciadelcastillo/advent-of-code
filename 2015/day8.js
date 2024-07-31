// https://adventofcode.com/2015

// --- Day 8: Matchsticks ---

// Space on the sleigh is limited this year, and so Santa will be bringing his list as a digital copy. He needs to know how much space it will take up when stored.

// It is common in many programming languages to provide a way to escape special characters in strings. For example, C, JavaScript, Perl, Python, and even PHP handle special characters in very similar ways.

// However, it is important to realize the difference between the number of characters in the code representation of the string literal and the number of characters in the in-memory string itself.

// For example:

//     "" is 2 characters of code (the two double quotes), but the string contains zero characters.
//     "abc" is 5 characters of code, but 3 characters in the string data.
//     "aaa\"aaa" is 10 characters of code, but the string itself contains six "a" characters and a single, escaped quote character, for a total of 7 characters in the string data.
//     "\x27" is 6 characters of code, but the string itself contains just one - an apostrophe ('), escaped using hexadecimal notation.

// Santa's list is a file that contains many double-quoted string literals, one on each line. The only escape sequences used are \\ (which represents a single backslash), \" (which represents a lone double-quote character), and \x plus two hexadecimal characters (which represents a single character with that ASCII code).

// Disregarding the whitespace in the file, what is the number of characters of code for string literals minus the number of characters in memory for the values of the strings in total for the entire file?

// For example, given the four strings above, the total number of characters of string code (2 + 5 + 10 + 6 = 23) minus the total number of characters in memory for string values (0 + 3 + 7 + 1 = 11) is 23 - 11 = 12.


import fs from 'fs';
import path from 'path';

// GLOBAL VARS
const input_filename = 'day8_input.txt'


// Load input
const __dirname =
  import.meta.dirname;
const input = fs.readFileSync(path.join(__dirname, input_filename), 'utf-8');
console.log(`Number of chars loaded: `, input.length);

const lines = input.split('\n').filter(line => line !== '')
console.log(`Number of lines loaded: `, lines.length);



// https://stackoverflow.com/a/4209150/1934487
const decodeHexEscapeChars = str => {
  return str.replace(/\\x([0-9A-Fa-f]{2})/g, function () {
    return String.fromCharCode(parseInt(arguments[1], 16));
  });
};

const charsInString = (str) => {
  return str.length;
}

// My implementation, fails for "ubgxxcvnltzaucrzg\\xcez"
const unrawJLX = (str) => {
  // console.log(`string: `, str);
  // console.log(`  length: `, str.length);
  let escaped = str;

  escaped = escaped.replace(/^"/g, ""); // dquot start of line
  // console.log(`  escaped: `, escaped);

  escaped = escaped.replace(/"$/g, ""); // dquot end of line
  // console.log(`  escaped: `, escaped);

  escaped = escaped.replace(/\\"/g, '"');
  // console.log(`  escaped: `, escaped);  // escaped dquot

  escaped = escaped.replace(/\\\\/g, "\\");
  // console.log(`  escaped: `, escaped);  // escaped backslash

  escaped = decodeHexEscapeChars(escaped);
  // console.log(`  escaped: `, escaped);  // escaped hex chars

  return escaped;
}

// This one deals properly with "ubgxxcvnltzaucrzg\\xcez"

// https://stackoverflow.com/a/57330383/1934487
// Note: This does not implement LegacyOctalEscapeSequence (https://tc39.es/ecma262/#prod-annexB-LegacyOctalEscapeSequence)
function unraw(str) {
  if (str.startsWith('"')) str = str.slice(1);
  if (str.endsWith('"')) str = str.slice(0, str.length - 1);

  return str.replace(/\\[0-9]|\\['"\bfnrtv]|\\x[0-9a-f]{2}|\\u[0-9a-f]{4}|\\u\{[0-9a-f]+\}|\\./ig, match => {
    switch (match[1]) {
      // case '"':
      //   return '';
      case "'":
      case "\"":
      case "\\":
        return match[1];
      case `\"`:
        return '"';
      // case "b":
      //   return "\b";
      // case "f":
      //   return "\f";
      // case "n":
      //   return "\n";
      // case "r":
      //   return "\r";
      // case "t":
      //   return "\t";
      // case "v":
      //   return "\v";
      // case "u":
      //   if (match[2] === "{") {
      //     return String.fromCodePoint(parseInt(match.substring(3), 16));
      //   }
      //   return String.fromCharCode(parseInt(match.substring(2), 16));
      case "x":
        return String.fromCharCode(parseInt(match.substring(2), 16));
      // case "0":
      //   return "\0";
      default: // E.g., "\q" === "q"
        return match.substring(1);
    }
  });
}

// const charsInMemory = str => unrawJLX(str).length;
const charsInMemory = str => unraw(str).length;

console.log(`Different unrawing:`);
lines.forEach((line,i) => {
  // console.log(i);
  // console.log(`raw: `, line, charsInString(line));
  // // console.log(charsInString(line));
  // console.log(`esc: `, unescapeChars(line), unescapeChars(line).length);
  // console.log(`urw: `, unraw(line), unraw(line).length);
  // // console.log(charsInMemory(line));

  const unesc = unrawJLX(line).length;
  const unrw = unraw(line).length;
  if (unesc != unrw) {
    console.log(i);
    console.log(`raw: `, line, charsInString(line));
    // console.log(charsInString(line));
    console.log(`esc: `, unrawJLX(line), unrawJLX(line).length);
    console.log(`urw: `, unraw(line), unraw(line).length);
    
  }

})


// // This doesn't work becase `` actually scapes the chars
// const tests = [
//   `""`,
//   `"abc"`,
//   `"aaa\"aaa"`,
//   `"\x27"`
// ];
// console.log(tests);
// tests.forEach(str => {
//     console.log(charsInString(str));
// });

// // But reading from file works!
// console.log(lines[1]);
// console.log(charsInString(lines[1]));
// console.log(charsInMemory(lines[1]));
// console.log(lines[4]);
// console.log(charsInString(lines[4]));
// console.log(charsInMemory(lines[4]));


// const testStr = String.raw `"ubgxxcvnltzaucrzg\\xcez"`;
// // const unescapedTest = unescapeChars(testStr);
// const unescapedTest = unraw(testStr);
// console.log(testStr);
// console.log(unescapedTest);
// console.log(charsInString(testStr));
// console.log(charsInMemory(testStr));


// Total string literal chars
const total_chars_string_literal = lines.reduce((acc, val) => acc + charsInString(val), 0);
console.log(`Total chars in file: `, total_chars_string_literal);

// Total chars in memory
const total_chars_memory = lines.reduce((acc, val) =>
  acc + charsInMemory(val), 0);
console.log(`Total chars in memory: `, total_chars_memory);

console.log(`Char diff: `, total_chars_string_literal - total_chars_memory);
console.log();




// --- Part Two ---

// Now, let's go the other way. In addition to finding the number of characters of code, you should now encode each code representation as a new string and find the number of characters of the new encoded representation, including the surrounding double quotes.

// For example:

//     "" encodes to "\"\"", an increase from 2 characters to 6.
//     "abc" encodes to "\"abc\"", an increase from 5 characters to 9.
//     "aaa\"aaa" encodes to "\"aaa\\\"aaa\"", an increase from 10 characters to 16.
//     "\x27" encodes to "\"\\x27\"", an increase from 6 characters to 11.

// Your task is to find the total number of characters to represent the newly encoded strings minus the number of characters of code in each original string literal. For example, for the strings above, the total encoded length (6 + 9 + 16 + 11 = 42) minus the characters in the original code representation (23, just like in the first part of this puzzle) is 42 - 23 = 19.


const escapeString = str => 
  '"' + str.replaceAll('\\', '\\\\').replaceAll('"', '\\"') + '"';


const escaped = lines.map((line, i) => {
    const esc = escapeString(line);
    // console.log(i);
    // console.log('Bef: ', line);
    // console.log('Aft: ', esc);
    return esc
  });

const total_chars_escaped = escaped.reduce((acc, val) => 
  acc + charsInString(val), 0);
console.log(`Total chars in escaped string: `, total_chars_escaped);

console.log(`New diff: `, total_chars_escaped - total_chars_string_literal);