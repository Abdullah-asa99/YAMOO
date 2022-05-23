//get item ID from URL and store in ID variable
const currentURL = new URL(location.href);
var itemID = currentURL.searchParams.get("itemID");

var ID = itemID; 
console.log(ID);


//Right now Owner name is same as artist name (Between Line 40 to 60)

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
//var nameInput = document.getElementById("name");
//var productName = document.getElementById("prodName");

var ownerName = ""; 
var productName = "";
var artistName = "";
var size = "";
var media = "";
var price = 0;
var idea = "";


//var downloadBtn = document.getElementById("download-btn");
const image = new Image();
image.src = "Certification image.jpg";

// const image2 = new Image();
// image2.src = "company-signature.jpg";


image.onload = function () { 
    drawImage();    
    //ctx.drawImage(image2, 100, 625, 100, 25); //draw signature
}


function getDataFromBlockChain() {
    fetch("pbft/blockchain.json")
    .then(function (response) {
      return response.json();
    }
    )
    .then(function (resp) {
      //for each block
      for (var blockNum = 1; blockNum < resp.length; blockNum++) {
        //for each transaction in the block
        for (var transactionNum = 0; transactionNum < resp[1]["data"].length; transactionNum ++) {
          var data = resp[blockNum]["data"][transactionNum]["input"]["data"]["data"];

          //check if ID sent is equal to the block's id
          if (ID == data["ID"]) {
            //get data needed from blockchain
            productName = data["product name"];
            artistName = data["artist name"];
            size = data["size"];
            media = data["Media"];
            price = data["price"];
            idea = data["Idea behined the work"];
            ownerName = data["owner"];

            //Draw data onto canvas (except date and company sign)
            ctx.fillText(ownerName, 250, 220);
            ctx.fillText(productName, 150, 270);
            ctx.fillText(artistName, 160, 305);
            ctx.fillText(size, 110, 345);
            ctx.fillText(media, 90, 400);
            ctx.fillText(price + " $", 120, 440);
            ctx.fillText(idea, 80, 500);
          }

        } //end of for transaction  loop
      } //end of for each block loop
    })
    .catch(error => {
      console.log(error);
    });

}


//Draw image onto canvas with name
function drawImage() {  
    resp = getDataFromBlockChain();
    //ctx.font = "20px monotype corsiva";
    ctx.font = "14px monotype Arial";
    ctx.fillStyle = "#000000";


    //draw the image onto canvas
    ctx.drawImage(image, 0, 0, canvas.width , canvas.height);

    //get todays date and add it to the canvas
    var today = new Date();
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    //var mm = months[today.getMonth()]; //between 0 and 11
    var yyyy = today.getFullYear();


    today = dd + '/' + mm + '/' + yyyy;
    
    ctx.fillText(today, 100, 700); //draw today's date
    ctx.fillText("D-Guardian", 100, 645, 100, 25); //draw signature

    
} //end of method


/*
nameInput.addEventListener("input", function() {
    drawImage();   
});


downloadBtn.addEventListener("click", function() {
    downloadBtn.href = canvas.toDataURL("image/jpg");
    //downloadBtn.download = "certificate - " + nameInput.value;
});
*/
