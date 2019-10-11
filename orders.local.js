const fs = require('fs');
const util = require('util');
const { retrieve } = require('./orders.remote');
const datafile = __dirname + '/orders.json';
const write = util.promisify(fs.writeFile);

let data = JSON.parse(fs.readFileSync(datafile, 'utf8'));

// Generate a fresh local copy of recent order data
async function refresh() {
  const pages = 50;
  const orders = await retrieve(pages);
  await write(datafile, JSON.stringify(orders, null, 2));
  data = orders;
}

function orders() {
  return data;
}

module.exports = { refresh, orders };
