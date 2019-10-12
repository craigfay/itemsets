const fetch = require('node-fetch');
const { endpoint } = require('./secrets');

// Pagination in Shopify admin API requests is strange.
// A link to the next page is included in the response headers,
// But must be parsed, because the syntax is unusual.
// https://help.shopify.com/en/api/guides/paginated-rest-results
function formatLinkHeader(link) {
  return link
  .split(' ')[0]
  .replace('<', '')
  .replace('>', '')
  .replace(';', '')
}

// The parsed next page link does not contain the proper credentials
function replaceLinkHeaderBaseUrl(link) {
  return endpoint + '?' + link.split('?').pop();
}

// Format an order object as an array of product ids
function format(order) {
  const ids = order.line_items.map(li => li.product_id);
  const unique = ids.filter((id, index) => ids.indexOf(id) == index);
  return unique;
}

// Get an array of recent order data
// Each order is an array of product ids that were purchased
async function retrieve(pages=1) {
  let data = [];
  let remainingPages = pages;

  return new Promise(async (resolve, reject) => {
    const fetchNewPage = async url => {
      const response = await fetch(url);
      const json = await response.json();
      if (!json || !json.orders) resolve(data);
      const formattedOrders = json.orders.map(format);
      formattedOrders.forEach(o => data.push(o))
      let link = response.headers.get('link');
      const [previous, next] = link.split(', ');
      if (next) link = next;
      remainingPages--;
      
      if (remainingPages && link) {
        const linkUrl = formatLinkHeader(link);
        const linkUrlWithCredentials = replaceLinkHeaderBaseUrl(linkUrl);
        fetchNewPage(linkUrlWithCredentials);
      } else {
        resolve(data);
      }
    }
    fetchNewPage(endpoint);
  })
}

module.exports = { retrieve };
