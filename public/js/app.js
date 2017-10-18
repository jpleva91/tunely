/* CLIENT-SIDE JS
 *
 * You may edit this file as you see fit.  Try to separate different components
 * into functions and objects as needed.
 *
 */


/* hard-coded data! */
var sampleAlbums = [];
sampleAlbums.push({
             artistName: 'Ladyhawke',
             name: 'Ladyhawke',
             releaseDate: '2008, November 18',
             genres: [ 'new wave', 'indie rock', 'synth pop' ]
           });
sampleAlbums.push({
             artistName: 'The Knife',
             name: 'Silent Shout',
             releaseDate: '2006, February 17',
             genres: [ 'synth pop', 'electronica', 'experimental' ]
           });
sampleAlbums.push({
             artistName: 'Juno Reactor',
             name: 'Shango',
             releaseDate: '2000, October 9',
             genres: [ 'electronic', 'goa trance', 'tribal house' ]
           });
sampleAlbums.push({
             artistName: 'Philip Wesley',
             name: 'Dark Night of the Soul',
             releaseDate: '2008, September 12',
             genres: [ 'piano' ]
           });
/* end of hard-coded data */




$(document).ready(function() {
  console.log('app.js loaded!');
   $.get('/api/albums', function(data) {
    data.forEach(function(album) {
      renderAlbum(album);
    });
    $('#singlebutton').on('click', function(el) {
      el.preventDefault();
      var formData = $('.form-horizontal').serialize();
      console.log(formData);


      $('.form-horizontal').trigger('reset');

      $.post('/api/albums',formData, function(data) {
        console.log(data);
        renderAlbum(data);
      });
    });
  });

  $('#albums').on('click', '.add-song', function(e) {
    console.log("Add Song clicked!");
    var currentAlbumId= $(this).parents('.album').data('album-id');
    // console.log('album-id',currentAlbumId);
    $('#songModal').data('album-id', currentAlbumId);
    $('#songModal').modal();
  });

  $('#saveSong').on('click', function(e) {
    handleNewSongSubmit(e);
  });

  $('#albums').on('click', '.delete-album', function(e) {
    var currentAlbumId = $(this).parents('.album').data('album-id');
    $.ajax({
      url: '/api/albums/'+currentAlbumId,
      type: 'DELETE',
      success: function(result) {
        console.log(result);
      }
    });
    $('#albums').empty();
    $.get('/api/albums', function(data) {
      data.forEach(function(album) {
        renderAlbum(album);
      });
    });
  });

});

// call this when the button on the modal is clicked
function handleNewSongSubmit(e) {
  e.preventDefault();
  // get data from modal fields
  var currentAlbumId = $('#songModal').data('album-id');
  var formData = {};
  formData.songName = $('#songName').val();
  formData.trackNumber = $('#trackNumber').val();
  var url = "/api/albums/" + currentAlbumId + "/songs";
  // POST to SERVER
  $.post(url, formData);
  // clear form
  $('#songName').val("");
  $('#trackNumber').val("");
  $('#albums').empty();
  // update the correct album to show the new song
  $.get('/api/albums', function(data) {
    data.forEach(function(album) {
      renderAlbum(album);
    });
  });
  // close modal
  $('#songModal').modal('toggle');
}


function buildSongsHtml(songs) {
  let songSpan = "";
  for (i = 0; i < songs.length; i ++) {
    songSpan += "- ("+ (i+1) +") " + songs[i].name + " ";
  }

  var songsHtml = 
    "<li class='list-group-item'>" +
      "<h4 class='inline-header'>Songs:</h4>" +
      "<span>" + songSpan + "</span>" +
    "</li";

  return(songsHtml);
}


// this function takes a single album and renders it to the page
function renderAlbum(album) {
  console.log('rendering album:', album);

  var albumHtml =
  "        <!-- one album -->" +
  "        <div class='row album' data-album-id='" + album._id + "'>" +
  "          <div class='col-md-10 col-md-offset-1'>" +
  "            <div class='panel panel-default'>" +
  "              <div class='panel-body'>" +
  "              <!-- begin album internal row -->" +
  "                <div class='row'>" +
  "                  <div class='col-md-3 col-xs-12 thumbnail album-art'>" +
  "                     <img src='" + "http://placehold.it/400x400'" +  " alt='album image'>" +
  "                  </div>" +
  "                  <div class='col-md-9 col-xs-12'>" +
  "                    <ul class='list-group'>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Album Name:</h4>" +
  "                        <span class='album-name'>" + album.name + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Artist Name:</h4>" +
  "                        <span class='artist-name'>" +  album.artistName+ "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Released date:</h4>" +
  "                        <span class='album-releaseDate'>" + album.releaseDate + "</span>" +

                            //Uses BuildSongsHtml
                             buildSongsHtml(album.songs) + 

  "                    </ul>" +
  "                  </div>" +
  "                </div>" +
  "                <!-- end of album internal row -->" +

  "              </div>" + // end of panel-body

  "              <div class='panel-footer'>" +
  "                 <button class='btn btn-primary add-song'>Add Song</button>" +
  "                 <button class='btn btn-danger delete-album'>Delete Album</button>"
  "              </div>" +

  "            </div>" +
  "          </div>" +
  "          <!-- end one album -->";

  // render to the page with jQuery
  $('#albums').append(albumHtml);
}
