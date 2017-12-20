

// Required modules
var express = require('express');
var bodyParser = require("body-parser");
var request = require("request");
var config = require('_config');
var async = require('async');
var rp = require('request-promise');
// Create the app
var app = express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Global vars
var jsonRes; //Final response
var matchingCampaign;


// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);
module.exports = server;


// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Bidder Server is up!!! Listening at http://' + host + ':' + port);
}



app.post('/bid',function(req, res) {
	
	console.log('\nPOST bid is called');
	console.log("Body:" + req.body);
 	
	var adExchangeRequestId = req.body.id;
	var adExchangeCountry = req.body.device.geo.country;
	var campaignServiceError = 204;

	console.log("AdExchange_Id:" + adExchangeRequestId);
 	console.log("AdExchange requests bid for Country::::" + adExchangeCountry);
	
	getCampaigns(adExchangeRequestId, adExchangeCountry, res);
	
 	
});
 



function getCampaigns(adExchangeRequestId, adExchangeCountry, res){ //var promise = new Promise(function (resolve, reject)
	var options = {
    uri:'https://private-anon-84a078b774-campaignapi9.apiary-mock.com/campaigns',
   };

rp(options)
    .then(function (response) {
        console.log(response);
        var matchedCampaigns = [];
		var winningCampaign;
		var body = JSON.parse(response);
		var matchingCampaign;
      	for (var key in body) {
        	var current = body[key];
        	if (matchCampaignCountries(current.targetedCountries, adExchangeCountry)){
        		matchedCampaigns.push(current);
        	}
      	}
      	if (matchedCampaigns.length != 0){
        	ascShortedCampaigns = shortCampaignsOnPrice(matchedCampaigns);
        	winningCampaign = ascShortedCampaigns[ascShortedCampaigns.length -1];
        	console.log("FOUND " + ascShortedCampaigns.length + " Matching Campains");
        	console.log("Highest Prized Campaign is -->");
        	console.log( "       campaignId::"+ winningCampaign.id.toString()+ " with price::" + winningCampaign.price);
        	matchingCampaign = true;

        	//Create json response
        	jsonRes = createJSONResponse(adExchangeRequestId, winningCampaign);
        	console.log("Sendding bid ......... ");
    		res.setHeader('Content-Type', 'application/json');
    		res.send(jsonRes);
      	}
      	else{ //country not found
        	console.log("Matching Campaigns for country" + adExchangeCountry + "NOT FOUND");
      	}
    })
    .catch(function (err) {
      	console.log("ERROR::" + err + "in Get Campaigns from REMOTE SERVER");
      	console.log("Sendding 204 ......... ");
		res.sendStatus(204);
    });

    
}

function createJSONResponse(adExchangeRequestId, winningCampaign){
	var jsonResponse = [];
	var resData = {id: adExchangeRequestId, 
	bid:
	{
	campaignId: winningCampaign.id ,
	price: winningCampaign.price,
	adm: winningCampaign.adm} }
	
	jsonResponse = JSON.stringify(resData);    
	return jsonResponse;
}


function matchCampaignCountries (targetedCountries, adExchangeCountry){
	var campaignCountries = [];
  	var currentCountries = targetedCountries.toString().split(',');
  	for (var index in currentCountries){
  		if (currentCountries[index].toString() == adExchangeCountry.toString()){
        console.log("Found Campaign with TargetedCountries::" + currentCountries[index]);
  			return true;
  		}
  	}
  	
  	return false;
}



function shortCampaignsOnPrice(matchedCampaigns){
	var shortedCampaigns = [];
	for (var key in matchedCampaigns) {
		var current = matchedCampaigns[key];
		if(shortedCampaigns.length == 0)
			shortedCampaigns.push(current);
		else if(shortedCampaigns[shortedCampaigns.length -1 ].price < current.price){
			shortedCampaigns.push(current);
		}
		else{
			var poped = shortedCampaigns.pop();
			shortedCampaigns.push(current);
			shortedCampaigns.push(poped);	
		}
	}
  /*
  for (var i in shortedCampaigns){
            console.log(i + "th country:: " + shortedCampaigns[i].targetedCountries + " Price::" + shortedCampaigns[i].price + '\n');
  }
  */
  return shortedCampaigns;
}

