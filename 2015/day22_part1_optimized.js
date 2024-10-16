// https://adventofcode.com/2015

import fs from 'fs';
import path, {
  parse
} from 'path';

const LOG = false;
const print = (msg) => {
  if (LOG) console.log(msg);
};


// // GLOBAL VARS
// const input_filename = 'day19_input.txt'


// // Load input
// const __dirname =
//   import.meta.dirname;
// const input = fs.readFileSync(path.join(__dirname, input_filename), 'utf-8');
// console.log(`Number of chars loaded: `, input.length);

// const lines = input.split('\n').filter(line => line !== '')
// console.log(`Number of lines loaded: `, lines.length);




// --- Day 22: Wizard Simulator 20XX ---

// Little Henry Case decides that defeating bosses with swords and stuff is boring. Now he's playing the game with a wizard. Of course, he gets stuck on another boss and needs your help again.

// In this version, combat still proceeds with the player and the boss taking alternating turns. The player still goes first. Now, however, you don't get any equipment; instead, you must choose one of your spells to cast. The first character at or below 0 hit points loses.

// Since you're a wizard, you don't get to wear armor, and you can't attack normally. However, since you do magic damage, your opponent's armor is ignored, and so the boss effectively has zero armor as well. As before, if armor (from a spell, in this case) would reduce damage below 1, it becomes 1 instead - that is, the boss' attacks always deal at least 1 damage.

// On each of your turns, you must select one of your spells to cast. If you cannot afford to cast any spell, you lose. Spells cost mana; you start with 500 mana, but have no maximum limit. You must have enough mana to cast a spell, and its cost is immediately deducted when you cast it. Your spells are Magic Missile, Drain, Shield, Poison, and Recharge.

//     Magic Missile costs 53 mana. It instantly does 4 damage.
//     Drain costs 73 mana. It instantly does 2 damage and heals you for 2 hit points.
//     Shield costs 113 mana. It starts an effect that lasts for 6 turns. While it is active, your armor is increased by 7.
//     Poison costs 173 mana. It starts an effect that lasts for 6 turns. At the start of each turn while it is active, it deals the boss 3 damage.
//     Recharge costs 229 mana. It starts an effect that lasts for 5 turns. At the start of each turn while it is active, it gives you 101 new mana.

// Effects all work the same way. Effects apply at the start of both the player's turns and the boss' turns. Effects are created with a timer (the number of turns they last); at the start of each turn, after they apply any effect they have, their timer is decreased by one. If this decreases the timer to zero, the effect ends. You cannot cast a spell that would start an effect which is already active. However, effects can be started on the same turn they end.

// For example, suppose the player has 10 hit points and 250 mana, and that the boss has 13 hit points and 8 damage:

// -- Player turn --
// - Player has 10 hit points, 0 armor, 250 mana
// - Boss has 13 hit points
// Player casts Poison.

// -- Boss turn --
// - Player has 10 hit points, 0 armor, 77 mana
// - Boss has 13 hit points
// Poison deals 3 damage; its timer is now 5.
// Boss attacks for 8 damage.

// -- Player turn --
// - Player has 2 hit points, 0 armor, 77 mana
// - Boss has 10 hit points
// Poison deals 3 damage; its timer is now 4.
// Player casts Magic Missile, dealing 4 damage.

// -- Boss turn --
// - Player has 2 hit points, 0 armor, 24 mana
// - Boss has 3 hit points
// Poison deals 3 damage. This kills the boss, and the player wins.

// Now, suppose the same initial conditions, except that the boss has 14 hit points instead:

// -- Player turn --
// - Player has 10 hit points, 0 armor, 250 mana
// - Boss has 14 hit points
// Player casts Recharge.

// -- Boss turn --
// - Player has 10 hit points, 0 armor, 21 mana
// - Boss has 14 hit points
// Recharge provides 101 mana; its timer is now 4.
// Boss attacks for 8 damage!

// -- Player turn --
// - Player has 2 hit points, 0 armor, 122 mana
// - Boss has 14 hit points
// Recharge provides 101 mana; its timer is now 3.
// Player casts Shield, increasing armor by 7.

// -- Boss turn --
// - Player has 2 hit points, 7 armor, 110 mana
// - Boss has 14 hit points
// Shield's timer is now 5.
// Recharge provides 101 mana; its timer is now 2.
// Boss attacks for 8 - 7 = 1 damage!

// -- Player turn --
// - Player has 1 hit point, 7 armor, 211 mana
// - Boss has 14 hit points
// Shield's timer is now 4.
// Recharge provides 101 mana; its timer is now 1.
// Player casts Drain, dealing 2 damage, and healing 2 hit points.

// -- Boss turn --
// - Player has 3 hit points, 7 armor, 239 mana
// - Boss has 12 hit points
// Shield's timer is now 3.
// Recharge provides 101 mana; its timer is now 0.
// Recharge wears off.
// Boss attacks for 8 - 7 = 1 damage!

