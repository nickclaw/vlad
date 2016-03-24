import vlad from '../src';
import chai from 'chai';
import asPromised from 'chai-as-promised';

chai.should();
chai.use(asPromised);

global.expect = chai.expect;
global.vlad = vlad;
