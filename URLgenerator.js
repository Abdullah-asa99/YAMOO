//------------------Get ITEM ID's from FIREBASE-------------------------------------------

// Import the functions needed
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
import { getDatabase, ref, get, set, child } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-database.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL, listAll, list } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-storage.js";

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
var IDs = [];


//call function to get all item ids from firebase and internally calls generate URLS
getAllItemIDsFromRealtimeDb();

//function to get all the item ID's from the real-time db and store them
function getAllItemIDsFromRealtimeDb() {
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
                        IDs.push(ids[j]);
                    }                    
                }
                
                generateURLS(IDs); //call the generate URLS function
            
            }
            else {
                console.log("No data found");
            }
        }
    )
    .catch((error) => {
        console.log(error);
    });

} //end of method


//-----------------------------CODE to generate URLS----------------------------------------
function generateURLS(ids) {
    //first list of URLS are for main card and 2nd is for owner-maincard
    var notownerURLS = [];
    var ownerURLS = [];

    //for each id
    for (var i = 0; i < ids.length; i++) {     
        //template url to add query parameters to
        var URL1 = new URL("http://d-guardian.com/main-card.html");
        var URL2 = new URL("http://d-guardian.com/owner-maincard.html");


        //Comment out these 2 lines later
        //URL1.hostname = window.location.hostname;
        //URL2.hostname = window.location.hostname;
        
        URL1.searchParams.set("itemID", ids[i]);
        URL2.searchParams.set("itemID", ids[i]);

        notownerURLS.push(URL1.toString());
        ownerURLS.push(URL2.toString()); 
    }
    console.log(notownerURLS);
    console.log(ownerURLS);

} //end of generateURLS() method

