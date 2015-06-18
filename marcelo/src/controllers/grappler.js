'use strict';

var Boom = require('boom');
var sw = require('../util/simpleWrappers');

function listGrapplers(queryParams) {
  // returns a list of grapplers
  // can be filtered via query params by belt
  var blue = queryParams.blue,
      purple = queryParams.purple,
      brown = queryParams.brown,
      black = queryParams.black;
  var beltString = '';
  var beltArray = [];
  if (blue || purple || brown || black) {
    beltString += ' WHERE ';
    if (blue) beltArray.push('grappler:Blue');
    if (purple) beltArray.push('grappler:Purple');
    if (brown) beltArray.push('grappler:Brown');
    if (black) beltArray.push('grappler:Black');
    beltString += beltArray.join(' OR ');
  }
  var query = 'MATCH (grappler)' + beltString + ' RETURN grappler ORDER BY grappler.last_name';
  return sw.simpleSiphon(query, true);
  // the second argument of simpleSiphon ensures that we're returning a list,
  // even if there was only one grappler in the returned result
}

var GrapplerController = function() {};
GrapplerController.prototype = (function() {
  return {
    ListGrapplers: function(request, reply) {
     return listGrapplers(request.query)
       .then(function(result) {
         return reply(result);
       })
       .catch(function(err) {
         if (err.isBoom) {
           return reply(err);
         } else {
          return reply(Boom.badImplementation());
         }
       });
    }
  };
})();

var grapplerCtrl = new GrapplerController();
module.exports = grapplerCtrl;
