//fetch id from url
const currentURL = new URL(location.href);
var ID = currentURL.searchParams.get("itemID");

//declare variables to store signature, hash, empName and public key
var signature = "";
var empName = ""; 
var hash = "";
var publicKey = "";

var fetchBlockchain = async () => {
    //fetch from blockchain
    await fetch("./pbft/blockchain.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (resp) {
        //console.log(resp);
        //for each block
        for (var blockNum = 1; blockNum < resp.length; blockNum++) {
            //for each transaction in the block
            for (var transactionNum = 0; transactionNum < resp[blockNum]["data"].length; transactionNum++) {
                var data = resp[blockNum]["data"][transactionNum]["input"]["data"]["data"];
                //if the itemID from URL is id from blockchain
                if (data["ID"] == ID) {
                    signature = data["employee signature"];
                    empName = data["employee name"];
                    hash = data["Transaction Hash"];
                }
            }
        }
    })
    .catch((error) => {
        console.log(error);
    });


    //fetch public key from public key text file
    const publicKeyPath = "./pbft/" + empName + "-publickey.txt";
    await fetch(publicKeyPath)
    .then(function (response) {
        return response.text();
    })
    .then(function (resp) {
        //resp is a string which contains contents of public key file
        publicKey = resp;
        publicKey = publicKey.toString("ascii");
    }
    )
    .catch((error) => {
        console.log(error);
    });

}; //end of fetch function


//function to verify the employee's signature (string) using public Key (ascii string) and using hash (string)
function verifySignature(signature, publicKey, hash) {
    const cryptoo = require("crypto");
    const fs = require("fs");
    const Bufferr = require("buffer").Buffer;
    //console.log(crypto.getHashes()); //this is to see all the hash algorithms


    //Creating verifier object and update verifier with hash string
    const verify = cryptoo.createVerify('RSA-SHA256');
    verify.update(hash, "ascii");
    //verify.end();

    //const sign = signature + "ad";

    //convert signature string and public key to buffer
    var publicKeyNewBuf = Bufferr.from(publicKey, "ascii");
    const signatureBuffer = Buffer.from(signature, "hex");

    //verify signature and output boolean (true or false)
    const isVerified = verify.verify(publicKeyNewBuf, signatureBuffer);
    
    return isVerified; //if not verified fix the UI */
} //end of verifySignature() function



//this is the main function which we call
async function mainFunction() {
    await fetchBlockchain();
    console.log(signature);
    console.log(hash);
    console.log(empName);
    console.log(publicKey);
    try {
        var isVerified = verifySignature(signature, publicKey, hash);
    }
    catch (err) {
        var isVerified = false; //we set it to false because if it couldn't execute likely that employee doesn't exist
    }
    console.log("Result of signature verification: " + isVerified);
}


mainFunction();

















      
// //convert signature string and hash to buffer
// const signatureBuffer = Buffer.from(signature);
// const hashBuffer = Buffer.from(hash); //hash value of transaction
// const publicKeyBuffer = Buffer.from(publicKey);

// //Creating verifier object
// const verify = crypto.createVerify('RSA-SHA256');
// verify.write(hashBuffer);
// verify.end();
// const isVerified = verify.verify(publicKeyBuffer, signatureBuffer);    
// //const isVerified = crypto.verify("RSA-SHA256", hashBuffer, publicKeyBuffer,signatureBuffer); 
