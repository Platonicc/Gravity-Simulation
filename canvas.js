//::::::::::::::::::::: Init UI elements :::::::::::::::::::::::::
canvas = document.getElementById("screen");
c = canvas.getContext("2d");

canvas.height = window.innerHeight - 78;
canvas.width = window.innerWidth;

totalNoBodies = document.getElementById("total_bodies_text");

startBtn = document.getElementById("start_btn");
randomBtn = document.getElementById("rand_btn");
resetScreenBtn = document.getElementById("reset_screen_btn");
resetBtn = document.getElementById("reset_btn");

gInput = document.getElementById("g_const_input");
scaleInput = document.getElementById("scale_input");

minBodyInput = document.getElementById("min_no_input");
maxBodyInput = document.getElementById("max_no_input");

minMassInput = document.getElementById("min_mass_input");
maxMassInput = document.getElementById("max_mass_input");
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// :::::::::::::::::::: HELPER FUNTIONS ::::::::::::::::::::::::
getCanvasArcRadian = (degree) => Math.PI * 2 - degree * ((Math.PI * 2) / 360);
getRandom = (min, max) => min + Math.random() * (max + 1 - min);
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

var IS_RUNNING = false;

var body = [];

var G = parseFloat(gInput.value);
var SCALE = parseFloat(scaleInput.value);

var MIN_NUM = parseFloat(minBodyInput.value);
var MAX_NUM = parseFloat(maxBodyInput.value);

var MIN_MASS = parseFloat(minMassInput.value);
var MAX_MASS = parseFloat(maxMassInput.value);
//::::::::::::::::::::: Init Data Structure of our Object :::::::::::::::::::::::::
Circle = function (x, y, radius, mass) {
  this.x = x;
  this.y = y;
  this.mass = mass;
  this.velX = 0;
  this.velY = 0;
  this.radius = radius;

  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, getCanvasArcRadian(0), false);
    c.fillStyle = "green";
    c.fill();
    c.strokeStyle = "rgba(255,255,255,0.6)";
    c.stroke();
    c.fillStyle = "rgba(255,255,255,0.6)";
    c.font = "10px Serif";
    c.fillText("Mass: " + this.mass.toFixed(3), this.x - 5, this.y + 23);
    c.fillText(
      "Velocity: " +
        Math.sqrt(this.velX * this.velX + this.velY * this.velY).toFixed(3),
      this.x - 5,
      this.y + 33
    );
  };

  this.update = function () {
    for (var i = 0; i < body.length; i++) {
      var r2 =
        Math.pow(body[i].x - this.x, 2) +
        Math.pow(body[i].y - this.y, 2) * SCALE;
      if (Math.sqrt(r2) > body[i].radius + this.radius) {
        var accn = (G * body[i].mass * this.mass) / r2 / this.mass;
        accn = isNaN(accn) ? 0 : accn;
        console.log(i + " | " + accn);
        var accnX_local = (accn * (body[i].x - this.x)) / Math.sqrt(r2);
        var accnY_local = (accn * (body[i].y - this.y)) / Math.sqrt(r2);
        // if (Math.abs(body[i].x - this.x) <= 20) {
        //   this.velX = 0;
        // } else {
        this.velX = this.velX + accnX_local;
        // }
        // if (Math.abs(body[i].y - this.y) <= 20) {
        //   this.velY = 0;
        // } else {
        this.velY = this.velY + accnY_local;
        // }
      }
    }
    this.x += this.velX;
    this.y += this.velY;
    this.draw();
  };
};
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function initSimulation() {
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  requestAnimationFrame(initSimulation);
  G = parseFloat(gInput.value);
  SCALE = parseFloat(scaleInput.value);
  for (var k = 0; k < body.length; k++) {
    body[k].update();
  }
  totalNoBodies.textContent = body.length;
  console.log(G);
  console.log(SCALE);
}

function updateRandomControlValues() {
  MIN_NUM = parseFloat(minBodyInput.value);
  MAX_NUM = parseFloat(maxBodyInput.value);
  MIN_MASS = parseFloat(minMassInput.value);
  MAX_MASS = parseFloat(maxMassInput.value);
}

function generateRandomBodies() {
  updateRandomControlValues();
  for (var i = 0; i < Math.round(getRandom(MIN_NUM, MAX_NUM)); i++) {
    var obj = new Circle(
      getRandom(0, canvas.width),
      getRandom(0, canvas.height),
      10,
      MIN_MASS != MAX_MASS ? getRandom(MIN_MASS, MAX_NUM) : MIN_MASS
    );
    body.push(obj);
    obj.draw();
  }
  totalNoBodies.textContent = body.length;
}

//:::::::::::::::::::::: Event Listners :::::::::::::::::::::::::::::::::::::::::::
canvas.addEventListener("click", function (event) {
  var massInput = parseInt(prompt("Enter mass of the body in Kg:", 1));
  isNaN(massInput) ? (massInput = 1) : (massInput = massInput);
  var obj = new Circle(event.clientX, event.clientY, 10, massInput);
  body.push(obj);
  obj.draw();
  totalNoBodies.textContent = body.length;
});

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

startBtn.addEventListener("click", function () {
  if (!IS_RUNNING) {
    IS_RUNNING = true;
    initSimulation();
  }
});

randomBtn.addEventListener("click", function () {
  generateRandomBodies();
});

resetScreenBtn.addEventListener("click", function () {
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  body = [];
  totalNoBodies.textContent = body.length;
  //location.reload();
});

resetBtn.addEventListener("click", function () {
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  body = [];
  //location.reload();
  gInput.value = 6.674e-11;
  scaleInput.value = 1;
  minBodyInput.value = 2;
  maxBodyInput.value = 1000;
  minMassInput.value = 0.01;
  maxMassInput.value = 100;
  totalNoBodies.textContent = body.length;
});
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
