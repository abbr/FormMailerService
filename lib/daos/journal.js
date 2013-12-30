'use strict';

var fs = require('fs');
var path = require('path');
var fn = path.normalize(__dirname + '../../../data/sites.json');
var sysFn = path.normalize(__dirname + '../../../data/system.json');
var repo = JSON.parse(fs.readFileSync(sysFn).toString()).repository;
var mongoose;
if (repo.type !== 'mongodb') {
  return;
}
mongoose = require('mongoose');
var db = mongoose.connection;
if (db.readyState === 0) {
  mongoose.connect(repo.connection_string, repo.connection_options || {});
}
var journals = mongoose.model('Journal', new mongoose.Schema({}, {
  strict : false,
  id : false,
  capped : 100000
}));
journals.find({}).sort({
  $natural : -1
}).limit(1).exec(function(err, docs) {
  function awaitingNewDocs(sinceDoc) {
    var stream = journals.find({
      _id : {
        $gt : sinceDoc._id
      }
    }).tailable().stream();
    stream.on('data', function(doc) {
      console.log(doc);
    });
  };
  if (docs.length === 0) {
    journals.create({}, function(err, newDoc) {
      awaitingNewDocs(newDoc);
    });
  } else {
    awaitingNewDocs(docs[0]);
  }

});
