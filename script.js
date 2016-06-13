$(document).ready(function() {
  //POIS GET REQUEST
  $.get("http://build.dia.mah.se/pois/00e1012", function(data, status) {
    //alert("Data: " + data + "\nStatus: " + status);
    console.log(data);
    console.log(status);
  });

});
