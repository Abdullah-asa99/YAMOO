//load the google map 

function initMap() {
    setTimeout(() => {   
      //location data from tags (from firebase)
      const latitude = parseFloat(document.getElementById("latitude").innerText); //from firebase
      const longitude = parseFloat(document.getElementById("longitude").innerText); //from firebase
      
      console.log(latitude);
      console.log(longitude);

      //position of item (from firebase)
      const pos = {
        lat: latitude, 
        lng: longitude   
      };

      //this is the new map
      const map = new google.maps.Map(document.getElementById('map'), {
          center: pos,
          zoom: 9, 
          disableDefaultUI: true,

      });

      //marker for location of item
      const marker = new google.maps.Marker({
          position: pos,
          map: map,
      });

      //create info window
      const infowindow = new google.maps.InfoWindow({
          content: "Latitude: " + pos["lat"] + "\n" + " Longitude: " + pos["lng"],
        });   


      //when you click on marker show info window
      marker.addListener("click", () => {
          infowindow.open({
            anchor: marker,
            map,
            shouldFocus: false,
          });
        });

      /*
      //when you howver out of marker close window
      marker.addListener('onclick', ()=>{
          infowindow.close();
      });
      */


    }, 3000);
  
    //location data from tags (from firebase)
    // const latitude = document.getElementById("latitude").innerText; //from firebase
    // const longitude = document.getElementById("longitude").innerText; //from firebase   

}