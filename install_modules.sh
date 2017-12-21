#!/bin/sh

apt-get install mocha
npm init
#dev
npm install express --save
#npm install request --save
npm install promise-any
npm install request-promise --save
npm install async --save

#test
npm install chai --save
npm install chai-http --save
#npm install babel-preset-env --save
npm install diff --save
npm install commander --save
npm install glob --save
ln -s /usr/bin/nodejs /usr/bin/node
touch test/test_response_bid.js
#export NODE_PATH=/home/julie/Desktop/bidder_juls/node_modules 
#



