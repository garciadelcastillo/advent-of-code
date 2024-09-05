// https://adventofcode.com/2015

import fs from 'fs';
import path, {
  parse
} from 'path';

const print = console.log;

// // GLOBAL VARS
// const input_filename = 'day19_input.txt'


// // Load input
// const __dirname =
//   import.meta.dirname;
// const input = fs.readFileSync(path.join(__dirname, input_filename), 'utf-8');
// console.log(`Number of chars loaded: `, input.length);

// const lines = input.split('\n').filter(line => line !== '')
// console.log(`Number of lines loaded: `, lines.length);


// --- Day 21: RPG Simulator 20XX ---

// Little Henry Case got a new video game for Christmas. It's an RPG, and he's stuck on a boss. He needs to know what equipment to buy at the shop. He hands you the controller.

// In this game, the player (you) and the enemy (the boss) take turns attacking. The player always goes first. Each attack reduces the opponent's hit points by at least 1. The first character at or below 0 hit points loses.

// Damage dealt by an attacker each turn is equal to the attacker's damage score minus the defender's armor score. An attacker always does at least 1 damage. So, if the attacker has a damage score of 8, and the defender has an armor score of 3, the defender loses 5 hit points. If the defender had an armor score of 300, the defender would still lose 1 hit point.

// Your damage score and armor score both start at zero. They can be increased by buying items in exchange for gold. You start with no items and have as much gold as you need. Your total damage or armor is equal to the sum of those stats from all of your items. You have 100 hit points.

// Here is what the item shop is selling:

// Weapons:    Cost  Damage  Armor
// Dagger        8     4       0
// Shortsword   10     5       0
// Warhammer    25     6       0
// Longsword    40     7       0
// Greataxe     74     8       0

// Armor:      Cost  Damage  Armor
// Leather      13     0       1
// Chainmail    31     0       2
// Splintmail   53     0       3
// Bandedmail   75     0       4
// Platemail   102     0       5

// Rings:      Cost  Damage  Armor
// Damage +1    25     1       0
// Damage +2    50     2       0
// Damage +3   100     3       0
// Defense +1   20     0       1
// Defense +2   40     0       2
// Defense +3   80     0       3

// You must buy exactly one weapon; no dual-wielding. Armor is optional, but you can't use more than one. You can buy 0-2 rings (at most one for each hand). You must use any items you buy. The shop only has one of each item, so you can't buy, for example, two rings of Damage +3.

// For example, suppose you have 8 hit points, 5 damage, and 5 armor, and that the boss has 12 hit points, 7 damage, and 2 armor:

//     The player deals 5-2 = 3 damage; the boss goes down to 9 hit points.
//     The boss deals 7-5 = 2 damage; the player goes down to 6 hit points.
//     The player deals 5-2 = 3 damage; the boss goes down to 6 hit points.
//     The boss deals 7-5 = 2 damage; the player goes down to 4 hit points.
//     The player deals 5-2 = 3 damage; the boss goes down to 3 hit points.
//     The boss deals 7-5 = 2 damage; the player goes down to 2 hit points.
//     The player deals 5-2 = 3 damage; the boss goes down to 0 hit points.

// In this scenario, the player wins! (Barely.)

// You have 100 hit points. The boss's actual stats are in your puzzle input. What is the least amount of gold you can spend and still win the fight?

const parseList = list_str => {
  return list_str
    .split('\n')
    .filter(line => line !== '')
    .map(line => {
      const p = line
        .split(' ')
        .filter(p => p !== '');
      return {
        name: p[0],
        cost: parseInt(p[1]),
        damage: parseInt(p[2]),
        armor: parseInt(p[3])
      }
    });
}

const weapons_str = `
Dagger        8     4       0
Shortsword   10     5       0
Warhammer    25     6       0
Longsword    40     7       0
Greataxe     74     8       0
`;

const armor_str = `
Leather      13     0       1
Chainmail    31     0       2
Splintmail   53     0       3
Bandedmail   75     0       4
Platemail   102     0       5
`;

const rings_str = `
Damage+1    25     1       0
Damage+2    50     2       0
Damage+3   100     3       0
Defense+1   20     0       1
Defense+2   40     0       2
Defense+3   80     0       3
`;

