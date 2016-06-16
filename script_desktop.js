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

    var downVoteWidth = "";

    var getFromPoi = function() {
      return $.get('http://build.dia.mah.se/pois/' + id, function(data) {
        building.id = data['results'][0].id;
        building.name = data['results'][0].name;
        building.address = data['results'][0]['extras']['info']['address'].full;
      });
    }

    var getFromUgc = function() {
      return $.get('http://build.dia.mah.se/ugc/' + id + '/stories', function(data) {
        building.images.today = data['stories'][0]['today'].image;
        building.images.future = data['stories'][0]['future'].image;
        building.images.history = data['stories'][0]['history'].image;
        building.story.today = data['stories'][0]['today'].story;
        building.story.future = data['stories'][0]['future'].story;
        building.story.history = data['stories'][0]['history'].story;
      });
    }

    var getCurrentVoteStatus = function() {
      return $.get('http://build.dia.mah.se/ugc/' + id + '/votes/0', function(response, status) {
        if (status === 'success') {
          var downVotesTotal = response['votes'][0]['down'];
          var upVotesTotal = response['votes'][0]['up'];
          var totalVotes = parseInt(downVotesTotal) + parseInt(upVotesTotal);
          downVoteWidth = (Math.round((downVotesTotal / totalVotes) * 100)).toString() + '%';
        }
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
        '</div>' +
        '<div class="card-action">' +
        '<a class="waves-effect waves-light btn modal-trigger" href="#' + building.id + '">Läs mer</a>' +
        '</div>' +
        '</div>' +
        '</div>');
      /*
      $('#main').append('<div id="' + building.id + '" class="modal">' +
        '<div class="modal-content">' +
        '<h4>' + building.name + '</h4>' +
        '<p>' + 'Comments' + '</p>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat">Stäng</a>' +
        '</div>' +
        '</div>')
        */
      $('#main').append('<div id="' + building.id + '" class="modal modal-fixed-footer">'+
        '<div class="modal-content">'+
          '<h4>' + building.name + '</h4>'+
          '<div class="center-align">'+
            '<div class="progress">'+
              '<div class="determinate" style="width:' + downVoteWidth + '">'+
              '</div>'+
            '</div>'+
          '</div>'+
          '<h5>Vad ska vi utöka platsen med?</h5>'+
          '<table class="highlight">'+
            '<thead>'+
              '<tr>'+
                  '<th data-field="id">Förslag</th>'+
                  '<th data-field="votes">Röster</th>'+
                  '<th data-field="percent">%</th>'+
              '</tr>'+
            '</thead>'+

            '<tbody>'+
              '<tr>'+
                '<td>Soptunnor</td>'+
                '<td>10</td>'+
                '<td>62.5%</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Lekplats</td>'+
                '<td>5</td>'+
                '<td>31.25%</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Toaletter</td>'+
                '<td>1</td>'+
                '<td>6.25%</td>'+
              '</tr>'+
            '</tbody>'+
          '</table>'+

          '<div class="row valign-wrapper center-align">'+
            '<div class="input-field col s10">'+
              '<input placeholder="Lägg till förslag" id="first_name" type="text" class="validate">'+
            '</div>'+
            '<div class="col s2">'+
              '<a class="btn-floating btn-large waves-effect waves-light teal"><i class="material-icons">add</i></a>'+
            '</div>'+
          '</div>'+

        '</div>'+
        '<div class="modal-footer">'+
          '<a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat">Stäng</a>'+
        '</div>'+
      '</div>')
      $('.modal-trigger').leanModal();
    }

    $.when(getFromPoi(), getFromUgc(), getCurrentVoteStatus())
      .then(addCard, function() {
        throw new Error('Something went wrong with your request');
      });
  }

  for (var i = 49; i <= 53; i++) {
    var arg = '017' + i.toString();
    presentCard(arg);
  }
});
