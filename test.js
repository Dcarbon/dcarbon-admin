const Big = require('big.js');

const total = Big(0);

const a = [1.2, 3.5, 4.2, 5, 2];

a.forEach((item) => {
  total.push(Big(item));
});
console.log(total);
