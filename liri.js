require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var filename = './log.txt';
var log = require('simple-node-logger').createSimpleFileLogger(filename);
log.setLevel('all');
var userCommand = process.argv[2];
var secondCommand = process.argv[3];
for (var i = 4; i < process.argv.length; i++) {
    secondCommand += '+' + process.argv[i];
}
var spotify = new Spotify(keys.spotify);
var getArtistNames = function (artist) {
    return artist.name;
};
var getSpotify = function (songName) {
    if (songName === undefined) {
        songName = "What's my age again";
    }

    spotify.search(
        {
            type: "track",
            query: songName
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }

            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log(i);
                console.log("artist(s): " + songs[i].artists.map(getArtistNames));
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("-----------------------------------");
            }
        }
    );
};
function mySwitch(userCommand) {
    switch (userCommand) {

        case "my-tweets":
            getTweets();
            break;

        case "spotify-this-song":
            getSpotify();
            break;

        case "movie-this":
            getMovie();
            break;

        case "do-what-it-says":
            doWhat();
            break;
    }
    function getTweets() {
        var client = new Twitter(keys.twitter);
        var screenName = { screen_name: 'captnwalker' };
        client.get('statuses/user_timeline', screenName, function (error, tweets, response) {
            if (error) throw error;
            for (var i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                console.log("@captnwalker: " + tweets[i].text + " Created At: " + date.substring(0, 19));
                console.log("-----------------------");
            }
        });
    }
    function getMovie() {
        var movieName = secondCommand;
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";

        request(queryUrl, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var body = JSON.parse(body);
                console.log('================ Movie Info ================');
                console.log("Title: " + body.Title);
                console.log("Release Year: " + body.Year);
                console.log("IMdB Rating: " + body.imdbRating);
                console.log("Country: " + body.Country);
                console.log("Language: " + body.Language);
                console.log("Plot: " + body.Plot);
                console.log("Actors: " + body.Actors);
                console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
                console.log("Rotten Tomatoes URL: " + body.tomatoURL);
                console.log('==================THE END=================');

            } else {
                console.log("Error occurred.")
            }
            if (movieName === "Mr. Nobody") {
                console.log("-----------------------");
                console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
                console.log("It's on Netflix!");
            }
        });
    }
    function doWhat() {
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (!error);
            var cmds = data.toString().split(',');
            userCommand = cmds[0];
            secondCommand = cmds[1];
            mySwitch(userCommand);
        });
    }
}   
mySwitch(userCommand);