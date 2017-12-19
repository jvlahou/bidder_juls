

// Required modules
var express = require('express');
var bodyParser = require("body-parser");
var request = require("request");
var config = require('_config');
// Create the app
var app = express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Global vars
var jsonRes; //Final response
var matchingCampaign = false; //Flag raised when a matching campaign was found

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


/*
//middleware function mounted on /bid path
app.use('/bid', function (req, res, body, next) {
 	
	});
 */


app.use('/bid', function(req, res, body) {
	console.log('\nPOST bid is called');

 	var matchedCampaigns = [];
  var winningCampaign;
  //var adExchangeCountry = "USA";
  
   var adExchangeRequestBody = req.body;
   console.log("Body:" +JSON.parse(body));
   for (var item in body){
		console.log("key:" + item + "Value:" + adExchangeRequestBody[key]);
   }
   
   var adExchangeCountry = "USA";
   console.log("AdExchange requests bid for Country::::" + adExchangeCountry);
 
  //Call external api
  request.get(config.campaignsURI.development, function (err, res, body) {
    if (!err) {
          body = JSON.parse(body);
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
        jsonRes = [];
        var resData = {id: "e7fe51ce4f6376876353ff0961c2cb0d", //This is wrongly hardcoded (I know)
         bid:
          {
            campaignId: winningCampaign.id ,
            price: winningCampaign.price,
             adm: winningCampaign.adm} }

        jsonRes = JSON.stringify(resData);
     
      }
      else{ //country not found
        matchingCampaign  = false;
        console.log("Matching Campaigns for country" + adExchangeCountry + "NOT FOUND");
      }
    }
    else{ //error in calling campaign api
      matchingCampaign =false;  
      console.log("ERROR::" + err + "in Get Campaigns from REMOTE SERVER");
      
    }
 	});

  
	//next();
	if(matchingCampaign == true){
  	//res.writeHead(200, {"Content-Type": "application/json"});
    res.setHeader('Content-Type', 'application/json');
    	res.send(jsonRes);
    }
	else
	{
		res.sendStatus(204);
	}
});
 


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


function getAdExchangeCountry(adExchangeReqBody){
	
	
	console.log("Device: " + adExchangeRequestBody[0].device.geo.country);

	return adExchangeRequestBody[0].device.geo.country;	
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

