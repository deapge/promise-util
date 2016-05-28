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

module.exports = {
  slowPromise: slowPromise
};
