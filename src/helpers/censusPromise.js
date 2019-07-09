import census from "citysdk";

const censusPromise = args => {
  return new Promise(function(resolve, reject) {
    census(args, function(err, json) {
      if (!err) {
        //console.log(json);
        resolve(json);
      } else {
        reject(err);
      }
    });
  });
};

export default censusPromise;
