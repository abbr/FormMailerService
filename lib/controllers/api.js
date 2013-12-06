'use strict';

exports.sites = function(req, res) {
  res.json(JSON.parse(require('fs').readFileSync(
      require('path').normalize(__dirname + '../../../data/sites.json')).toString()));
};
