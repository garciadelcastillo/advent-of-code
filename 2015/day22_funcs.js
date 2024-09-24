const spells = [
  {
    id: 0,
    name: 'missile',
    cost: 53,
    cast: (state) => { 
      state.player_mana -= 53;
      console.log("Missile cast: boss_hits -= 4");
      state.boss_hits -= 4;
    }
  },
  {
    id: 1,
    name: 'drain',
    cost: 73,
    cast: (state) => { 
      state.player_mana -= 73;
      console.log("Drain cast: boss_hits -= 2, player_hits += 2");
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
      console.log("Shield cast: player_armor += 7");
      state.player_armor += 7;
    },
    effect: (state) => { },
    wane: (state) => { 
      console.log("Shield is gone: player_armor -= 7");
      state.player_armor -= 7; 
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
      console.log("Poison effect: boss -= 3");
      state.boss_hits -= 3;
     },
    wane: (state) => { 
      console.log("Poison is gone");
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
      console.log("Recharge effect: player_mana += 101");
      state.player_mana += 101;
     },
    wane: (state) => {
      console.log("Recharge is gone");
     }
  }
]

export function runEffects(state) {
  for (let i = 0; i < state.effects.length; i++) {
    const effect_id = state.effects[i];
    spells[effect_id].effect(state);
    
    const effect_time = state.effect_times[i];
    state.effect_times[i]--;
    if (effect_time == 0) {
      spells[effect_id].wane(state);
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
    // console.log("CANNOT CAST ANY SPELL");
    return i;
  }
  const randomSpellId = randomSpells[i];
  const spell = spells[randomSpellId];
  
  console.log("Casting Random Spell:", spell.name, spell.cost);
  spell.cast(state);
  // console.log("Mana left:", state.player_mana);

  return spell.id;
}

export function playerHits (state) {
  state.boss_hits -= 5;
}

export function bossHits(state) {
  const damage = Math.max(
    state.boss_damage - state.player_armor,
    1)
  state.player_hits -= damage;
  console.log("Boss hit: player_hits -= " + damage);
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
