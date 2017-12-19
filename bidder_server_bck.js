

// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();
var bodyParser = require("body-parser");
var request = require("request");

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




 //var ascShortedCampaigns =[];
// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);
// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

var matchingCampaign = false;
//var campaignCountries = [];

var resources = [
    {
        id: 1,
        name: 'Foo'
    }
];

var bid_resource = [	
{
  "id": "e7fe51ce4f6376876353ff0961c2cb0d",
  "bid": {
    "campaignId": "5a3dce46",
    "price": 1.23,
    "adm": "<a href=\"http://example.com/click/qbFCjzXR9rkf8qa4\"><img src=\"http://assets.example.com/ad_assets/files/000/000/002/original/banner_300_250.png\" height=\"250\" width=\"300\" alt=\"\"/></a><img src=\"http://example.com/win/qbFCjzXR9rkf8qa4\" height=\"1\" width=\"1\" alt=\"\"/>\r\n"
  }
}
]

var bidder_get =[{
  "id": "e7fe51ce4f6376876353ff0961c2cb0d",
  "app": {
    "id": "e7fe51ce-4f63-7687-6353-ff0961c2cb0d",
    "name": "Morecast Weather"
  },
  "device": {
    "os": "Android",
    "geo": {
      "country": "USA",
      "lat": 0,
      "lon": 0
    }
  }
}]

//middleware function mounted on /bid path
app.use('/bid', function (req, res, next) {
 // reset_lists();
 	console.log('Request Type:', req.method);
 	//console.log(req.body);
 	//var bidderCountry = getBidderCountry(req.body);
 	var clientCountry = "USA";
 	console.log('Bidder Country:', clientCountry);

 	//Call external API
  var higherPrizedCampaign =  getHighPrizedCampaign(clientCountry);
 // console.log("High Prized Campaign::: Countiries " + higherPrizedCampaign.targetedCountries +  "  Price::" + higherPrizedCampaign.price + "\n");
  if(higherPrizedCampaign){
    matchingCampaign = false;
  }
  //In case of error
  else{
    matchingCampaign = false;
  }
	next();
	});
 
app.get('/bid', function(req, res, body) {
	if(matchingCampaign)
  		res.send(bid_resource);
	else
	{
		res.sendStatus(204);
	}
});
 

/*
app.get('/bid/:id', function(req, res) {
    var id = parseInt(req.params.id, 10);
    var result = resources.filter(r => r.id === id)[0];
 
    if (!result) {
    	res.status(400);
		res.send(bid_resource_empty);
        
    } else {
        res.send(result);
    }
});
*/

function getHighPrizedCampaign(clientCountry){
	//Call external api
  var availableCampaigns = [];
 
  request.get('https://private-anon-84a078b774-campaignapi9.apiary-mock.com/campaigns', function (err, res, body) {
 	if (!err) {
	  body = JSON.parse(body);
    for (var key in body) {
        var current = body[key];
        availableCampaigns.push(current);
      }
  console.log("Campaigns size::: " + availableCampaigns.length + "\n");
  }
  });
 return getMatchingCampaigns.apply(this, availableCampaigns, clientCountry);
}

function getMatchingCampaigns(campaigns, clientCountry){
   console.log("--Campaigns size::: " + campaigns.length + "\n");
  var matchedCampaigns = [];
	for (var key in campaigns) {
		var current = campaigns[key];
		if (findMatchingCampaigns(current.targetedCountries, clientCountry)){ 
			matchedCampaigns.push(current);
		}
	}
   console.log("MAtched Campaigns size::: " + matchedCampaigns.length + "\n");	
 return shortCampaignsOnPrice(matchedCampaigns);
}

function getHigherCampaign(matchedCampaigns){
  var ascShortedCampaigns =[];
  //If matched campaignes exist
  if (matchedCampaigns.length != 0){
    //short campaigns on price
  	ascShortedCampaigns = shortCampaignsOnPrice(matchedCampaigns);
	  for (var i in ascShortedCampaigns){
  		console.log(i + "th country:: " + ascShortedCampaigns[i].targetedCountries + " Price::" + ascShortedCampaigns[i].price + '\n');
    }
	}
  if(ascShortedCampaigns.length!=0)
    return ascShortedCampaigns[ascShortedCampaigns.length -1];
  else 
    return ascShortedCampaigns;
}

function findMatchingCampaigns (targetedCountries, clientCountry){
	var campaignCountries = [];
  	var currentCountries = targetedCountries.toString().split(',');
  	for (var index in currentCountries){
  		if (currentCountries[index].toString() == clientCountry.toString()){
        console.log("Targeted Countries :: " + targetedCountries +'\n');
  		  console.log("Matched " + currentCountries[index] +'\n');
  			return true;
  		}
  	}
  	
  	return false;
}

function getBidderCountry(bidderRequestBody){
	bidderRequestBody = JSON.parse(bidderRequestBody);
	
	console.log("Device: " + bidderRequestBody[0].device.geo.country + "\n");

	return bidderRequestBody[0].device.geo.country;	
}

function shortCampaignsOnPrice(matchedCampaigns){
  var shortedCampaigns = [];
	for (var key in matchedCampaigns) {
		var current = matchedCampaigns[key];

		if(shortedCampaigns.length == 0){
			shortedCampaigns.push(current);
    }

		else if(shortedCampaigns[shortedCampaigns.length -1 ].price < current.price){
			shortedCampaigns.push(current);
		}

		else{
			var poped = shortedCampaigns.pop();
			shortedCampaigns.push(current);
			
      }
    return  getHigherCampaign(shortedCampaigns);
	}

  //return shortedCampaigns;

}

//empty lists
function reset_lists(){
  campaigns = [];
  matchedCampaigns = [];
  ascShortedCampaigns = [] ;
}


