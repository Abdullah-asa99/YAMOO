const inputReaderr = require("wait-console-input");
var axios = require("axios");
let selection = inputReaderr.readInteger(
  "Please select a function:\n1- GET transactions.\n2- GET blocks.\n3- POST transaction.\n",
  {
    reInputOnError: true,
    separator: "enter",
    size: 1,
  }
);
//build field by field

var transactionData;
if (selection == 3) {
  transactionData = inputReaderr.readLine("Please enter the transaction:\n");
  /* console.log(transactionData); */
}

/* const transactionData = {
  data: {
    temporary: "69696969696969",
  },
}; */

 const postR = (transactionData) => {
  console.log("post inside");
  

  var data = signTransaction(JSON.parse(transactionData));
  var transaction = {
    data: {
      data,
    },
  };
  /* console.log(transaction); */

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
      console.log("Transaction signed and sent.");
    })
    .catch(function (error) {
      console.log(error);
    });
};


///////////////////
  const getTransactions = (transactionData) => {
  var axios = require("axios");
  var data = transactionData;

  var config = {
    method: "get",
    url: "http://localhost:3000/transactions",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};

////////////////
 const getBlcoks = (transactionData) => {
  var axios = require("axios");
  var data = transactionData;

  var config = {
    method: "get",
    url: "http://localhost:3000/blocks",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      const fss = require("fs");

      const jsonString = JSON.stringify(response.data);
      fss.writeFile("./blockchain.json", jsonString, (err) => {
        if (err) {
          console.log("Error writing file", err);
        } else {
          console.log("Successfully wrote file");
        }
      });

      //console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};

switch (selection) {
  case 1:
    getTransactions(transactionData);
    break;
  case 2:
    getBlcoks(transactionData);
    break;
  case 3:
    postR(transactionData);
    break;

  default:
    break;
}

function signTransaction(obj) {
  const SHA256 = require("crypto-js/sha256");

  const hash = SHA256(JSON.stringify(obj)).toString();

  var signature = generateSignature(hash);

  obj = { ...obj, "employee signature": signature.toString() };
  obj = { ...obj, "Transaction Hash": hash.toString() };
  /* console.log(obj); */

  //function to generate a signature for a hash value using PRIVATE key
  function generateSignature(hash) {
    const cryptoo = require("crypto");
    const fss = require("fs");
    const Bufferr = require('buffer').Buffer;

    //read private key from file path
    var privateKeyPath = inputReaderr.readLine("\nEnter file path for private key of employee: ");

    var privateKeyBuffer = fss.readFileSync(privateKeyPath); //store data from private key text file
    var key = privateKeyBuffer.toString("ascii");

    const h = Bufferr.from(hash); //Convert hash string to buffer
    // const sign = cryptoo.sign("SHA256", h, privateKey); //Sign the data and returned signature in buffer
    // const signature = sign.toString("hex");     //Convert returned buffer to base16


    //create sign object and sign the hash string value
    const sign = cryptoo.createSign('RSA-SHA256'); //Sign class object
    sign.update(hash);
    //sign.end();
    const signature = sign.sign(key, "hex");
    /* console.log(signature); */


    return signature;
  }

  return obj;
}

//verify signature string using PUBLIC key of employee
//empName comes from blockchain
/* function verifySignature(signature, empName, hash) {
  const cryptoo = require("crypto");
  const fss = require("fs");
  const Bufferr = require("buffer");

  //generate a path for public key
  const publicKeyPath = empName + "-publickey.txt";
  //read public key from file path
  const publicKey = fss.readFileSync(publicKeyPath);
  //convert signature string to buffer
  const signatureBuffer = Bufferr.from(signature);

  const h = Bufferr.from(hash); //hash value of transaction

  //verify signature to see if its ok or not
  const isVerified = cryptoo.verify("SHA256", h, publicKey, signatureBuffer);

  return isVerified;
}
 */