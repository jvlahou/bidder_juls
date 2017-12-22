
/***********************************************************
*
* Implementation of Avocarrot's real-time bidder server
* Created on 17 December 2017
* @uthor juls
* 
/***********************************************************/

//Import modules
var express = require('express');
var bodyParser = require("body-parser");
var request = require("request");
var config = require('_config');
var async = require('async');
var rp = require('request-promise');


//Create the app
var app = express();


// Express configuration for using 
// body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



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


/***********************************************************
*
* POST bid callback function.
*
************************************************************/


app.post('/bid',function(req, res) {
	
	console.log('\nPOST bid is called'); 	
	try{
	var adExchangeRequestId = req.body.id;
	var adExchangeCountry = req.body.device.geo.country;
	var campaignServiceError = 204;

	console.log("AdExchange Client ReqId :::: " + adExchangeRequestId);
 	console.log("AdExchange Client requests bid for Country :::: " + adExchangeCountry);
	
	getCampaigns(adExchangeRequestId, adExchangeCountry, res);
	}
 	catch(err) {
      	console.log("ERROR::" + err + " Reading AdExchange client request");
      	console.log("Sending " + err + "......... ");
		res.sendStatus(err);
    	}
});
 


/***********************************************************
*
* Implements the exectuion wotkflow of campaign matching
* process, creates and responses back to AdExchange client.
* The external Campaign API call is implemented to be promise
* based so as to wait until the get campaign response is received.  
*
*
* @param adExchangeRequestId: AdExcHahge id, exported from POST bid
* @param adExchangeCountry: the country of AdExchange POST request
* @return bool according to matching
************************************************************/

function getCampaigns(adExchangeRequestId, adExchangeCountry, res){ 
	var options = {
    uri: config.campaignsURI.development, //'https://private-anon-84a078b774-campaignapi9.apiary-mock.com/campaigns',
   };

rp(options)
    .then(function (response) {
        var matchedCampaigns = [];
		var winningCampaign;
		var jsonRes;

		var body = JSON.parse(response);
      	for (var key in body) {
        	var current = body[key];
        	if (matchCampaignCountries(current.targetedCountries, adExchangeCountry)){
        		matchedCampaigns.push(current);
        	}
      	}
      	console.log("Received " + key + " Campains from Campaign API");
      	if (matchedCampaigns.length != 0){
        	ascShortedCampaigns = shortCampaignsOnPrice(matchedCampaigns);
        	winningCampaign = ascShortedCampaigns[ascShortedCampaigns.length -1];
        	console.log("FOUND " + ascShortedCampaigns.length + " Matching Campains");
        	console.log("Highest Prized Campaign is --> campaignId :: " + winningCampaign.id.toString() + " //  Price :: " + winningCampaign.price);

        	//Create json response
        	jsonRes = createJSONResponse(adExchangeRequestId, winningCampaign);
        	console.log("Sending bid ......... ");
    		res.setHeader('Content-Type', 'application/json');
    		res.send(jsonRes);
      	}
      	else{ //country not found
        	console.log("Matching Campaigns for country :: " + adExchangeCountry + " NOT FOUND");
        	//res.setHeader('Content-Type', 'application/json');
        	console.log("Sending 204 ......... ");
        	res.sendStatus(204);
      	}
    })
    .catch(function (err) {
      	console.log("ERROR::" + err + "in Get Campaigns from REMOTE SERVER");
      	console.log("Sending " + err + "......... ");
		res.sendStatus(err);
    });

    
}



/***********************************************************
*
* Checks if the AdExchanage Country
* is matched in a single campaigns 
* targeted countries.
*
* @param targetedCountries: array with campaign countries
* @param adExchangeCountry: the country of AdExchange POST request
* @return bool according to matching
************************************************************/
function matchCampaignCountries (targetedCountries, adExchangeCountry){
	var campaignCountries = [];
  	var currentCountries = targetedCountries.toString().split(',');
  	for (var index in currentCountries){
  		if (currentCountries[index].toString() == adExchangeCountry.toString()){
        //console.log("Found Campaign with TargetedCountries::" + currentCountries[index]);
  			return true;
  		}
  	}
  	
  	return false;
}



/***********************************************************
*
* Shorts all the matched campaings based on price
* in ascending order
* 
* @param matchedCampaigns: array with campaign that matched
* @return asc shorted array
*
************************************************************/
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
   return shortedCampaigns;
}



/***********************************************************
*
* Creates the response in case of a campaign mathes the
* criteria
*
* @param adExchangeRequestId: AdExcHahge id, exported from POST bid
* @param winningCampaign: the selected campaign to be sent
* @return the response body in json format
*
************************************************************/
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


