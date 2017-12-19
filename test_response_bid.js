var config = require('_config');
var json_templates = require('json_templates');
//var helper = require('test_helper');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../bidder_server');
var should = chai.should();

chai.use(chaiHttp);

  describe('/POST bid with bid in response', () => {
      it('POST bid', (done) => {
        var bid_req = json_templates.response_with_bid;
        chai.request(server)
            .post('/bid')
            .send(bid_req)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
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
        var bid_req = json_templates.response_without_bid;
        chai.request(server)
            .post('/bid')
            .send(bid_req)
            .end((err, res) => {
                res.should.have.status(204);
                res.body.should.be.eql(null);
                done();
            });
      });

  });


