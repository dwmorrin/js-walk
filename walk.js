const width = 1000;
const height = 600;

const rand = (min, max) => Math.floor(Math.random() * max) + min;
const coinToss = () => rand(0, 2) == 0;
const randV = (min, max) => rand(min, max) * (coinToss() ? 1 : -1);

class Vector {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.turn();
  }

  turn() {
    this.dominate = coinToss() ? 'x' : 'y';
    this.direction = coinToss() ? 1 : -1;
    this.min = rand(15, 60);
    this.max = rand(70, 150);
  }

  normalize() {
    if (this.x <= 0) {
      this.x = 10;
    } else if (this.x >= this.width) {
      this.x = this.width - 10;
    }

    if (this.y <= 0) {
      this.y = 10;
    } else if (this.y >= this.height) {
      this.y = this.height - 10;
    }
  }

  forward() {
    return rand(this.min, this.max) * this.direction;
  }

  side() {
    return randV(this.min/3, this.max/3);
  }

  walk() {
    this.x += this.dominate === 'x' ? this.forward() : this.side();
    this.y += this.dominate === 'y' ? this.forward() : this.side();
    this.normalize();
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

function dot(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
}

function makeWalk() {
  // initialize; create closure
  ctx.fillStyle = "red";
  const vector = new Vector(width / 2, height / 2, width, height);
  dot(vector.x, vector.y);
  let count = 0;

  const walk = () => {
    ctx.beginPath();
    ctx.moveTo(vector.x, vector.y);
    vector.walk();
    ctx.lineTo(vector.x, vector.y);
    ctx.strokeStyle = "white";
    ctx.stroke();
    if (++count % 4 === 0) {
      count = 0;
      vector.turn();
      if (blankingCtrl.checked)
        blank();
      ctx.fillStyle = "red";
    }
    else
      ctx.fillStyle = "white";
    dot(vector.x, vector.y);
    setTimeout(walk, +speedCtrl.value)
  }
  return walk;
}

blank();
setTimeout(makeWalk(), +speedCtrl.value)