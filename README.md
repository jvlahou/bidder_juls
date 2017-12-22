# bidder_juls
Dear Avocarrotians,
The bidder server (https://avocarrot.github.io/hiring/back-end/bidder-exercise/assignment.html)
was implemented using node.js version v7.10.1 in (OS)Ubuntu 16.04.
Postman v1.6.15 was used for mocking up the server 
Mocha 1.20.1 suite was used for implementing and running tests.
Regarding request validation, no request validation schema is implemented,
i just check required fields and no empty body.

#1.Install nodejs and npm running the following or run 
 -- $sudo ./install_software.sh   


#2.Install bidder_server required modules by running:
 -- $sudo ./install_modules.sh

#3.For steps 2&3 you might need to change installation scripts permissions by running chmod +x "filename"

#4.export NODE_PATH=/home/julie/Desktop/bidder_juls/node_modules 
 replace the above with you own project_dirctory "project_direcory"/node_modules

#For starting the server:
 -- $nodejs bidder_server

#For running tests :
#Optional timeout flag only in case of timeout exception 
#thrown due to func call of remote API 
 -- $mocha --timeout 5000 test/test_response_bid.js
