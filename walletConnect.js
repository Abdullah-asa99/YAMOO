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
document.getElementById("walletbtn2").addEventListener("click", connectWC);
document.getElementById("buy-btn").addEventListener("click", SendTransaction);
document.getElementById("paysuccdiv").style.display = "none";


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
  document.getElementById("buy-btn").disabled = false;
  await fetchBlockchain();
  await provider.enable();

  /* 
  var options = {
    host: "http://localhost:3000",
    
    path: "http://localhost:3000",
    headers: {
      
      "Content-Type": "application/json",
    },
  };
  http.get(options, function (res) {
    console.log(res);
    res.pipe(process.stdout);
  });
  console.log("inside connect wc"); */

  //  Create Web3 instance
  const web3 = new Web3(provider);
  window.w3 = web3;

  var accounts = await web3.eth.getAccounts(); // get all connected accounts
  account = accounts[0]; // get the primary account
  var walletbtn = document.getElementById("walletbtn");
  walletbtn.onclick = disconnect;
  btnContent = walletbtn.innerHTML;
  walletbtn.innerHTML = "Disconnect";

  var walletbtn2 = document.getElementById("walletbtn2");
  walletbtn2.onclick = disconnect;

  walletbtn2.innerHTML = "Disconnect";

  document.getElementById("Address").innerText = "address: " + account;
  document.getElementById("buyeraddr").innerText = "Buyer: " + account;
  document.getElementById("Owneraddr").innerText = "Owner: " + ownerKey;

  if (ownerKey == account) {
    //he is owner of this item

    document.getElementById("non-ownerBtn").style.display = "none";
    document.getElementById("ownerBtn").style.display = "flex";
  }
}

async function SendTransaction() {
  await fetchBlockchain();

  /*  console.log("transaction data:" + JSON.stringify(transactionData));
   */
  /* let postR = await import('./pbft/sandbox.js'); */
  const postR = async (transactionData) => {
    console.log(
      "transaction data inside postR" + JSON.stringify(transactionData)
    );
    var data = await signTransaction(transactionData);
    console.log("data after signTransaction" + JSON.stringify(transactionData));

    /* console.log("transaction data" + data); */
    var transaction = {
      data: {
        data,
      },
    };
    console.log(JSON.stringify(transaction));
    var axios = require("axios");
    var config = {
      method: "post",
      proxy: {
        host: "localhost",
        port: 3000,
      },
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

  async function signTransaction(obj) {
    /* const SHA256 = require("crypto-js/sha256");

    const hash = SHA256(JSON.stringify(obj)).toString(); */

    /* var signature = await generateSignature(hash); */
    /* obj["employee signature"] = signature; */
    /* obj["Transaction Hash"] = hash.toString(); */
    /* obj = { ...obj, "employee signature": signature };
    obj = { ...obj, "Transaction Hash": hash.toString() }; */
    obj["previous owners"] = obj["owner"];
    obj["owner"] = String(account);

    //function to generate a signature for a hash value using PRIVATE key

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
    validpayment();
  } else {
    console.log("invalid");
  }

  console.log(txHash);
}
function validpayment() {
  console.log("inside validpayment");

  document.getElementById("paysheetinfo").style.display = "none";
  
  document.getElementById("buyeraddr").style.display = "none";
  document.getElementById("Owneraddr").style.display = "none";
  document.getElementById("buy-btn").style.display = "none";
  document.getElementById("paysuccdiv").style.display = "flex";
  

  document.getElementById("canelorder").innerHTML = "Close"
  
  document.getElementById("walletbtn2").addEventListener("click", connectWC);
  document.getElementById("buy-btn").addEventListener("click", SendTransaction);
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

  document.getElementById("walletbtn2").innerHTML = btnContent;
  document.getElementById("walletbtn2").onclick = connectWC;

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
