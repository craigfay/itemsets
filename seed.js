const fs = require('fs');
const itemCatalog = require('./catalog')

function randomBetween(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function seedOrderData(n) {
  let orders = [];
  for (let id = 0; id < n; id++) {
    let cart = [];
    let unselectedItems = [...itemCatalog];
    let itemCount = randomBetween(1, unselectedItems.length);
    for (let i = 0; i < itemCount; i++) {
      let chosenIndex = randomBetween(0, unselectedItems.length - 1);
      cart.push(unselectedItems[chosenIndex]);
      unselectedItems.splice(chosenIndex, 1);
    }
    orders.push({ id, cart });
  }
  return orders;
}

const data = seedOrderData(100);
fs.writeFileSync('./orders.json', JSON.stringify(data, null, 2));
