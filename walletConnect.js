var account;
var btnContent;
var ItemID;
var ownerKey = "";
var transactionData;

/* import { crypto }  from "crypto";
import * as fs from "fs";
import { Buffer } from "buffer";
 */

console.log("in wallet connect");

document.getElementById("walletbtn").addEventListener("click", connectWC);
document.getElementById("buy-btn").addEventListener("click", SendTransaction);

/* function displayDate() {
  console.log(" wallet clicked");
  document.getElementById("Address").innerHTML = Date();
} */

//get Item ID from URL
const currentURL = new URL(location.href);
//console.log(currentURL);
var ItemID = currentURL.searchParams.get("itemID");

var fetchBlockchain = async () => {
  await fetch("./pbft/blockchain.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (resp) {
      for (var blockNum = 1; blockNum < resp.length; blockNum++) {
        //for each transaction in the block
        for (
          var transactionNum = 0;
          transactionNum < resp[blockNum]["data"].length;
          transactionNum++
        ) {
          var data =
            resp[blockNum]["data"][transactionNum]["input"]["data"]["data"];
          //console.log(data["ID"]);

          //if the itemID from URL is id from blockchain
          if (data["ID"] == ItemID) {
            ownerKey = data["owner"];
            transactionData = data;
            return ownerKey;
          }
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
  console.log("inside fetch");
  console.log(ownerKey);
  console.log(ItemID);
};

// https://docs.walletconnect.com/quick-start/dapps/web3-provider
var provider = new WalletConnectProvider.default({
  rpc: {
    1: "https://cloudflare-eth.com/", // https://ethereumnodes.com/
    137: "https://polygon-rpc.com/", // https://docs.polygon.technology/docs/develop/network-details/network/
    // ...
  },
  // bridge: 'https://bridge.walletconnect.org',
});

async function connectWC() {
  await fetchBlockchain();
  await provider.enable();

  //  Create Web3 instance
  const web3 = new Web3(provider);
  window.w3 = web3;

  var accounts = await web3.eth.getAccounts(); // get all connected accounts
  account = accounts[0]; // get the primary account
  var walletbtn = document.getElementById("walletbtn");
  walletbtn.onclick = disconnect;
  btnContent = walletbtn.innerHTML;
  walletbtn.innerHTML = "Disconnect";
  document.getElementById("Address").innerText = "address: " + account;

  if (ownerKey == account) {
    //he is owner of this item

    document.getElementById("non-ownerBtn").style.display = "none";
    document.getElementById("ownerBtn").style.display = "flex";
  }
}

async function SendTransaction() {
  await fetchBlockchain();
  console.log("transaction data:" + JSON.stringify(transactionData));

  /* let postR = await import('./pbft/sandbox.js'); */
  const postR = (transactionData) => {
    var data = signTransaction(transactionData);
    var transaction = {
      data: {
        data,
      },
    };
    console.log(JSON.stringify(transaction));

    var config = {
      method: "post",
      url: "http://localhost:3000/transact",
      headers: {
        "Content-Type": "application/json",
      },
      data: transaction,
    };

    axios(config)
      .then(function (response) {
        console.log("inside axios: " + JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  function signTransaction(obj) {
    const SHA256 = require("crypto-js/sha256");

    const hash = SHA256(JSON.stringify(obj)).toString();

    var signature = "25699354f2a9aa253ab414a12afab818c64ade28567cb1721b04bc16b441960ca1b397a62432b64d4cb5862e2857562b0c9a4fe2280df0683349f6a4c61897abc7bff4dfdd453aecfec332341c9da486b731390885fea3b9df8e8ba33ce5aae3bfeecfd9acfd1a17e140b58bec65dd7618b55d0b2c4f3503050060583fa694c87a9bbb7e0eb940e14b0a2856df9e76ee8052bcd77873253a1529ed049f5101bd34e80b8f7f4601ed1fb735639948bfc1068481677d3957b68f9fc982e11f4944b6edcba90d629fe426dc814bbe66b52703e31dcc46ceb192d2454917aeb21fa7db902754a16f3f5e65f05748d0e52397bec4662d7c2e70e6028bc1166fc245f9";

    obj = { ...obj, "employee signature": signature };
    obj = { ...obj, "Transaction Hash": hash.toString() };
    console.log(obj);

    //function to generate a signature for a hash value using PRIVATE key
    function generateSignature(hash) {
      const crypto = require("crypto");
      const fs = require("fs");
      const Buffer = require('buffer').Buffer;

      //read private key from file path

      /*  const readline = require("readline");
      function askQuestion(query) {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        return new Promise((resolve) =>
          rl.question(query, (ans) => {
            rl.close();
            resolve(ans);
          })
        );
      } */

      /*  const inputReader = require("wait-console-input");
      console.log("after wait-consol");
      var privateKeyPath = inputReader.readLine(
        "\nEnter file path for private key of employee: "
      ); */
      /* var privateKeyPath = await askQuestion(
        "\nEnter file path for private key of employee: "
      ); */

      var privateKey = fs.readFileSync("AutoSign-privatekey.txt"); //store data from private key text file
      //console.log(privateKey);

      const h = Buffer.from(hash); //Convert hash string to buffer
      const sign = crypto.sign("SHA256", h, privateKey); //Sign the data and returned signature in buffer
      //console.log(sign);

      //Convert returned buffer to base16
      const signature = sign.toString("hex");
      return signature;
    }

    return obj;
  }

  console.log("buy clicked");
  console.log(String(account));
  const web3 = new Web3(provider);
  window.w3 = web3;

  var weiValue = web3.utils.toWei("0.00001", "ether"); // 1 ether
  /* console.log(weiValue); //1000000000000000000 */
  var wuigas = web3.utils.toWei("2", "gwei");

  const transactionParameters = {
    nonce: "0x00", // ignored by MetaMask
    gasPrice: wuigas, // customizable by user during MetaMask confirmation.
    gas: "21000", // customizable by user during MetaMask confirmation.
    to: "0xddD5f93d84eF9E8A91e2dC3C37d8FFd33E1061e9", // Required except during contract publications.
    from: String(account), // must match user's active address.
    value: String(weiValue), // Only required to send ether to the recipient from the initiating external account.
    data: "0x7f7465737432000000000000000000000000000000000000000000000000000000600057", // Optional, but used for defining smart contract creation and interaction.
    chainId: "0x3", // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
  };

  // txHash is a hex string
  // As with any RPC call, it may throw an error

  const txHash = await ethereum.request({
    method: "eth_sendTransaction",
    params: [transactionParameters],
  });

  var re = /[0-9A-Fa-f]{6}/g;
  if (re.test(txHash)) {
    //check if output is hex
    /*  postR(transactionData); */
    console.log("im posting R");
    postR(transactionData);
    console.log("valid");
  } else {
    console.log("invalid");
  }

  console.log(txHash);
}

/* 
var SendTransaction = async () => {
  
  console.log("buy clicked");
  console.log(String(account));
  const web3 = new Web3(provider);
  window.w3 = web3;

  var weiValue = web3.utils.toWei("0.00001", "ether"); // 1 ether
  
  var wuigas = web3.utils.toWei("2", "gwei");

  const transactionParameters = {
    nonce: "0x00", // ignored by MetaMask
    gasPrice: wuigas, // customizable by user during MetaMask confirmation.
    gas: "21000", // customizable by user during MetaMask confirmation.
    to: "0xddD5f93d84eF9E8A91e2dC3C37d8FFd33E1061e9", // Required except during contract publications.
    from: String(account), // must match user's active address.
    value: String(weiValue), // Only required to send ether to the recipient from the initiating external account.
    data: "0x7f7465737432000000000000000000000000000000000000000000000000000000600057", // Optional, but used for defining smart contract creation and interaction.
    chainId: "0x3", // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
  };

  // txHash is a hex string
  // As with any RPC call, it may throw an error

  const txHash = await ethereum.request({
    method: "eth_sendTransaction",
    params: [transactionParameters],
  });
  var re = /[0-9A-Fa-f]{6}/g;
  if (re.test(txHash)) {
    //check if output is hex
    //  postR(transactionData); 

    console.log("valid");
  } else {
    console.log("invalid");
  }

  console.log(txHash);
}; */

var sign = async (msg) => {
  if (w3) {
    return await w3.eth.personal.sign(msg, account);
  } else {
    return false;
  }
};

var contract = async (abi, address) => {
  if (w3) {
    return new w3.eth.Contract(abi, address);
  } else {
    return false;
  }
};

var disconnect = async () => {
  // Close provider session
  console.log("dissconect");
  await provider.disconnect();
  document.getElementById("Address").innerText = "address";
  document.getElementById("walletbtn").innerHTML = btnContent;
  document.getElementById("walletbtn").onclick = connectWC;

  document.getElementById("non-ownerBtn").style.display = "flex";
  document.getElementById("ownerBtn").style.display = "none";
};

var address = "0x4b4f8ca8fb3e66b5ddafcebfe86312cec486dae1";
var abi = [
  {
    inputs: [],
    name: "count",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "increment",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];
