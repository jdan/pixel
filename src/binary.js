exports.createBitString = (length) => Array.from({ length }).map((_) => 0);
exports.inc = (b) => {
  let carry = 1;
  for (let i = 0; carry === 1 && i < b.length; i++) {
    b[i]++;
    if (b[i] === 2) {
      b[i] = 0;
      carry = 1;
    } else {
      carry = 0;
    }
  }
  return b;
};
exports.addLeft = (a, b) => {
  let carry = 0;
  for (let i = 0; i < a.length; i++) {
    a[i] += b[i] + carry;
    if (a[i] >= 2) {
      a[i] -= 2;
      carry = 1;
    } else {
      carry = 0;
    }
  }
  return a;
};
exports.double = (b) => {
  let prev = 0;
  for (let i = 0; i < b.length; i++) {
    let tmp = b[i];
    b[i] = prev;
    prev = tmp;
  }
  return b;
};
exports.halve = (b) => {
  for (let i = 0; i < b.length - 1; i++) {
    b[i] = b[i + 1];
  }
  b[b.length - 1] = 0;
  return b;
};
exports.isOne = (b) => {
  return b[0] === 1 && b.filter((i) => i === 1).length === 1;
};
exports.isZero = (b) => {
  return b.filter((i) => i !== 0).length === 0;
};