// -- Player turn --
// - Player has 2 hit points, 7 armor, 340 mana
// - Boss has 12 hit points
// Shield's timer is now 2.
// Player casts Poison.

// -- Boss turn --
// - Player has 2 hit points, 7 armor, 167 mana
// - Boss has 12 hit points
// Shield's timer is now 1.
// Poison deals 3 damage; its timer is now 5.
// Boss attacks for 8 - 7 = 1 damage!

// -- Player turn --
// - Player has 1 hit point, 7 armor, 167 mana
// - Boss has 9 hit points
// Shield's timer is now 0.
// Shield wears off, decreasing armor by 7.
// Poison deals 3 damage; its timer is now 4.
// Player casts Magic Missile, dealing 4 damage.

// -- Boss turn --
// - Player has 1 hit point, 0 armor, 114 mana
// - Boss has 2 hit points
// Poison deals 3 damage. This kills the boss, and the player wins.

// You start with 50 hit points and 500 mana points. The boss's actual stats are in your puzzle input. What is the least amount of mana you can spend and still win the fight? (Do not include mana recharge effects as "spending" negative mana.)


// Input
// Hit Points: 58
// Damage: 9

/* JLX takeaways
- If you cannot cast a spell, you lose. 
- No duplicate effects
- Although an effect can be started same turn one ended
 */




//// QUICK TEST WITH RANDOM SPELLING

// import * as game from './day22_funcs.js';

// const initialState = {
//   turn: 0,
//   player_hits: 50,
//   player_mana: 500,
//   player_armor: 0,
//   boss_hits: 58,
//   boss_damage: 9,
//   effects: [],
//   effect_times: [] 
// };
// print(initialState);

// const state_history = [initialState];
// const spell_history = [];
// const winner_games = [];

// let winner = null;
// const applyTurn = () => {
//   const state = game.cloneState(state_history[state_history.length - 1]);
  
//   // PLAYER
//   print('PLAYER');
//   state.turn += 0.5;

//   // Run effects
//   game.runEffects(state);

//   // Player action: cast spells
//   const castSpell = game.castSpellRandom(state);
//   if (castSpell === -1) {
//     print("NO SPELL TO CAST");
//     winner = 'boss'
//     return false;
//   }
//   spell_history.push(castSpell);

//   print(state);
//   print();

//   // Check game
//   if (game.hasWinner(state)) {
//     winner = game.winner(state);
//     return false;
//   }

  
//   // BOSS
//   print("BOSS");
//   state.turn += 0.5;

//   // Run effects
//   game.runEffects(state);

//   // Boss action: hit
//   game.bossHits(state);
  
//   // Check game
//   if (game.hasWinner(state)) {
//     winner = game.winner(state);
//     return false;
//   }
  
  
//   // If game is still on, add state and move on
//   print(state);
//   print();
//   state_history.push(state);

//   return true;
// }


// let i = 0;
// while (i++ < 100 && winner == null) {
//   // print(`Turn:`, i);
//   applyTurn()
// }

// console.log("WINNER: " + winner);
// console.log(spell_history);









/*
A turn basically is:
- Only decision-branching moment: Player plays (whatever available) spells. Game branches into all possible available spells.
- Everything now is deterministic: 
  - Spell may have an immediate effect. Victory can be checked.
  - Boss turn begins: effects take place. Victory can be checked.
  - Boss hits. Victory can be checked. 
  - Player turns begins: effects take place. Victory can be checked.
*/

import * as game from './day22_funcs.js';



// OPTIMIZED VERSION:
// Uses most optimal mana cost to optimize tree search:
// it resolves in a couple seconds! 😅

const initialState = {
  turn: 0,
  player_hits: 50,
  player_mana: 500,
  player_armor: 0,
  boss_hits: 58,
  boss_damage: 9,
  spent_mana: 0,
  effects: [],
  effect_times: [],
  history: [],
};



const pending_states = [initialState];
let min_mana = Number.MAX_VALUE;
let best_game;
let it = 0
while (pending_states.length > 0 
  ) {
  const last_state = pending_states.pop();

  const possible_spells = game.computePossibleSpells(last_state, min_mana);

  possible_spells.forEach(spell_id => {
    const state = game.cloneState(last_state);
    game.castSpell(state, spell_id);
    const result = game.simulateTurn(state);
    switch(result) {
      case 2: 
        // Boss wins: end this branch
        break;
      case 1:
        // Player wins
        if (state.spent_mana < min_mana) {
          best_game = state;
          min_mana = state.spent_mana;
        }
        break;
      case 0: 
        // No winner yet
        pending_states.push(state);
        break;
    }
  });

  it++;
}

console.log("Computed iterations:", it);
console.log("Pending states:", pending_states.length);
console.log("Best winning game:", best_game);
console.log("Best game mana spent:", min_mana);
console.log();

// Cheapest game found was 1269 mana for [3, 4, 2, 3, 4, 1, 3, 0, 0]