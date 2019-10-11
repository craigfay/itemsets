// Given an itemset, determine the most common permutatation that contains it
const fs = require('fs')

const rawData = fs.readFileSync('./orders.json')
const orders = JSON.parse(rawData);
const carts = orders.map(order => order.cart);

// Does b contain every item that a contains?
function isSubset(a, b) {
  for (item of a) {
    if (!b.includes(item)) return false;
  }
  return true;
}

function mode(list){
  return list.sort((a,b) =>
        list.filter(v => isEqual(v, a)).length
      - list.filter(v => isEqual(v, b)).length
  ).pop();
}

// Are lists a and b equal?
function isEqual(a, b) {
  return isSubset(a, b) && isSubset(b, a);
}

function itemsetProbability(itemset) {
  let occurences = 0;
  for (const cart of carts) {
    if (isEqual(itemset, cart)) occurences++;
  }
  return occurences / carts.length;
}

const mostPopular = carts.sort((a, b) => {
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
