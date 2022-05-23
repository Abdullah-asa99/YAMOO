var account;
var btnContent;
var ItemID;
var ownerKey = "0xddD5f93d84eF9E8A91e2dC3C37d8FFd33E1061e9";

// https://docs.walletconnect.com/quick-start/dapps/web3-provider
var provider = new WalletConnectProvider.default({
  rpc: {
    1: "https://cloudflare-eth.com/", // https://ethereumnodes.com/
    137: "https://polygon-rpc.com/", // https://docs.polygon.technology/docs/develop/network-details/network/
    // ...
  },
  // bridge: 'https://bridge.walletconnect.org',
});

var connectWC = async () => {
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
};
//I have the account

var SendTransaction = async () => {
  console.log("buy clicked");
  console.log(String(account));
  const web3 = new Web3(provider);
  window.w3 = web3;

  var weiValue = web3.utils.toWei("0.00001", "ether"); // 1 ether
  console.log(weiValue); //1000000000000000000
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
  if(re.test(txHash)) {//check if output is hex
    console.log('valid');
} else {
    console.log('invalid');
}

  console.log(txHash);
};

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
