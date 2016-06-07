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

  it('retryPromise', ()=> {
    let k=3;
    function getPromise() {
        k--;
        if(k>0) return Promise.reject(k);
        else return Promise.resolve(k);
    }
    //success case, meet maxtime
    return util.retryPromise(3,  getPromise)
    .then(result => {
        expect(result).to.equal(0);
        //do once
        k=-1;
        return util.retryPromise(5,  getPromise);
    })
    .then(result=>{
        expect(result).to.equal(-2);
        //out of retry
        k=5;
        return util.retryPromise(1,  getPromise);
    })
    .then(()=> {
        done(new Error("should not be resolved"));
    })
    .catch(error=>{
        expect(error).to.equal(3);
        //no retry
        k=2;
        return util.retryPromise(0,  getPromise);
    })
    .then(()=> done(new Error("should not be resolved")))
    .catch(error=>{
        expect(error).to.equal(1);
        return Promise.resolve();
    })
  });

});
