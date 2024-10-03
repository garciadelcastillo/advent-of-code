export let LOG = false;
const print = (msg) => {
  if (LOG) console.log(msg);
};


const spells = [
  {
    id: 0,
    name: 'missile',
    cost: 53,
    cast: (state) => {
      state.player_mana -= 53;
      print("Missile cast: boss_hits -= 4");
      state.boss_hits -= 4;
    }
  },
  {
    id: 1,
    name: 'drain',
    cost: 73,
    cast: (state) => { 
      state.player_mana -= 73;
      print("Drain cast: boss_hits -= 2, player_hits += 2");
      state.boss_hits -= 2; 
      state.player_hits += 2; 
    }
  },
  {
    id: 2,
    name: 'shield',
    cost: 113,
    cast: (state) => { 
      state.player_mana -= 113;
      state.effects.push(2); 
      state.effect_times.push(6); 
      print("Shield cast: player_armor += 7");
      state.player_armor += 7;
    },
    effect: (state) => { },
    wane: (state, log=false) => { 
      if (log) console.log("Shield is gone: player_armor -= 7");
      state.player_armor -= 7; 
    },
    log: (timer) => {
      console.log(`Shield's timer is now ${timer}`);
    }
  },
  {
    id: 3,
    name: 'poison',
    cost: 173,
    cast: (state) => {
      state.player_mana -= 173;
      state.effects.push(3); 
      state.effect_times.push(6); 
    },
    effect: (state) => {
      print("Poison effect: boss -= 3");
      state.boss_hits -= 3;
     },
     wane: (state, log=false) => { 
      if (log) console.log("Poison is gone");
    },
    log: (timer) => {
      console.log(`Poison deals 3 damage; it's timer is now ${timer}`);
    }
  },
  {
    id: 4,
    name: 'recharge',
    cost: 229,
    cast: (state) => {
      state.player_mana -= 229;
      state.effects.push(4); 
      state.effect_times.push(5); 
    },
    effect: (state) => {
      print("Recharge effect: player_mana += 101");
      state.player_mana += 101;
     },
     wane: (state, log=false) => { 
      if (log) console.log("Recharge wears off.");
    },
    log: (timer) => {
      console.log(`Recharge provides 101 mana; it's timer is now ${timer}`);
    }
  }
]

export function runEffects(state, log=false) {
  for (let i = 0; i < state.effects.length; i++) {
    const effect_id = state.effects[i];
    spells[effect_id].effect(state);
    
    // const effect_time = state.effect_times[i];
    state.effect_times[i]--;
    if (log) spells[effect_id].log(state.effect_times[i]);
    if (state.effect_times[i] == 0) {
      spells[effect_id].wane(state, log);
      state.effects.splice(i, 1);
      state.effect_times.splice(i, 1);
      i--;
      // continue;
    }
  }
}

export function castSpellRandom(state) {
  // Find random spell to cast based on current effects
  const randomSpells = [0,1,2,3,4];
  shuffle(randomSpells);

  
  let i = 4; 
  while (i > -1 
    && (state.effects.includes(randomSpells[i]) 
    || (state.player_mana - spells[randomSpells[i]].cost < 0))
    ) {
    i--;
  }
  if (i == -1) {
    // print("CANNOT CAST ANY SPELL");
    return i;
  }
  const randomSpellId = randomSpells[i];
  const spell = spells[randomSpellId];
  
  print("Casting Random Spell:", spell.name, spell.cost);
  spell.cast(state);
  // print("Mana left:", state.player_mana);

  return spell.id;
}



export function computePossibleSpells(state) {
  // No duplicate effects
  // No effects that would take your mana < 0

  const valid = [];

  for (let i = 0; i < spells.length; i++) {
    if (!state.effects.includes(i) &&
      state.player_mana - spells[i].cost >= 0) {
        valid.push(i);
      }
  }

  return valid;
}

export function castSpell(state, spell_id, log=false) {
  state.turn++;
  if (log) console.log(`Player casts ${spells[spell_id].name.toUpperCase()}.\n`);
  spells[spell_id].cast(state);
  state.history.push(spell_id);
}

/*
A turn basically is:
- Only decision-branching moment: Player plays (whatever available) spells. Game branches into all possible available spells.
- Everything now is deterministic: 
  - Spell may have an immediate effect. Victory can be checked.
  - Boss turn begins: effects take place. Victory can be checked.
  - Boss hits. Victory can be checked. 
  - Player turns begins: effects take place. Victory can be checked.
*/

export function simulateTurn(state, log=false, lose_one=false) {
  // Check game after cast spell
  if (hasWinner(state)) return hasWinner(state);

  // Boss turn begins: effects
  if (log) {
    console.log('-- Boss turn --');
    console.log(`- Player has ${state.player_hits} hit points, ${state.player_armor} armor, ${state.player_mana} mana`);
    console.log(`- Boss has ${state.boss_hits} hit points.`);
  }
  
  if (lose_one) playerLoses(state, 1);
  runEffects(state, log);
  if (hasWinner(state)) return hasWinner(state);

  // Boss turn: hits
  bossHits(state, log);
  if (hasWinner(state)) return hasWinner(state);

  if (log) {
    console.log("-- Player turn --");
    console.log(`- Player has ${state.player_hits} hit points, ${state.player_armor} armor, ${state.player_mana} mana`);
    console.log(`- Boss has ${state.boss_hits} hit points.`);
  }

  // Player turn: effects
  if (lose_one) playerLoses(state, 1);
  runEffects(state, log);
  if (hasWinner(state)) return hasWinner(state);

  return 0;
}

export function simulateGame(initial_state, spell_history) {
  // console.log("STARTING GAME SIMULATION");
  // console.log(initial_state);

  const state = cloneState(initial_state);
  console.log("-- Player turn --");
  console.log(`- Player has ${state.player_hits} hit points, ${state.player_armor} armor, ${state.player_mana} mana`);
  console.log(`- Boss has ${state.boss_hits} hit points.`);


  spell_history.forEach(si => {
    // console.log("CASTING SPELL:", spells[si].name);
    castSpell(state, si, true);
    simulateTurn(state, true);
    // console.log(state);
  });

}


export function computeGameManaSpent(state) {
  return state.history.reduce((acc, val) => acc + spells[val].cost, 0);
}










export function playerHits (state) {
  state.boss_hits -= 5;
}

export function bossHits(state, log=false) {
  const damage = Math.max(
    state.boss_damage - state.player_armor,
    1)
  state.player_hits -= damage;
  // print("Boss hit: player_hits -= " + damage);
  if (log) console.log(`Boss attacks for ${damage} damage!\n`);
}

function playerLoses(state, amount) {
  state.player_hits -= amount;
} 

function bossLoses(state, amount) {
  state.boss_hits -= amount;
}

export function hasWinner(state) {
  if (state.player_hits < 1) return 2;
  if (state.boss_hits < 1) return 1;
  return 0;
}

export function winner (state) {
  if (state.player_hits < 1) return 'boss';
  if (state.boss_hits < 1) return 'player';
  return null;
}


/**
 * Deep clones the state object and all children arrays
 * @param {*} state 
 * @returns 
 */
export function cloneState(state) {
  const clone = {...state};
  clone.effects = [...state.effects];
  clone.effect_times = [...state.effect_times];
  clone.history = [...state.history];
  return clone; 
}


function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

function range(start, end, step = 1) {
  const vals = [];
  for (let i = start; i < end; i += step) {
    vals.push(i);
  }
  return vals;
}