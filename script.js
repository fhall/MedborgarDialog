$(document).ready(function() {
  //POIS GET REQUEST
  $.get("http://build.dia.mah.se/pois/00e1012", function(data, status) {
    var id = data['results'][0]['id'];
    console.log('id från get request är ' + id);
  });


  /*
  //UGC POST THUMBS UP OR THUMBS DOWN
  $.post("http://build.dia.mah.se/ugc/:id/:key/:index", {
    id: undefined, //NOTE String
    key: undefined, //NOTE String optional
    index: undefined //NOTE String optional
  }, function(data, status) {
    console.log(data);
    console.log(status);
  });*/

});
