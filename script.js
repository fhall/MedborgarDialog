$(document).ready(function() {
  //Function to get url params
  $.urlParam = function(name) {
      var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
      return results[1] || 0;
    }
    //Save get url param id to var id
  var id = $.urlParam('id');

  //building object
  var building = {
    id: undefined,
    name: undefined,
    address: undefined,
    images: [],
    story: {
      today: undefined,
      future: undefined,
      history: undefined
    }
  }

  //POIS GET REQUEST
  $.get('http://build.dia.mah.se/pois/' + id, function(data, status) {
    building.id = data['results'][0]['id'];
    building.name = data['results'][0]['extras']['info'].name;
    addBuildingData();
  });

  //GET POIS STORY
  $.get('http://build.dia.mah.se/ugc/' + id + '/stories', function(data, status) {
    //console.log(data);
  });

  function addBuildingData() {
    $('#title').html(building.name);
  }



  /*
  //UGC POST THUMBS UP OR THUMBS DOWN
  $.post('http://build.dia.mah.se/ugc/:id/:key/:index', {
    id: undefined, //NOTE String
    key: undefined, //NOTE String optional
    index: undefined //NOTE String optional
  }, function(data, status) {
    console.log(data);
    console.log(status);
  });*/

});
