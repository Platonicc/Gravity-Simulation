//::::::::::::::::::::: Init UI elements :::::::::::::::::::::::::
canvas = document.getElementById("screen");
c = canvas.getContext("2d");

canvas.height = window.innerHeight - 78;
canvas.width = window.innerWidth;

startBtn = document.getElementById("start_btn");
resetBtn = document.getElementById("reset_btn");
gInput = document.getElementById("g_const_input");
randomBtn = document.getElementById("rand_btn");
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// :::::::::::::::::::: HELPER FUNTIONS ::::::::::::::::::::::::
getCanvasArcRadian = (degree) => Math.PI * 2 - degree * ((Math.PI * 2) / 360);
getRandom = (min, max) => min + Math.random() * (max + 1 - min);
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

var body = [];
var G = gInput.value;
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
        Math.pow(body[i].x - this.x, 2) + Math.pow(body[i].y - this.y, 2);
      if (Math.sqrt(r2) > body[i].radius + this.radius) {
        var accn = (G * body[i].mass) / r2;
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
  G = gInput.value;
  console.log(G);
  for (var k = 0; k < body.length; k++) {
    body[k].update();
  }
}

function generateRandomBodies() {
  for (var i = 0; i < Math.round(getRandom(30, 1000)); i++) {
    var obj = new Circle(
      getRandom(0, canvas.width),
      getRandom(0, canvas.height),
      10,
      getRandom(0.01, 100)
    );
    body.push(obj);
    obj.draw();
  }
}

//:::::::::::::::::::::: Event Listners :::::::::::::::::::::::::::::::::::::::::::
canvas.addEventListener("click", function (event) {
  var massInput = parseInt(prompt("Enter mass of the body in Kg:", 1));
  isNaN(massInput) ? (massInput = 1) : (massInput = massInput);
  var obj = new Circle(event.clientX, event.clientY, 10, massInput);
  body.push(obj);
  obj.draw();
  console.log(body);
});

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

startBtn.addEventListener("click", function () {
  initSimulation();
});

resetBtn.addEventListener("click", function () {
  location.reload();
  gInput.value = 6.674e-11;
});

gInput.addEventListener("change", function () {
  G = parseFloat(gInput.value);
});

randomBtn.addEventListener("click", function () {
  generateRandomBodies();
});
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
