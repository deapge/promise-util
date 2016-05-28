'use strict';
const expect = require('chai').expect;
const util = require('../index.js');

describe('test functions', function() {

  it('slowPromise', done=>{
    let fail = Promise.reject('reject');
    let ok = Promise.resolve('ok');
    let millisec = 1000;
    let start = new Date().getTime();
    util.slowPromise(millisec, ok)
    .then(result=>{
      expect(result).to.equal('ok');
      expect(new Date().getTime() - start).to.be.at.least(millisec);
      return Promise.resolve();
    })
    .catch(error=>done(error))
    .then(()=>{
      return util.slowPromise(millisec, fail);
    })
    .then(result=>done(new Error('should not resolved!')))
    .catch(error=>{
      expect(error).to.equal('reject');
      done();
    });

  });

});
