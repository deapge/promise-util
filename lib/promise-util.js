'use strict';

function slowPromise(millisec, promise){
  let delayPromise = new Promise((resolve, reject)=>{
    setTimeout(resolve, millisec);
  });
  return Promise.all([delayPromise, promise]).then(results=>{
    if(results.length>=2){
      return Promise.resolve(results[1]);
    }else{
      return Promise.reject(new Error("the promise doesn't been resolved"));
    }
  })
  .catch(error => Promise.reject(error));
}

function retryPromise(maxTimes, getPromise){
    //implement no arguments case first
    //fn.apply(null, Array.prototype.slice.call(arguments, 2))
    return getPromise()
    .catch(error=>{
        if(maxTimes>0){
            return retryPromise(maxTimes-1, getPromise);
        }else{
            return Promise.reject(error);
        }

    });
}

module.exports = {
  slowPromise: slowPromise,
  retryPromise: retryPromise
};
