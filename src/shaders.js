let binary = require("./binary");

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

exports.hues = (px, py, t) => {
  let x_ = px - 16;
  let y_ = py - 16;

  // https://www.rapidtables.com/convert/color/hsv-to-rgb.html
  let v = 1;
  let s = Math.sqrt(x_ * x_ + y_ * y_) / (16 * Math.sqrt(2));
  let h = (Math.atan2(y_, x_) / Math.PI) * 180 + 180;

  h = (h + +t / 10) % 360;

  let c = v * s;
  let x = s * (1 - Math.abs(((h / 60) % 2) - 1));
  let m = v - c;

  if (h <= 60) {
    return [(c + m) * 255, (x + m) * 255, m * 255];
  } else if (h <= 120) {
    return [(x + m) * 255, (c + m) * 255, m * 255];
  } else if (h <= 180) {
    return [m * 255, (c + m) * 255, (x + m) * 255];
  } else if (h <= 240) {
    return [m * 255, (x + m) * 255, (c + m) * 255];
  } else if (h <= 300) {
    return [(x + m) * 255, m * 255, (c + m) * 255];
  } else {
    return [(c + m) * 255, m * 255, (x + m) * 255];
  }
};

let collatz = (x, y, _, buffer) => {
  return buffer.currentValue[32 * y + x] ? [255, 255, 255] : [0, 0, 0];
};

collatz.getInitialBuffer = () => {
  let initialValue = binary.createBitString(32 * 32);
  initialValue[0] = 1;
  return {
    initialValue,
    currentValue: [...initialValue],
  };
};

collatz.onFinish = (buffer) => {
  if (binary.isOne(buffer.currentValue)) {
    binary.inc(buffer.initialValue);
    buffer.currentValue = [...buffer.initialValue];
  } else if (buffer.currentValue[0] === 0) {
    binary.halve(buffer.currentValue);
  } else {
    let n = [...buffer.currentValue];
    binary.double(buffer.currentValue);
    binary.addLeft(buffer.currentValue, n);
    binary.inc(buffer.currentValue);
  }
};

exports.collatz = collatz;

let linearTween = (min, max, value) => {
  return value * (max - min) + min;
};

exports.makeGradientShader = ({ from, to, angle = 0 }) => (x, y, t) => {
  // We'll place the gradient along the equation of the circle
  // encompassing the entire screen
  let r = 16 * Math.sqrt(2);

  let x_ = x - 16;
  let y_ = y - 16;
  let px = r * Math.cos(Math.PI + angle);
  let py = r * Math.sin(Math.PI + angle);

  let dx = x_ - px;
  let dy = y_ - py;

  let theta = Math.atan2(dy, dx) - angle;
  let distanceAlongAxis =
    (Math.sqrt(dx * dx + dy * dy) * Math.cos(theta)) / (2 * r);

  // Animate along the axis
  distanceAlongAxis = (distanceAlongAxis + t / 2000) % 1;

  // Linearly interpolate from `a` to `b`, then back to `a` so we can loop
  return [0, 1, 2].map((i) => {
    if (distanceAlongAxis < 0.5) {
      return Math.floor(linearTween(from[i], to[i], 2 * distanceAlongAxis));
    } else {
      return Math.floor(
        linearTween(to[i], from[i], 2 * (distanceAlongAxis - 0.5))
      );
    }
  });
};

exports.makeSpriteShader = ({ pattern, colors }) => (x, y) => {
  if (y >= pattern.length) {
    return null;
  } else if (x >= pattern[y].length) {
    return null;
  } else if (pattern[y][x] === " ") {
    return null;
  } else {
    return colors[parseInt(pattern[y][x])];
  }
};

exports.translateShader = ({ shader, x, y }) => (inX, inY, ...rest) => {
  let newX = (inX - x + 32) % 32;
  let newY = (inY - y + 32) % 32;
  return shader(newX, newY, ...rest);
};

// Unfortunately `shader.getInitialBuffer` and `shader.onFinish`
// won't be preserved during this
exports.combineShaders = ({ bottom, top }) => (x, y, ...rest) =>
  top(x, y, ...rest) || bottom(x, y, ...rest);

exports.chess = require("./chess").chess;
