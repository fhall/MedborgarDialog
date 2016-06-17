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
      ],
      tags: [
      ]
    }

    var allTags;
    var allVals;
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

    var buildTr = function(name, no, percent) {
      return  '<tr>'+
                '<td>' + name + '</td>'+
                '<td>' + no + '</td>'+
              '</tr>';
    }

    var getTags = function() {
      return $.get('http://build.dia.mah.se/ugc/' + id + '/tag/', function(response) {
        var tags = [];
        var vals = [];
        var tagsToString = [];
        //Get all tag keys from tags array
        for (var i = 0; i < response['tag'].length; i++) {
          tags.push(Object.keys(response['tag'][i]));
        }
        //Stringify all keys to one string and insert them to an array
        for (var j = 0; j < tags.length; j++) {
          tagsToString.push(tags.splice(j, tags.length).toString());
        }
        //Split array string into seperate strings
        allTags = tagsToString[0].split(',');
        for(var i = 0; i < allTags.length; i++) {
          vals[i] = response['tag'][i][allTags[i]];
        }
        allVals = vals;
        //Add all tags to tags menu in DOM;
        for (var k = 0; k < allTags.length; k++) {
          console.log($('#tags').append('<option value="' + allTags[k] + '">' + allTags[k] + '</option>'));
          //Initiliazes the drop down menu
          $('select').material_select();
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
        '<a class="waves-effect waves-light btn modal-trigger theme-color" href="#' + building.id + '">Läs mer</a>' +
        '</div>' +
        '</div>' +
        '</div>');

      $('#main').append('<div id="' + building.id + '" class="modal modal-fixed-footer">'+
        '<div class="modal-content">'+
          '<h4>' + building.name + '</h4>'+
          '<div class="center-align">'+
            '<p>Opinion:</p>'+
            '<div class="progress">'+
              '<div class="determinate" style="width:' + downVoteWidth + '">'+
              '</div>'+
              '<br>'+
            '</div>'+
          '</div>'+
          '<h5>Vad ska vi utöka platsen med?</h5>'+
          '<table class="highlight">'+
            '<thead>'+
              '<tr>'+
                  '<th data-field="id">Förslag</th>'+
                  '<th data-field="votes">Röster</th>'+
              '</tr>'+
            '</thead>'+

            '<tbody id="tb-' + building.id + '">'+
            '</tbody>'+
          '</table>'+

          '<div class="row valign-wrapper center-align">'+
            '<div class="input-field col s10">'+
              '<input placeholder="Lägg till förslag" id="first_name" type="text" class="validate">'+
            '</div>'+
            '<div class="col s2">'+
              '<a class="btn-floating btn-large waves-effect waves-light theme-color"><i class="material-icons">add</i></a>'+
            '</div>'+
          '</div>'+

        '</div>'+
        '<div class="modal-footer">'+
          '<a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat">Stäng</a>'+
        '</div>'+
      '</div>');
      for(var i = 0; i < allTags.length; i++) {
        $('#tb-' + building.id).append(buildTr(allTags[i], allVals[i]));
      }
      $('.modal-trigger').leanModal();
    }

    $.when(getFromPoi(), getFromUgc(), getCurrentVoteStatus(), getTags())
      .then(addCard, function() {
        throw new Error('Something went wrong with your request');
      });
  }

  for (var i = 49; i <= 53; i++) {
    var arg = '017' + i.toString();
    presentCard(arg);
  }
});
