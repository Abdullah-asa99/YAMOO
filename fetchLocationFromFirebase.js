//Get the ITEM ID from URL

const currentURL = new URL(location.href);
var itemID = currentURL.searchParams.get("itemID");

var ID = itemID; 
console.log(ID);



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

// Initialize Firebase app and db and artist name
const app = initializeApp(firebaseConfig);
const db = getDatabase();
var artistName = "Saad";

getLocation();

//function to get for artist with artistName as parameter
function getLocation() {
    const dbref = ref(db);

    get(child(dbref, "profileData/" ))
    .then(
        (snapshot) => {
            if (snapshot.exists()) {
                const artistNames = Object.keys(snapshot.val()); //list of artist names in firebase

                //for each artist
                for (var i = 0; i < artistNames.length; i++) {
                    var items = snapshot.val()[artistNames[i]].itemloc; //get their list of item locations
                    var ids = Object.keys(items); //list of ids for each artist
                    //console.log(ids);
                    //for each id
                    for (var j = 0; j < ids.length; j++) {
                        if (ids[j] == ID) {
                            console.log(ids[j]);
                            document.getElementById("longitude").innerHTML = items[ID].lng;
                            document.getElementById("latitude").innerHTML = items[ID].lat;
                        }
                    }                    
                }
            }
            else {
                console.log("No data found");
            }
        }
    )
    .catch((error) => {
        console.log(error);
    });



    /*
    get(child(dbref, "profileData/"))
        .then((snapshot) => {
            if (snapshot.exists()) {
                document.getElementById("longitude").innerHTML = snapshot.val().lng;
                document.getElementById("latitude").innerHTML = snapshot.val().lat;
            }
            else {
                console.log("No data found");
            }
        })
        .catch((error) => {
            console.log(error);
        });
    
  */
}
