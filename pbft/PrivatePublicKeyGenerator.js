//THIS SCRIPT RUNS WHENEVER NEW EMPLOYEE JOINS COMPANY
const crypto = require("crypto");
const fs = require("fs");
const inputReader = require("wait-console-input");

//Create a private key and public key (type buffer)
var { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

//console.log(privateKey);
//console.log(publicKey);

//Input employee name
var empName = inputReader.readLine("Please enter the new employee name: ");
console.log(empName);

/* privateKey = privateKey.replace("-----BEGIN PRIVATE KEY-----\n", "");
privateKey = privateKey.replace("\n-----END PRIVATE KEY-----", "");
publicKey = publicKey.replace("-----BEGIN PUBLIC KEY-----\n", "");
publicKey = publicKey.replace("\n-----END PUBLIC KEY-----", ""); */

//Write private and public key to text file
fs.writeFile(empName + "-privatekey.txt", privateKey, (err) => {
  if (err) {
    console.error(err);
    return;
  } else {
    //file written successfully
    console.log("Private key generated successfully");
  }
});

fs.writeFile(empName + "-publickey.txt", publicKey, (err) => {
  if (err) {
    console.error(err);
    return;
  } else {
    //file written successfully
    console.log("Public key generated successfully");
  }
});

/* fs.readFile(empName + '-publickey.txt', 'utf-8', function(err, data) {
  if (err) throw err;

  var newValue = data.replace("-----BEGIN PRIVATE KEY-----", '');

  fs.writeFile(empName + '-publickey.txt', newValue, 'utf-8', function(err) {
    if (err) throw err;
    console.log('filelistAsync complete');
  });
});

fs.readFile(empName + '-publickey.txt', 'utf-8', function(err, data) {
  if (err) throw err;

  var newValue = data.replace("-----END PRIVATE KEY-----", '');

  fs.writeFile(empName + '-publickey.txt', newValue, 'utf-8', function(err) {
    if (err) throw err;
    console.log('filelistAsync complete');
  });
}); */
