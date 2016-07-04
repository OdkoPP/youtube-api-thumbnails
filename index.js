var https = require('https');

/*
	Module configuration
 */
var cnfg = {
	returnAsArray: false,
	onlyHighestRes: false,
	getResolutions: false,
	apiKey: "",
};

/*
	This thumbnails resolutions defines Youtube API
 */
var thumbnailsResolutions = ['default', 'medium', 'high', 'standard', 'maxres'];

/*
	Youtube API configuration.
 */
function config (options) {
	cnfg.apiKey = options.key || "";
	cnfg.returnAsArray = options.returnAsArray || false;
	cnfg.onlyHighestRes = options.onlyHighestRes || false;
	cnfg.getResolutions = options.getResolutions || false;
}

/*
	Requests and find and format thumbnails related to videos given in videoId
 */
function get(videoId, callback){
	// if youtube api key is not defined
	if(cnfg.apiKey == ""){
		//console.log("Youtube API key not set");
		callback("ERROR - Youtube API key not set. Use config({key: '<YOUTUBE_API_KEY>'})", null);
		return;
	}

	// transform videoId to array or end if wrong input
	if( Object.prototype.toString.call( videoId ) === '[object Array]' ) {
		//console.log( 'Array' );
	} else if(typeof videoId === 'string') {
		//console.log( 'String' );
		videoId = [videoId];
	} else {
		//console.log( 'Wrong input' )
		callback("ERROR - Wrong input format. VideoId must be array of string with separated youtube video ID", null);
		return
	}

	var data = "";    // data returned by youtube api in row format
	var result;       // final and formated result

	// prepair input of input ids
	var idString = videoId.toString();

	// https rest api request options
	var options = {
		host: 'www.googleapis.com',
		port: 443,
		path: '//youtube/v3/videos?key=' + cnfg.apiKey + '&part=snippet&id='+ idString,
		method: 'GET',
	};

	// youtube API request
	var req = https.request(options, function(res) {
		// when i get piece of data from server save it to variable data
		res.on('data', function(d) {
			data += d;
		});

		// after all data received
		res.on('end',function(){
			// check wrong URL
			if(data === "Not Found"){
				//console.log("Wrong URL")
				callback("ERROR - Wrong API URL. googleapis did not found this service", null);
				return;
			}

			// transform recieved data to JSON format
			globalResult = JSON.parse(data);

			// check error messages like authentification error
			if(globalResult.error !== undefined){
				/*
				// todo - this should go to logger no to stdout but for now i leave it as it is for easier debugging
				console.log("ERROR\nStatus Code - " + globalResult.error.code + "\nMessage - " + globalResult.error.message);
				//console.log(globalResult.error.errors);
				if( globalResult.error.errors[0].reason === "keyInvalid" ){
					console.log("Authentification problem - Youtube API key is invalid");
				} else {
					console.log("Reason - " + globalResult.error.errors);
				}
				*/

				callback(
					((globalResult.error.errors[0].reason === "keyInvalid") ? "Authentification problem - Youtube API key is invalid" : globalResult.error), null);
				return;
			}

			// format data according to config and send it to callback
			callback(null, getThumnails(globalResult.items));
		})

	});

	req.on('error', function(e) {
		//console.error(e);
		callback("Youtube API request ERROR - " + e + "Maybe wrong URL?", null);
		return;
	});

	req.end();
}

/*
	Formating data according to config
 */
function getThumnails(inputJson) {
	var result = [];

	for( var i in inputJson ){
		if( cnfg.onlyHighestRes ){
			for (var j in thumbnailsResolutions) {
				if (inputJson[i].snippet.thumbnails.hasOwnProperty(thumbnailsResolutions[j])) {
					if(cnfg.getResolutions) {
						result[inputJson[i].id] = (inputJson[i].snippet.thumbnails[thumbnailsResolutions[j]])
					} else {
						result[inputJson[i].id] = (inputJson[i].snippet.thumbnails[thumbnailsResolutions[j]].url)
					}
				}
			}
		} else {
			if (cnfg.returnAsArray) {
				result[inputJson[i].id] = [];
				for (var j in thumbnailsResolutions) {
					if (inputJson[i].snippet.thumbnails.hasOwnProperty(thumbnailsResolutions[j])) {
						if(cnfg.getResolutions) {
							result[inputJson[i].id].push(inputJson[i].snippet.thumbnails[thumbnailsResolutions[j]])
						} else {
							result[inputJson[i].id].push(inputJson[i].snippet.thumbnails[thumbnailsResolutions[j]].url)
						}
					}
				}
			} else {
				result[inputJson[i].id] = {};
				for (var j in thumbnailsResolutions) {
					if (inputJson[i].snippet.thumbnails.hasOwnProperty(thumbnailsResolutions[j])) {
						if(cnfg.getResolutions) {
							result[inputJson[i].id][thumbnailsResolutions[j]] = inputJson[i].snippet.thumbnails[thumbnailsResolutions[j]]
						} else {
							result[inputJson[i].id][thumbnailsResolutions[j]] = inputJson[i].snippet.thumbnails[thumbnailsResolutions[j]].url
						}
					}
				}
			}
		}
	}

	//console.log(result);
	return result;
}

module.exports.get = get;
module.exports.config = config;