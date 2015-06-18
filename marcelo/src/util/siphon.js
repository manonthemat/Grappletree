'use strict';

var constants = require('../config/constants');
var _ = require('lodash');
var rp = require('request-promise');

module.exports = (function siphon() {
  function transformResponse(response) {
    return new Promise(function(resolve, reject) {
      if (response && response.results) {
        // This is assuming that the results is of length 1
        var result = response.results[0];
        if (result) {
          var transformedData = [];
          var columns = result.columns;
          var rows = result.data;

          _.each(rows, function(row) {
            transformedData.push(_.zipObject(columns, row.row));
          });

          if (transformedData.length === 0) {
            resolve(null);
          } else if (transformedData.length === 1) {
            resolve(transformedData[0]);
          } else {
            resolve(transformedData);
          }
        }
      } else {
        reject('Error parsing response from database');
      }
    });
  }

  function singleTransaction(query) {
    return new Promise(function(resolve, reject) {
      var options = {
        uri: constants.database.commitUrl,
        json: true,
        body: { 'statements': [{ 'statement': query }] },
        headers: {
          'X-Stream': true,
          'Accept': 'application/json'
        }
      };

      rp.post(options)
        .then(function(response) {
          transformResponse(response)
          .then(resolve);
        })
        .catch(reject);
    });
  }

  return {
    singleTransaction: singleTransaction
  };
})();
