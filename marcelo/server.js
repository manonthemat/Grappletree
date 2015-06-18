'use strict';

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';

var Hapi = require('hapi');
var Joi = require('joi');
var grapplerCtrl = require('./src/controllers/grappler');
var server = new Hapi.Server({
  connections: {
    routes: {
      cors: {
        origin: ['*']
      }
    }
  }
});
server.connection({ host: '0.0.0.0', port: 8000 });

var plugins = [];
if (process.env.NODE_ENV === 'development') {
  plugins.push({register: require('lout')});
}

server.route({
  method: 'GET',
  path: '/grapplers',
  config: {
    handler: grapplerCtrl.ListGrapplers,
    validate: {
      query: {
        blue: Joi.boolean(),
        purple: Joi.boolean(),
        brown: Joi.boolean(),
        black: Joi.boolean()
      }
    }
  }
});

server.register(plugins, function(err) {
  if (err) throw err;

  if (!module.parent) {
    server.start(function() {
      console.log('Marcelo running at: ', server.info.uri);
    });
  }
});

module.exports = server;
