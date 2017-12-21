var config = require('_config');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../bidder_server');
var should = chai.should();

 let response_with_bid = {
        id: "e7fe51ce4f6376876353ff0961c2cb0d",
        app: {
          id: "e7fe51ce-4f63-7687-6353-ff0961c2cb0d",
          name: "Morecast Weather"
        },
        device: {
          os: "Android",
          geo: {
            country: "USA",
            lat: 0,
            lon: 0
          }
        }
      }

  let response_without_bid ={
        id: "e7fe51ce4f6376876353ff0961c2cb0d",
        app: {
          id: "e7fe51ce-4f63-7687-6353-ff0961c2cb0d",
          name: "Morecast Weather"
        },
        device: {
          os: "Android",
          geo: {
            country: "GR",
            lat: 0,
            lon: 0
          }
        }
      }


chai.use(chaiHttp);

  describe('/POST bid with bid in response', () => {
      it('POST bid', (done) => {
        chai.request(server)
            .post('/bid')
            .send(response_with_bid)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('bid');
                res.body.bid.should.have.property('price');
                res.body.bid.should.have.property('adm');
                res.body.bid.should.have.property('campaignId').eql('5a3dce46');
              done();
            });
      });

  });

  describe('/POST bid witout bid in response', () => {
      it('POST bid', (done) => {
        chai.request(server)
            .post('/bid')
            .send(response_without_bid)
            .end((err, res) => {
                res.should.have.status(204);
                res.body.should.be.eql({});
                done();
            });
      });

  });


