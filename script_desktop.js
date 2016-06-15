$(document).ready(function() {
  var presentCard = function(id) {
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
      },
      comments: [
        {
          title: undefined,
          name: undefined,
          comment: undefined
        }
      ]
    }

    var getFromPoi = function() {
      return $.get('http://build.dia.mah.se/pois/' + id, function(data, status) {
        building.id = data['results'][0].id;
        building.name = data['results'][0].name;
        building.address = data['results'][0]['extras']['info']['address'].full;
      });
    }

    var getFromUgc = function() {
      return $.get('http://build.dia.mah.se/ugc/' + id + '/stories', function(data, status) {
        building.images.today = data['stories'][0]['today'].image;
        building.images.future = data['stories'][0]['future'].image;
        building.images.history = data['stories'][0]['history'].image;
        building.story.today = data['stories'][0]['today'].story;
        building.story.future = data['stories'][0]['future'].story;
        building.story.history = data['stories'][0]['history'].story;
      });
    }

    var addCard = function() {
      $('#main-row').append('<div class="row col s3">' +
        '<div class="card medium">' +
        '<div class="card-image">' +
        '<img src="' + building.images.future + '">' +
        '</div>' +
        '<div class="card-content">' +
        '<span class="card-title">' + building.name + '</span>' +
        '<p>' + building.story.today + '</p>' +
        '</div>' +
        '<div class="card-action">' +
        '<a class="waves-effect waves-light btn modal-trigger" href="#' + building.id + '">Läs mer</a>' +
        '</div>' +
        '</div>' +
        '</div>');
      $('#main').append('<div id="' + building.id + '" class="modal">' +
        '<div class="modal-content">' +
        '<h4>' + building.name + '</h4>' +
        '<p>' + 'Comments' + '</p>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat">Stäng</a>' +
        '</div>' +
        '</div>')
      $('.modal-trigger').leanModal();
    }

    $.when(getFromPoi(), getFromUgc())
      .then(addCard, function() {
        throw new Error('Something went wrong with your request');
      });
  }

  for (var i = 49; i <= 53; i++) {
    var arg = '017' + i.toString();
    presentCard(arg);
  }
});
