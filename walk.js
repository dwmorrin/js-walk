const width = 1000;
const height = 600;
const segments = 4;

const rand = (min, max) => Math.floor(Math.random() * max) + min;
const coinToss = () => rand(0, 2) == 0;
const randV = (min, max) => rand(min, max) * (coinToss() ? 1 : -1);

class WanderingVector {
  constructor(x, y, width, height) {
    this.x0 = width / 2;
    this.y0 = height / 2;
    this.x1 = x;
    this.y1 = y;
    this.width = width;
    this.height = height;
    this.wander();
  }

  wander() {
    this.dominate = coinToss() ? 'x' : 'y';
    this.direction = coinToss() ? 1 : -1;
    this.min = rand(15, 60);
    this.max = rand(70, 150);
  }

  keepInBounds() {
    if (this.x1 <= 0) {
      this.x1 = 20;
      if (this.dominate === 'x' && this.direction === -1)
        this.direction = 1;
    } else if (this.x1 >= this.width) {
      this.x1 = this.width - 20;
      if (this.dominate === 'x' && this.direction === 1)
        this.direction = -1;
    }

    if (this.y1 <= 0) {
      this.y1 = 20;
      if (this.dominate === 'y' && this.direction === -1)
        this.direction = 1;
    } else if (this.y1 >= this.height) {
      this.y1 = this.height - 20;
      if (this.dominate === 'y' && this.direction === 1)
        this.direction = -1;
    }
  }

  forward() {
    return rand(this.min, this.max) * this.direction;
  }

  side() {
    return randV(this.min / rand(1, 4), this.max / rand(1, 4));
  }

  walk() {
    this.x0 = this.x1;
    this.y0 = this.y1;
    this.x1 += this.dominate === 'x' ? this.forward() : this.side();
    this.y1 += this.dominate === 'y' ? this.forward() : this.side();
    this.keepInBounds();
  }

  get start() {
    return [this.x0, this.y0];
  }

  get end() {
    return [this.x1, this.y1];
  }

}

const canvas = document.querySelector("canvas");
const speedCtrl = document.querySelector('input[type="range"]');
const blankingCtrl = document.querySelector('input[type="checkbox"]');

if (!canvas || !speedCtrl || !blankingCtrl) throw new Error("missing HTML");

const ctx = canvas.getContext("2d");

function blank() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);
}

function dot(x, y, color = "white") {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function line(x0, y0, x1, y1, color = "white") {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.strokeStyle = color;
  ctx.stroke();
}

function makeWalk() {
  // initialize; create closure
  const vector = new WanderingVector(width / 2, height / 2, width, height, ctx);
  blank();
  dot(...vector.start, "red");
  let count = 0;

  const walk = () => {
    let color = "white";
    // change dominate direction every 5th; mark it with a red dot
    ++count;
    if (count === segments + 1) {
      // reset and pause (don't walk here)
      count = 0;
      color = "red";
      if (blankingCtrl.checked)
        blank();
      vector.wander();
    } else {
      // mark the ends in red
      if (count === segments)
        color = "red";
      vector.walk();
      line(...vector.start, ...vector.end);
    }
    dot(...vector.end, color);
    setTimeout(walk, +speedCtrl.value)
  }
  return walk;
}

setTimeout(makeWalk(), +speedCtrl.value)