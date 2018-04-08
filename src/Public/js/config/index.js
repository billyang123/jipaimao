import centerMenuList from './centerMenuList.js'
const priceInc = {
  '10': [1, 1000],
  '100': [1000, 5000],
  '250': [5000, 10000],
  '500': [10000, 50000],
  '1000': [50000, -1]
}
module.exports = {
  centerMenuList,
  priceInc
}
