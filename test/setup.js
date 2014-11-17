var chai = require('chai'),
    asPromised = require('chai-as-promised')
    Promise = require('bluebird');

chai.should();
chai.use(asPromised);

global.expect = chai.expect;
global.vlad = require('../');
global.Promise = Promise;
