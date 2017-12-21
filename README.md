# bidder_juls
Dear Avocarrotians,
The bidder server (https://avocarrot.github.io/hiring/back-end/bidder-exercise/assignment.html)
was implemented using node.js version v7.10.1 in (OS)Ubuntu 16.04.
For mocking up the server postman v1.6.15 was used
For implemented and running tests mocha 1.20.1 suite was used.

#1.Install nodejs and npm running the following or run $sudo ./install_software.sh:    
--> sudo apt-get update
--> sudo apt-get install curl
--> curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
--> sudo apt-get install -y nodejs
--> sudo apt-get install npm

#2.Install bidder_server required modules by running:
$ $sudo ./install_modules.sh

#3.For steps 2&3 you might need to change installation scripts permissions by running chmod +x "filename"

#4.Copy files _config.js and test_helper.js in the /node_modules dir

#For starting the server:
 -- $nodejs bidder_server

#For running tests :
#Optional timeout flag only in case of timeout thrown 
#exception due to async func call
 -- $mocha --timeout 5000 test/test_response_bid.js
