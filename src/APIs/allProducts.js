import homeProduct from './cardsdata.json';
import mixProducts from './mixProducts.json';
import socks from './socks.json'
import home3 from './homeProductData.json'

const allProducts = [
  ...homeProduct.map((item) => ({ ...item, type: 'home2' })),
  ...mixProducts.map((item) => ({ ...item, type: 'mix' })),
  ...socks.map((item) => ({ ...item, type: 'socks' })),
  ...home3.map((item) => ({ ...item, type: 'home1'}))
];

export default allProducts;
