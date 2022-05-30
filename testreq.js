const connectButton = document.getElementById("connect");
connectButton.addEventListener("click", sendtrans);


function sendtrans() {
 /*  var shell = require('shelljs'); */
  var child_process = require("child_process");


  var protractor = child_process.spawn('protractor', ['./sendreq.js'], {shell: true});


  console.log("we ran");
}
