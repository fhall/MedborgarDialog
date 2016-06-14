$(document).ready(function() {
  //Function to get url params
  $.urlParam = function(name) {
      var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
      return results[1] || 0;
    }
    //Save get url param id to var id
  var id = $.urlParam('id');

  //Building object built out of GET response data
  var building = {
    id: undefined,
    name: undefined,
    address: undefined,
    images: {
      today: undefined,
      future: undefined,
      history: undefined
    },
    story: {
      today: undefined,
      future: undefined,
      history: undefined
    }
  }

  //Function to append data to html elements
  var addBuildingData = () => {
    $('#title').html(building.name);
    $('#img-today').attr('src', building.images.today);
    $('#img-future').attr('src', building.images.future);
    $('#img-history').attr('src', building.images.history);
    $('#future').html(building.story.future);
    $('#history').html(building.story.history);
    $('#today').html(building.story.today);
    $('#name').html(building.name + '.');
  }

  //Function to GET all data by making two get requests and applying it to building object
  var getData = () => {
    //GET position of interest building info
    $.get('http://build.dia.mah.se/pois/' + id, function(data, status) {
      building.id = data['results'][0]['id'];
      building.name = data['results'][0]['extras']['info'].name;
      building.address = data['results'][0]['extras']['info']['address'].full;
    });

    //GET building story data
    $.get('http://build.dia.mah.se/ugc/' + id + '/stories', function(data, status) {
      building.images.today = data['stories'][0]['today'].image;
      building.images.future = data['stories'][0]['future'].image;
      building.images.history = data['stories'][0]['history'].image;
      building.story.today = data['stories'][0]['today'].story;
      building.story.future = data['stories'][0]['future'].story;
      building.story.history = data['stories'][0]['history'].story;
      //Add response data to building object
      addBuildingData();
    });
  }

  //Get data and append it to bulding object
  getData();

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
