$(document).ready(function() {

  //Function to get url params
  $.urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
  }

  //Save get url param id to var id
  var id = $.urlParam('id');

  //Function to get current vote status
  var getCurrentVoteStatus = function() {
    $.get('http://build.dia.mah.se/ugc/' + id + '/votes/0', function(response, status) {
      if (status === 'success') {
        var downVotesTotal = response['votes'][0]['down'];
        var upVotesTotal = response['votes'][0]['up'];
        var totalVotes = parseInt(downVotesTotal) + parseInt(upVotesTotal);
        var downVoteWidth = (Math.round((downVotesTotal / totalVotes) * 100)).toString() + '%';
        var ratio = (Math.round((upVotesTotal - downVotesTotal))).toString();
        $('.determinate').css({
          'width': downVoteWidth
        });
        if (ratio > 0) {
          $('#ratio').html('+' + ratio);
        } else {
          $('#ratio').html(ratio);
        }
      }
    });
  }

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
  var addBuildingData = function() {
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
  var getData = function() {
    //GET position of interest building info
    $.get('http://build.dia.mah.se/pois/' + id, function(data) {
      building.id = data['results'][0]['id'];
      building.name = data['results'][0]['extras']['info'].name;
      building.address = data['results'][0]['extras']['info']['address'].full;
    });

    //GET building story data
    $.get('http://build.dia.mah.se/ugc/' + id + '/stories', function(data) {
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

  //Function that handles all things voting
  var voting = function() {
    //Function that disables voting after one vote
    var disableBtn = function() {
      var upId = $('#upVote');
      var downId = $('#downVote')
      upId.unbind();
      downId.unbind();
      upId.removeClass('btn-floating green');
      upId.addClass('btn-floating grey');
      downId.removeClass('btn-floating red');
      downId.addClass('btn-floating grey');
    }

    //Function for voting up on future plans
    $('#upVote').bind('click', function() {
      $.get('http://build.dia.mah.se/ugc/' + id + '/votes/0', function(data, status) {
        if (status === 'success') {
          var upVoteCount = data['votes'][0]['up'];
          console.log(upVoteCount); //TODO cleanup
          var downVoteCount = data['votes'][0]['down'];
          console.log(downVoteCount); //TODO cleanup
          upVoteCount++
          $.ajax({
            url: 'http://build.dia.mah.se/ugc/' + id + '/votes/0',
            type: 'PUT',
            data: {
              up: upVoteCount,
              down: downVoteCount
            },
            success: function(response) {
              var downVotesTotal = response['other']['votes'][0]['down'];
              var upVotesTotal = response['other']['votes'][0]['up'];
              var totalVotes = parseInt(downVotesTotal) + parseInt(upVotesTotal);
              var downVoteWidth = (Math.round((downVotesTotal / totalVotes) * 100)).toString() + '%';
              var ratio = (Math.round((upVotesTotal - downVotesTotal))).toString();
              $('.determinate').css({
                'width': downVoteWidth
              });
              if (ratio > 0) {
                $('#ratio').html('+' + ratio);
              } else {
                $('#ratio').html(ratio);
              }
              $(".fixed-action-btn.click-to-toggle").closeFAB();
              disableBtn();
            }
          });
        }
      });
    });

    //Function for voting down on future plans
    $('#downVote').bind('click', function() {
      $.get('http://build.dia.mah.se/ugc/' + id + '/votes/0', function(data, status) {
        if (status === 'success') {
          var upVoteCount = data['votes'][0]['up'];
          console.log(upVoteCount); //TODO cleanup
          var downVoteCount = data['votes'][0]['down'];
          console.log(downVoteCount); //TODO cleanup
          downVoteCount++
          $.ajax({
            url: 'http://build.dia.mah.se/ugc/' + id + '/votes/0',
            type: 'PUT',
            data: {
              up: upVoteCount,
              down: downVoteCount
            },
            success: function(response) {
              var downVotesTotal = response['other']['votes'][0]['down'];
              var upVotesTotal = response['other']['votes'][0]['up'];
              var totalVotes = parseInt(downVotesTotal) + parseInt(upVotesTotal);
              var downVoteWidth = (Math.round((downVotesTotal / totalVotes) * 100)).toString() + '%';
              var ratio = (Math.round((upVotesTotal - downVotesTotal))).toString();
              $('.determinate').css({
                'width': downVoteWidth
              });
              if (ratio > 0) {
                $('#ratio').html('+' + ratio);
              } else {
                $('#ratio').html(ratio);
              }
              $(".fixed-action-btn.click-to-toggle").closeFAB();
              disableBtn();
            }
          });
        }
      });
    });
  }

  var getTags = function() {
    var allTags;
    $.get('http://build.dia.mah.se/ugc/' + id + '/tag/', function(response) {
      var tags = [];
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

      //Add all tags to tags menu in DOM;
      for (var k = 0; k < allTags.length; k++) {
        //Append list items tags to drop down menu
        $('#dropdown2').append('<li><a href="#!" id="' + allTags[k] + '">' + allTags[k] + '</a></li>');
        //Initiliazes the drop down menu
        $('select').material_select();

        //Value of each key in given index
        var vals = []
        for (var i = 0; i < allTags.length; i++) {
          vals[i] = response['tag'][i][allTags[i]];
        }

        //Bind click event to all list items
        $('#' + allTags[k]).bind('click', function() {
          var key = $(this).attr('id');
          var keyPos = allTags.indexOf(key)
          var tagValue = {};
          tagValue[key] = parseInt(vals[keyPos]) + 1.;
          $.ajax({
            url: 'http://build.dia.mah.se/ugc/' + id + '/tag/' + keyPos.toString() + '/',
            type: 'PUT',
            data: tagValue,
            success: function(result) {
              //console.log(result);
            }
          });
        });
      }
    });
  }

  $("div.overlay").click(function() {
    $(".overlay").hide();
    $(".fixed-action-btn.click-to-toggle").closeFAB();
  });

  //Invoke getTags from api
  getTags();

  //Invoke voting functionality
  voting();

  //Invoke get data and append it to bulding object
  getData();

  //Invoke get current vote status
  getCurrentVoteStatus();

});
