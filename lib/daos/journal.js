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
var host_pid = require('os').hostname() + '_' + process.pid;
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
      doc = doc.toJSON();
      if (doc.host_pid == host_pid) {
        return;
      }
      delete doc.doc._id;
      delete doc.doc.__v;
      switch (doc.entity) {
        case 'site':
          switch(doc.operation) {
            case 'create':
              require('../services/site').createSite(doc.doc, true);
              break;
            case 'update':
              require('../services/site').updateSite(doc.doc.id, doc.doc, {
                superAdmin : true
              }, true);
              break;
            case 'delete':
              require('../services/site').deleteSite(doc.doc.id, {
                superAdmin : true
              }, true);
              break;
          }
          break;
        case 'user':
          switch(doc.operation) {
            case 'create':
              require('../services/user').createUser(doc.doc, true);
              break;
            case 'update':
              require('../services/user').updateUser(doc.oldId, doc.doc, true);
              break;
            case 'delete':
              require('../services/user').deleteUser(doc.doc.username, true);
              break;
          }
          break;
      }
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
