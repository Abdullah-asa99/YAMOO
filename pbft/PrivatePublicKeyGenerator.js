//THIS SCRIPT RUNS WHENEVER NEW EMPLOYEE JOINS COMPANY
const crypto = require("crypto");
const fs = require("fs");
const inputReader = require("wait-console-input");

//Create a private key and public key (type buffer)
const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
        type:"spki",
        format: 'pem'
    },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

//console.log(privateKey);
//console.log(publicKey);

//Input employee name
var empName = inputReader.readLine("Please enter the new employee name: ");
console.log(empName);


//Write private and public key to text file
fs.writeFile(empName + '-privatekey.txt', privateKey, err => {
  if (err) {
    console.error(err);
    return;
  }
  else {
    //file written successfully
    console.log("Private key generated successfully");
  }
})

fs.writeFile(empName + '-publickey.txt', publicKey, err => {
  if (err) {
    console.error(err);
    return;
  }
  else {
    //file written successfully
    console.log("Public key generated successfully");
  }
})







