var chai = require('chai'),
    asPromised = require('chai-as-promised');

chai.should();
chai.use(asPromised);

global.expect = chai.expect;
global.vlad = require('../');
