import homeProduct from './cardsdata.json';
import mixProducts from './mixProducts.json';
import socks from './socks.json'
import home3 from './homeProductData.json'
import menWomendata from './MenWomendata.json'

const allProducts = [
  ...homeProduct.map((item) => ({ ...item, type: 'home2' })),
  ...mixProducts.map((item) => ({ ...item, type: 'mix' })),
  ...socks.map((item) => ({ ...item, type: 'socks' })),
  ...home3.map((item) => ({ ...item, type: 'home1'})),
  ...menWomendata.map((item) => ({ ...item, type: 'active'})),
];

export default allProducts;
