var mongoose = require("mongoose");
var Schema = mongoose.Schema,
		Song = require('./song.js');

var AlbumSchema = new Schema({
	artistName: String,
	name: String,
	releaseDate: String,
	genres: [ String ],
	songs: [ Song.SongSchema ]
});

var Album = mongoose.model('Album', AlbumSchema);

module.exports = Album;