const weapons = parseList(weapons_str);
const armor = parseList(armor_str);
const rings = parseList(rings_str);
console.log("WEAPONS:", weapons);
console.log();
console.log("ARMOR:", armor);
console.log();
console.log("RINGS:", rings);
console.log();

// input
const boss = {
  name: 'boss',
  hits: 109,
  damage: 8,
  armor: 2
}
console.log("BOSS:", boss);
console.log();

const player = {
  name: 'player',
  hits: 100,
  damage: 0,
  armor: 0,
  cost: 0
}

// Compute all possible permutations of
// 1 weapon
// 0-1 armor
// 0-2 (different) rings
const configurations = [];
// Weapon
for (let w = 0; w < weapons.length; w++) {
  // armor
  for (let a = -1; a < armor.length; a++) {
    // ring1
    for (let r1 = -1; r1 < rings.length; r1++) {
      // ring2
      for (let r2 = -1; r2 < rings.length; r2++) {
        if (r1 != -1 && r2 != -1 && r1 == r2) continue; // don't repeat the same ring
        configurations.push([w, a, r1, r2]);
      }
    }
  }
}
console.log(configurations);
console.log("Computed configuration count:", configurations.length);



const equipPlayer = (player, configuration) => {
  let equipped = {
    ...player
  };

  // weapon
  if (configuration[0] >= 0) {
    equipped.damage += weapons[configuration[0]].damage;
    equipped.armor += weapons[configuration[0]].armor;
    equipped.cost += weapons[configuration[0]].cost;
  }
  // armor
  if (configuration[1] >= 0) {
    equipped.damage += armor[configuration[1]].damage;
    equipped.armor += armor[configuration[1]].armor;
    equipped.cost += armor[configuration[1]].cost;
  }

  // ring1
  if (configuration[2] >= 0) {
    equipped.damage += rings[configuration[2]].damage;
    equipped.armor += rings[configuration[2]].armor;
    equipped.cost += rings[configuration[2]].cost;
  }

  // ring1
  if (configuration[3] >= 0) {
    equipped.damage += rings[configuration[3]].damage;
    equipped.armor += rings[configuration[3]].armor;
    equipped.cost += rings[configuration[3]].cost;
  }

  equipped.configuration = configuration;

  return equipped;
}

// console.log(configurations[12]);
// console.log(equipPlayer(player, configurations[12]));

const strike = (a, b, log = false) => {
  const damage = Math.max(a.damage - b.armor, 1);
  b.hits -= damage;
  if (log) console.log(`${a.name} hits ${b.name} for ${damage} damage, ${b.name} has ${b.hits} hits left`);
}

const fight = (player, boss) => {
  let a = player;
  let b = boss;

  strike(a, b);
  while (b.hits > 0) {
    [a, b] = [b, a];  // swap 
    strike(a, b);
  }

  return a;
}


// // Test
// const pp = equipPlayer(player, [-1,-1,-1,-1]);
// const boss_clone = {...boss};
// console.log(pp);
// console.log(boss_clone);
// const winner = fight(pp, boss_clone);
// console.log(pp);
// console.log(boss_clone);
// console.log(winner);


let conf_cost = 10000000;
let cheapest_conf;

for (const conf of configurations) 
{
  const player_clone = equipPlayer(player, conf);
  if (player_clone.cost >= conf_cost) continue;

  const boss_clone = {...boss};

  const winner = fight(player_clone, boss_clone);
  if (winner.name == 'boss') continue;

  cheapest_conf = conf;
  conf_cost = player_clone.cost;
}

console.log("Cheapest configuration: ", cheapest_conf);
console.log("Configuration cost:", conf_cost);
console.log();



// --- Part Two ---

// Turns out the shopkeeper is working with the boss, and can persuade you to buy whatever items he wants. The other rules still apply, and he still only has one of each item.

// What is the most amount of gold you can spend and still lose the fight?

conf_cost = 0;
cheapest_conf = undefined;

for (const conf of configurations) 
{
  const player_clone = equipPlayer(player, conf);
  if (player_clone.cost <= conf_cost) continue;

  const boss_clone = {...boss};

  const winner = fight(player_clone, boss_clone);
  if (winner.name == 'player') continue;

  cheapest_conf = conf;
  conf_cost = player_clone.cost;
}

console.log("Most expensive configuration: ", cheapest_conf);
console.log("Configuration cost:", conf_cost);
console.log();