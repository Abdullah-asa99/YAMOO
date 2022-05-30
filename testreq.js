const connectButton = document.getElementById("connect");
connectButton.addEventListener("click", sendtrans());

async function sendtrans() {
  const axios = require("axios");
  const res = await axios.post("http://localhost:3000/transact", {
    // `proxy` means the request actually goes to the server listening
    // on localhost:3000, but the request says it is meant for
    // 'http://httpbin.org/get?answer=42'
    data: {
      temporary: "555888",
      temporaryy: "555888sdf",
    },
    headers: {
      "Access-Control-Allow-Origin": "localhost:3000",
      "Content-Type": "application/json",
      
    },
    proxy: {
      host: "localhost",
      port: 6600,
    },
  });
  console.log(res.data);
}
