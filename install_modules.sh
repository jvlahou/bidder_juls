#!/bin/sh

apt-get install mocha
npm init
#dev
npm install express --save-dev
npm install request --save-dev
npm install promise-any
npm install request-promise --save-dev
npm install async --save-dev

#test
npm install chai --save-dev
npm install chai-http --save-dev
npm install babel-preset-env --save-dev
npm install diff --save-dev
npm install commander --save-dev
npm install glob --save-dev
ln -s /usr/bin/nodejs /usr/bin/node
touch test/test_response_bid.js
#export NODE_PATH=/home/julie/Desktop/bidder_juls/node_modules 
#



