'use strict';

var siphon = require('../util/siphon');
var Boom = require('boom');

module.exports = (function() {
  return {
    simpleSiphon: function(query, asList) {
      return new Promise(function(resolve, reject) {
        siphon.singleTransaction(query)
          .then(function(result) {
            if (result) {
              if (asList) {
                resolve([].concat(result));
              } else {
                resolve(result);
              }
            } else {
              reject(Boom.notFound());
            }
          }).catch(function() {
            reject(Boom.badImplementation());
          });
      });
    }
  };
})();
