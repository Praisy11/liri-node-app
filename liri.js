
require("dotenv").config();
var request=require("request");
var keys = require("./key.js");
var Spotify = require("node-spotify-api");
var ombd = require("omdb")
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
});

//variabble for CLI ****refered to bank.js solved in class
var command = process.argv[2];
var param = process.argv.slice(3).join(" ");
//console.log(command)
//console.log(param)
var log="log.txt";
//switchCase= (command, param);
//function switchCase (command, param){
switch(command){
  case "concert-this":
    concertThis(param);
  break;

  case "spotify-this-song":
    spotifyThis(param);
  
  break;

  case "movie-this":
    movieThis(param);
  break;

  case "do-what-it-says":
    doThis();
  break;
  default:
    console.log("{Please enter any of the four Liri bot commands: concert-this, spotify-this, movie-this, do-what-it-says}");
  return;
}
/*===========================================================================================*/
//calling switch functions
////function concert-this

function concertThis(param){
console.log("praisy")
  var artist = param;
  var queryUrl = "https://rest.bandsintown.com/artists/"+ artist +"/events?app_id=codingbootcamp";
    request(queryUrl, function(error, response, body) {
          if (error) console.log(error);
      var result  =  JSON.parse(body)[0];
      console.log('===============================================')
      console.log("Venue name " + result.venue.name);
      console.log("Venue location " + result.venue.city);
      console.log("Date of Event " +  moment(result.datetime).format("MM/DD/YYYY"));
      console.log('===============================================')
      fs.appendFile('log.txt', result, function (error) {
        if (error) throw error;
      });
        //update();
     });
     };
  /*==========================================================================================*/  
  ////function spotify-this
function spotifyThis(param) {
    if (!param) {
    param ="The Sign By Ace of Base";
    console.log (param)
  } else {
    
    spotify.search({ type: 'track', query: param },
    function(err, data){
      if (err) {
        console.log('Error occured:'+ err);
        return;
      }
    
      else {
             
         var songList = data.tracks.items[0];
         var result = console.log("artist(s): " + songList.artists[0].name);
                     console.log("song name: " + songList.name);
                    console.log("preview song: " + songList.preview_url);
                    console.log("album: " + songList.album.name);
        console.log('===============================================')
        console.log (result)
        console.log('===============================================')
       var songData = `\nUsed spotify-this-song to find: \n"artist(s): " + songList.artists.name\n"song name: " + songList.name\n"preview song: " + songList.preview_url\n"album: " + songList.album.name\n--------------------`
        
       fs.appendFile('log.txt', songData, function (error) {
          if (error) throw error;
        });
      }
    });
  };
} 

/*===========================================================================================*/
////////function movie-this *** reference taken from ombd node exercise solved in class


function movieThis(param) {
  var movieName=param;
  if (!movieName) {
    movieName = "Mr Nobody";
    console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/");
	 	console.log("It's on Netflix!")
  }else {
    movieName = param;
  }
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy" ;
      request(queryUrl, function(error, response, body) {
       
          if (!error && response.statusCode === 200) {
            console.log('===============================================')
              console.log("Movie Title: " + JSON.parse(body).Title);
              display("Release Year: " + JSON.parse(body).Year);
              display("IMDB Rating: " + JSON.parse(body).imdbRating);
              display("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
              display("Country: " + JSON.parse(body).Country);
              display("Language: " + JSON.parse(body).Language);
              display("Plot: " + JSON.parse(body).Plot);
              display("Actors: " + JSON.parse(body).Actors);
              console.log('===============================================')
              var movieData  =  JSON.parse(body);
              fs.appendFile('log.txt', movieData, function (error) {
                if (error) throw error;
              });
          
              }
      });
    }
 /*===========================================================================================*/ 
//////function do what it says thingee


function doThis() {
   fs.readFile("random.txt", "utf8", function (error, data) {
       if (!error);
       //console.log(data.toString());
       //split text with comma delimiter
       var random = data.toString().split(',');
       if(random[0] === "spotify-this-song"){
           var song = random[1];
           //console.log("song==="+song)
           spotifyThis(song);
       }
      
   });
}
/*===========================================================================================*/
////functions for append, update and console
function display(description, data) {
  //console.log(description + data);
  appendFile(description + data + "\n");
}
//appendFile function

function appendFile(data) {
  console.log(data);
  fs.appendFile('logFile', data, function(err) {
    if (err) 
      console.log(err);
     
  })
};  
