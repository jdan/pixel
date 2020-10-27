exports.dot = (x, y) => {
  let t = new Date() / 1000;
  return x === Math.floor(Math.sin(t * 2) * 16 + 16) &&
    y === Math.floor(Math.cos(t * 2) * 16 + 16)
    ? [255, 255, 255]
    : [0, 0, 0];
};

exports.gradient = (x, y) => {
  return [Math.floor((255 * x) / 32), 0, Math.floor((255 * y) / 32)];
};

exports.mandel = (x, y) => {
  let t = new Date() / 1000;

  // a + bi
  let a = (x / 32) * 3.5 - 2.35;
  let b = (y / 32) * 3.5 - 1.75;

  let a0 = a;
  let b0 = b;

  let h = 0;
  const MAX = 20;
  for (let i = 0; i < MAX; i++) {
    let a_ = a * a - b * b;
    let b_ = 2 * a * b;

    a = a_ + a0;
    b = b_ + b0;

    if (Math.sqrt(a * a + b * b) > 4) {
      break;
    }

    h += 1;
  }

  let c = Math.floor(Math.sqrt(h / MAX) * 255);
  return [c, c, c];
};
