var expanded = false;

let card = document.getElementById("backSheet");
card.style.transform = "translateY(30%)";
card.onclick = function () {
  expand();
};

function expand() {
  if (!expanded) {
    card.style.transform = "translateY(0em)";
    expanded = true;
  } else {
    card.style.transform = "translateY(30%)";
    expanded = false;
  }
}
let card = document.getElementById("backSheet");
card.style.height = "350px";
card.style.transition = "height 300ms";
var startingX, startingY, movingX, movingY;
function touchStart(evt) {
  startingX = evt.touches[0].clientX;
  startingY = evt.touches[0].clientY;
}
function touchMove(evt) {
  movingX = evt.touches[0].clientX;
  movingY = evt.touches[0].clientY;
}
function touchEnd() {
  if (startingX + 100 < movingX) {
  } else if (startingX - 100 > movingX) {
  }

  if (startingY + 100 < movingY && expanded) {
    console.log("down");
    expanded = false;
    card.style.height = "350px";
  } else if (startingY - 100 > movingY && !expanded) {
    onsole.log("up");
    card.style.height = "640px";
    expanded = true;
  }
}
