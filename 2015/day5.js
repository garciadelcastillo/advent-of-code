import fs from 'fs';

const __dirname = import.meta.dirname;
const input = fs.readFileSync(__dirname + '/day5_input.txt', 'utf-8');
console.log(`Loaded ${input.length} characters`);
// console.log(input);


// --- Day 5: Doesn't He Have Intern-Elves For This? ---

// Santa needs help figuring out which strings in his text file are naughty or nice.

// A nice string is one with all of the following properties:

//     It contains at least three vowels (aeiou only), like aei, xazegov, or aeiouaeiouaeiou.
//     It contains at least one letter that appears twice in a row, like xx, abcdde (dd), or aabbccdd (aa, bb, cc, or dd).
//     It does not contain the strings ab, cd, pq, or xy, even if they are part of one of the other requirements.

// For example:

//     ugknbfddgicrmopn is nice because it has at least three vowels (u...i...o...), a double letter (...dd...), and none of the disallowed substrings.
//     aaa is nice because it has at least three vowels and a double letter, even though the letters used by different rules overlap.
//     jchzalrnumimnmhp is naughty because it has no double letter.
//     haegwjzuvuyypxyu is naughty because it contains the string xy.
//     dvszwmarrgswjxmb is naughty because it contains only one vowel.

// How many strings are nice?

const strings = input.split('\n').filter(line => line !== '')
console.log(`Loaded lines: `, strings.length);

const badStrings = ['ab', 'cd', 'pq', 'xy'];
const containsBadStrings = (str) => {
    for (let i = 0; i < badStrings.length; i++) {
        if (str.includes(badStrings[i])) {
            return true;
        }
    }
    return false;
}

const vowels = ['a','e','i','o','u'];
const countDiffVowels = (str) => {
    let count = 0;
    for (let i = 0; i < vowels.length; i++) {
        if (str.includes(vowels[i])) count++;
    }
    return count;
}
const countVowels = (str) => {
    return str.split('').reduce((acc, val) => 
        acc + vowels.includes(val), 0);
}

const hasDuplicateLetters = (str) => {
    for (let i = 0; i < str.length - 1; i++) {
        if (str[i] === str[i + 1]) return true;
    }
    return false;
}

let niceStrings = [];
strings.forEach(str => { 
    if (
        !containsBadStrings(str) && 
        // countDiffVowels(str) > 2 &&
        countVowels(str) > 2 &&
        hasDuplicateLetters(str)
    ) {
        niceStrings.push(str);
    }
});

console.log(`Number of nice strings: `, niceStrings.length);

// const test = 'aaa';
// console.log(!containsBadStrings(test));
// console.log(countDiffVowels(test));
// console.log(countVowels(test));
// console.log(hasDuplicateLetters(test));





// --- Part Two ---

// Realizing the error of his ways, Santa has switched to a better model of determining whether a string is naughty or nice. None of the old rules apply, as they are all clearly ridiculous.

// Now, a nice string is one with all of the following properties:

//     It contains a pair of any two letters that appears at least twice in the string without overlapping, like xyxy (xy) or aabcdefgaa (aa), but not like aaa (aa, but it overlaps).
//     It contains at least one letter which repeats with exactly one letter between them, like xyx, abcdefeghi (efe), or even aaa.

// For example:

//     qjhvhtzxzqqjkmpb is nice because is has a pair that appears twice (qj) and a letter that repeats with exactly one letter between them (zxz).
//     xxyxx is nice because it has a pair that appears twice and a letter that repeats with one between, even though the letters used by each rule overlap.
//     uurcxstgmygtbstg is naughty because it has a pair (tg) but no repeat with a single letter between them.
//     ieodomkazucvgmuy is naughty because it has a repeating letter with one between (odo), but no pair that appears twice.

// How many strings are nice under these new rules?


const includesDuplicatePair = str => {
    for (let i = 0; i < str.length - 1; i++) {
        for (let j = i + 2; j < str.length - 1; j++) {
            if (str[i] === str[j] && str[i + 1] === str[j + 1])
            {
                return true;
            }
        }
    }
    return false;
}

const includesDuplicateWithBetween = str => {
    for (let i = 0; i < str.length - 2; i++ ) {
        if (str[i] === str[i + 2]) return true;
    }
    return false;
}

let isNice = str => {
    return includesDuplicatePair(str) &&
        includesDuplicateWithBetween(str);
}

// let test = 'ieodomkazucvgmuy';
// console.log(includesDuplicatePair(test));
// console.log(includesDuplicateWithBetween(test));

niceStrings = strings.filter(isNice);
console.log(`Number of nice strings (bis): `, niceStrings.length);