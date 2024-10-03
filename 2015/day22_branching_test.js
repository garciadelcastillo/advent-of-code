// A quick test to compute all possible branches
// of a depth-first search, with no recursion.

Array.prototype.sum = function() {
  return this.reduce((acc, val) => acc + val, 0);  
}

Array.prototype.contains = function(elem) {
  return this.findIndex(v => v === elem) != -1;
}

const pending = [];
const done = [];

for (let i = 0; i < 10; i++) {
  pending.push([i])
}

const MAX = 20;
const return_options = state => {
  // Rules for valid options:
  // - Values from [0, 9]
  // - No consecutive even/odd
  // - No total beyond 20
  // - No longer than 10 items
  // - No repeated digits

  if (state.length > 10) return [];

  const sum = state.sum();
  const base = ((state[state.length - 1] % 2) + 1) % 2
  const opts = [];
  for (let i = base; i < 10; i += 2) {
    if (!state.contains(i) && sum + i < MAX) opts.push(i)
  }

  return opts;
}

let it = 0;
while (pending.length > 0 && it++ < 10000) {
  const last = pending.pop();
  const options = return_options(last);
  if (options.length > 0) {
    options.forEach(opt => {
      const branch = [...last, opt];
      pending.push(branch);
    })
  } else {
    done.push(last);
  }
}

console.log("Compute iterations:", it);
console.log("computed valid branches:", done.length);
console.log("pending branches:", pending.length);

// console.log(done.slice(0, 10));
// console.log(done);
// console.log(pending);

