//import {sayHi} from './sayHi.js';
//sayHi('John'); // Hello, John!
/* import {verifySignature} from "../../pbft/sandbox.js";
 */

//Between line 1 and 10 contains ID of item to fetch from blockchain (this comes from URL parameter) 
const currentURL = new URL(location.href);
//console.log(currentURL);
var itemID = currentURL.searchParams.get("itemID");
//console.log(itemID);

//---------fetch from BLOCKCHAIN CODE-----------------------//
var ID = itemID; 


//first fetch data from blockchain 
await fetch("pbft/blockchain.json")
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
            //console.log(data["ID"]);

            //if the itemID from URL is id from blockchain
            if (data["ID"] == ID) {
                document.getElementById("prodname").innerHTML = data["product name"];
                document.getElementById("prodname2").innerHTML = data["product name"];
                document.getElementById("art-name").innerHTML = data["artist name"];
                document.getElementById("authentic").innerHTML = "The item is authentic";
                document.getElementById("itemPrice").innerHTML = data["price"] + "$";
                document.getElementById("itemPrice2").innerHTML = data["price"] + "$";
                document.getElementById("size").innerHTML = data["size"];
                document.getElementById("artMedia").innerHTML = data["Media"];
                document.getElementById("idea").innerHTML = data["Idea behined the work"];
            }
        }
    }

})
.catch(error => {
    console.log(error);
});






//---------------------------FIREBASE CODE--------------------------------------------------//
//get artist name from blockchain element 
var artistName = document.getElementById("art-name").innerHTML; 
console.log(artistName);


// Import the functions needed
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
import { getDatabase, ref, get, set, child } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-database.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-storage.js"; //for image stuff in more items

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


// Initialize Firebase app, db, storage
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const storage = getStorage();




GetURLFromRealTimeDb(artistName); //get artist image and correct item image url from realtime


//-----get Download url for picture of ARTIST and IMAGE from real time db and put in main-card (based on artist name) 
function GetURLFromRealTimeDb(artistName) {
    const dbref = ref(db);

    //get artist picture from real time db
    get(child(dbref, "profileData/" + artistName))
        .then((snapshot) => {
            if (snapshot.exists()) {
                //console.log(snapshot.val());
                document.getElementById("artist-picture").src = snapshot.val()["artistpicurl"]; //assume that the key for artist picture is always "artistpicurl"   
            }  
            else {
                console.log("No data found");
            }
        })
        .catch((error) => {
            console.log(error);
        });


    //get the item picture from real time db
    get(child(dbref, "profileData/" + artistName + "/Items"))
    .then((snapshot) => {
        if (snapshot.exists()) {            
            const keys = Object.keys(snapshot.val());
            //console.log(keys);

            keys.forEach((key, index) => {
                if (key == ID) { //if key is same as ID of item fetched from blockchain
                    //console.log(key);
                    //console.log(snapshot.val()[key]);
                    var img = document.getElementById("art-pic");
                    img.src = snapshot.val()[key];
                    var img2 = document.getElementById("art-pic2");
                    img2.src = snapshot.val()[key];
                }

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
//get artist name FROM FIREBASE given an itemID 
function getArtistName(itemid) {
    var artistname = "";
    const dbref = ref(db);
    get(child(dbref, "profileData/" ))
    .then(
        (snapshot) => {
            if (snapshot.exists()) {
                const artistNames = Object.keys(snapshot.val()); //list of artist names in firebase


                //for each artist
                for (var i = 0; i < artistNames.length; i++) {
                    var items = snapshot.val()[artistNames[i]].Items; //get their list of items
                    var ids = Object.keys(items); //list of ids for each artist

                    for (var j = 0; j < ids.length; j++) {
                        //console.log(ids[j]);
                        if (itemid == ids[j]) {
                            artistname = artistNames[i];
                        }
                    }                    
                } 
            }
            else {
                console.log("No data found");
            }
            console.log(artistname);
            //return artistname;
        }
    )
    .catch((error) => {
        console.log(error);
    });
}
*/









/*
//function to get item image urls from storage and put it in more items 
function GetURLFromStorage(artistName) {
    const storageRef = sRef(storage);
    const imagesRef = sRef(storageRef, "Images/" + artistName);
    //console.log(imagesRef);

    //---How to know which item to get???-----
    

    //-----get Download URL for ITEM picture from storage and put in main-card (based on artist name)
    getDownloadURL(sRef(imagesRef, "artist-picture.jpg"))
        .then((url) => {
            // Insert url into an <img> tag to "download"
            var img = document.getElementById("art-pic");
            img.src = url;
        })
        .catch((error) => {
            console.log(error);
        });
}
*/





