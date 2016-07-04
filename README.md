# youtube-api-thumbnails
Get Youtube thumbnails via Youtube API

## Before you start

Follow the official Google tutorial to [obtain API KEY](https://developers.google.com/youtube/v3/getting-started#before-you-start)

 1. You need a [Google Account](https://www.google.com/accounts/NewAccount) to access the Google API Console, request an API key, and register your application.
 2. Create a project in the [Google Developers Console](https://console.developers.google.com) and [obtain authorization credentials](https://developers.google.com/youtube/registering_an_application) so your application can submit API requests.
 3. After creating your project, make sure the YouTube Data API is one of the services that your application is registered to use:

     - Go to the [Developers Console](https://console.developers.google.com/) and select the project that you just registered.
     - [Open the API Library](https://console.developers.google.com/apis/library?project=_) in the Google Developers Console. If prompted, select a project or create a new one. In the list of APIs, make sure the status is ON for the YouTube Data API v3.
 4. In Credentials in left menu you can generate your API key

## Instalation
```sh
$ npm install youtube-api-thumbnails
```
## Usage

Call the module
```javascript
var thumbnails = require('youtube-api-thumbnails');
```
Configuration
```javascript
thumbnails.config({
  	key: "<your Youtube API key>",	// required
    returnAsArray: true,			// optional, default is false
	onlyHighestRes: true,			// optional, default is false
	getResolutions: true			// optional, default is false
})
```
Get Youtube video thumbnails
```javascript
thumbnails.get(id, callback);
```
#### id
Array of youtube videos ID

#### callback( err, thumbnails )
If error appears err contains error message else is null.

thumbnails is an object with videos ID and links to their thumbnails. Check examples for more information

## Examples
```javascript
thumbnails.get([ 'aaa' , 'Z0ZUwh8GOo0' , 'Rh9a1ICbIJE' ], function (err, thumbnails) {
    if(err){
      console.log(err);
      return;
    }

    console.log(thumbnails);
});
```

Only existing videos will appear in result so video ID **'aaa'** will be missing

#### Result
With default configuration ( only key set )
```
[
	Z0ZUwh8GOo0: {
    	default: 'https://i.ytimg.com/vi/Z0ZUwh8GOo0/default.jpg',
    	medium: 'https://i.ytimg.com/vi/Z0ZUwh8GOo0/mqdefault.jpg',
    	high: 'https://i.ytimg.com/vi/Z0ZUwh8GOo0/hqdefault.jpg',
    	standard: 'https://i.ytimg.com/vi/Z0ZUwh8GOo0/sddefault.jpg' },
  	Rh9a1ICbIJE: {
  		default: 'https://i.ytimg.com/vi/Rh9a1ICbIJE/default.jpg',
    	medium: 'https://i.ytimg.com/vi/Rh9a1ICbIJE/mqdefault.jpg',
    	high: 'https://i.ytimg.com/vi/Rh9a1ICbIJE/hqdefault.jpg',
    	standard: 'https://i.ytimg.com/vi/Rh9a1ICbIJE/sddefault.jpg',
    	maxres: 'https://i.ytimg.com/vi/Rh9a1ICbIJE/maxresdefault.jpg' }
]

```

If **returnAsArray** is set to true in config

```
[
	Z0ZUwh8GOo0: [
    	'https://i.ytimg.com/vi/Z0ZUwh8GOo0/default.jpg',
    	'https://i.ytimg.com/vi/Z0ZUwh8GOo0/mqdefault.jpg',
    	'https://i.ytimg.com/vi/Z0ZUwh8GOo0/hqdefault.jpg',
    	'https://i.ytimg.com/vi/Z0ZUwh8GOo0/sddefault.jpg' ],
  	Rh9a1ICbIJE: [
    	'https://i.ytimg.com/vi/Rh9a1ICbIJE/default.jpg',
    	'https://i.ytimg.com/vi/Rh9a1ICbIJE/mqdefault.jpg',
    	'https://i.ytimg.com/vi/Rh9a1ICbIJE/hqdefault.jpg',
    	'https://i.ytimg.com/vi/Rh9a1ICbIJE/sddefault.jpg',
    	'https://i.ytimg.com/vi/Rh9a1ICbIJE/maxresdefault.jpg' ]
]
```

If **onlyHighestRes** and **getResolutions** are set to true in config

```
[
	Z0ZUwh8GOo0: {
    	url: 'https://i.ytimg.com/vi/Z0ZUwh8GOo0/sddefault.jpg',
    	width: 640,
   		height: 480 },
  	Rh9a1ICbIJE: {
    	url: 'https://i.ytimg.com/vi/Rh9a1ICbIJE/maxresdefault.jpg',
    	width: 1280,
    	height: 720 }
]
```
### Version
1.0.1
### License
MIT
