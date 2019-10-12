// Given an itemset, determine the most common permutatation that contains it

const { orders } = require('./orders.local');
const multiItemOrders = orders().filter(order => order.length > 1);

// Does b contain every item that a contains?
function isSubset(a, b) {
  for (item of a) {
    if (!b.includes(item)) return false;
  }
  return true;
}

// Determine the child array that occurs most commonly in a parent array
function mode(list){
  return list.sort((a,b) =>
    list.filter(v => isEqual(v, a)).length
    - list.filter(v => isEqual(v, b)).length
  ).pop();
}

// Are lists a and b equal?
function isEqual(a, b) {
  return a.length == b.length && isSubset(a, b);
}

function occurences(itemset) {
  let count = 0;
  for (const order of multiItemOrders) {
    if (isEqual(itemset, order)) count++;
  }
  return count;
}

function itemsetProbability(itemset) {
  let count = occurences(itemset);
  return count / multiItemOrders.length;
}

const mostPopular = multiItemOrders.sort((a, b) => {
  let probabilityOfA = itemsetProbability(a);
  let probabilityOfB = itemsetProbability(b);
  if (probabilityOfA > probabilityOfB) return -1;
  if (probabilityOfA < probabilityOfB) return +1;
  return 0;
});

function recommendItems(cart) {
  const relevantCarts = mostPopular.filter(popular => isSubset(cart, popular));
  const [highestRated] = relevantCarts;
  return highestRated;
}
