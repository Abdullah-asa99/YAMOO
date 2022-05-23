
var obj = {
    "id": 25,
    "index": 4,
    "timestamp": "22/3/2022",
    "data": {
      "artist name": "Mohammed Akrouf", 
      "product name": "the joker ",
      "price": 4500,
      "size": "100 x 80 cm^2",
      "media": "Acrylic on canvas",
      "ideas behind work": "Insipiration from looking at artwork online"
    },
    "previousHash": "0014b1f41ad90f939988f4b3170b3c0cd4feccf019f85b42f7b21a5071726256",
    "hash": "000d050b14cff9be386906442814ddfccc581e2d47d70c04d64d3fee19b3e456",
    "nonce": 61
  };


const SHA256 = require("crypto-js/sha256");
const hash = SHA256(JSON.stringify(obj)).toString();
console.log(hash)

var signature = generateSignature(hash);



  obj = { ...obj ,  "employee signature" : (signature.toString()) }

  //console.log(obj);

function generateSignature(dataStr) {
const crypto = require('crypto');

    //Create a private key and public key
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
     modulusLength: 2048,
   });
  
  
   //Convert string to buffer 
   const data = Buffer.from(dataStr);
  
   //Sign the data and returned signature in buffer 
   const sign = crypto.sign("SHA256", data , privateKey);
  
   //Convert returned buffer to base16
   const signature = sign.toString("hex");
   return signature;
  
   //Printing the signature 
   // console.log(Signature:\n\n ${signature});
  }