const fs = require('fs');

function randomBetween(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

const itemCatalog = [
  'shoes',
  'shirt',
  'sock',
  'scarf',
  'sweater',
  'sportcoat',
  'bolo tie',
];

function seedOrderData(n) {
  let orders = [];
  for (let id = 0; id < n; id++) {
    let cart = [];
    let itemCount = randomBetween(1, itemCatalog.length);
    for (let i = 0; i < itemCount; i++) {
      cart.push(itemCatalog[randomBetween(0, itemCatalog.length - 1)]);
    }
    orders.push({ id, cart });
  }
  return orders;
}

const data = seedOrderData(100);
fs.writeFileSync('./orders.json', JSON.stringify(data, null, 2));
