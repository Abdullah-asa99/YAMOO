//Takes item id from url and translates it to artistName from blockchain
const currentURL = new URL(location.href);
//console.log(currentURL);
var itemID = currentURL.searchParams.get("itemID");
//console.log(itemID);


//--------------------------------------Fetch from BLOCKCHAIN CODE-----------------------//
var ID = itemID; 

//first fetch data from blockchain 
await fetch("pbft/blockchain.json")
.then(function (response) {
    return response.json();
}
)
.then(function (resp) {
    for (var blockNum = 1; blockNum < resp.length; blockNum++) {
      //for each transaction in the block
      for (var transactionNum = 0; transactionNum < resp[1]["data"].length; transactionNum ++) {
          var data = resp[blockNum]["data"][transactionNum]["input"]["data"]["data"];
          //console.log(data["ID"]);

          //if the itemID from URL is id from blockchain
          if (data["ID"] == ID) {
              document.getElementById("artistName").innerHTML = data["artist name"];
          }
      }
    }

})
.catch(error => {
    console.log(error);
});





//----------------------------------------FIREBASE CODE ------------------------------------------------------------
var artistName = document.getElementById("artistName").innerHTML;
console.log(artistName);


// Import the functions needed
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
import { getDatabase, ref, get, set, child } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-database.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL, listAll, list } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-storage.js"; //for image stuff in more items

//configuration settings
const firebaseConfig = {
  apiKey: "AIzaSyDQELV2vDKrmhlh_N41Ct5IGxw4LuVw8Ws",
  authDomain: "d-guardian.firebaseapp.com",
  databaseURL: "https://d-guardian-default-rtdb.firebaseio.com",
  projectId: "d-guardian",
  storageBucket: "d-guardian.appspot.com",
  messagingSenderId: "710005762260",
  appId: "1:710005762260:web:b82e8be6a67d398545f341",
  measurementId: "G-JC2939Y8TD"
};

// Initialize Firebase app and db and artist name
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const storage = getStorage();


//call functions to get data and the images (URLS) from firebase
getDataFromRealTimeDb(artistName); //artist name, artist about, artist picture and item pictures

//assume that the key for artist picture is always "artistpicurl"
//function to get artist name, about, artist pic url AND ALL item images from from real time db
function getDataFromRealTimeDb(artistName) {
  const dbref = ref(db);

  //get artist name, about and artist pic url
  get(child(dbref, "profileData/" + artistName))
    .then((snapshot) => {
      if (snapshot.exists()) {
        document.getElementById("artistName").innerHTML = artistName;
        document.getElementById("artistAbout").innerHTML = snapshot.val().about;
        document.getElementById("art-pic").src = snapshot.val()["artistpicurl"];
      }
      else {
        console.log("No data found");
      }
    })
    .catch((error) => {
      console.log(error);
    });



    //get ALL item images from real time db
    get(child(dbref, "profileData/" + artistName + "/Items"))
    .then((snapshot) => {
        if (snapshot.exists()) {            
            const keys = Object.keys(snapshot.val());
            //console.log(keys);

            //for each 
            keys.forEach((id, index) => {            
              //var anchor = document.createElement("a");
              //anchor.href = "main-card.html";
              var img = document.createElement("img");
              img.src = snapshot.val()[id];
              img.classList.add("item-card");

              //when clicking on img we go back to main-card.html
              img.onclick = function (event) {
                window.location.href = 'main-card.html?itemID='+ id;
              }; 

              //anchor.appendChild(img); //nest image tag inside anchor tag
              document.getElementById("itemCard").appendChild(img); 
            });
            
        }
        else {
            console.log("No data found");
        }
    })
    .catch((error) => {
        console.log(error);
    });

} //end of method

















/*
//function to get URL for MORE ITEM images from storage and put it in more items
function GetURLFromStorage(artistName) {
    //console.log(token.innerText);

    const storageRef = sRef(storage);
    const imagesRef = sRef(storageRef, "Images/" + artistName);
    //console.log(imagesRef);
     
    listAll(imagesRef)
    .then((res) => {
    res.prefixes.forEach((folderRef) => {
        // All the prefixes under imagesRef.
        // You may call listAll() recursively on them.
        //console.log(folderRef);        
       
    });

    //for each item image we put in html image tag
    res.items.forEach((itemRef) => {
        // All the items under listRef.
        getDownloadURL(itemRef)
        .then((url) => {
            // Insert url into an <img> tag to "download"
            console.log(url);
            var img = document.createElement("img");
            img.src = url;
            img.width = 180;
            img.height = 180;
            img.style = "margin: 1px 10px 1px 10px"; 
            img.classList.add("item-card");
            document.getElementById("itemCard").appendChild(img); //id = itemCard is the more items section

        })
        .catch((error) => {
            console.log(error);
    });

    });
    }).catch((error) => {
        console.log(error);
    });

  } //end of method 
  */


