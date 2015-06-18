'use strict';

module.exports = (function() {
  var obj = {
    database: {
      commitUrl: process.env.MARCELO_DB_PROTOCOL + '://' +
                 process.env.MARCELO_DB_HOST + ':' + process.env.MARCELO_DB_PORT +
                 '/db/data/transaction/commit'
    }
  };

  if (!process.env.MARCELO_DB_PROTOCOL) {
    throw new Error('Missing MARCELO_DB_PROTOCOL. Check your environment variables.');
  } else if (!process.env.MARCELO_DB_HOST) {
    throw new Error('Missing MARCELO_DB_HOST. Check your environment variables.');
  } else if (!process.env.MARCELO_DB_PORT) {
    throw new Error('Missing MARCELO_DB_PORT. Check your environment variables.');
  }

  return obj;

}());
