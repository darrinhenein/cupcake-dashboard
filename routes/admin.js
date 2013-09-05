(function() {
  var Project, mongoose;

  Project = require("../models/project");

  mongoose = require("node-restful").mongoose;

  module.exports = {
    dump: function(req, res) {
      return Project.find(function(err, docs) {
        return res.json(docs);
      });
    },
    load: function(req, res) {
      var doc, docs, _i, _len;
      docs = req.body;
      for (_i = 0, _len = docs.length; _i < _len; _i++) {
        doc = docs[_i];
        Project.create(doc, function(err) {
          if (err) {
            return console.log('Error: ' + err.message);
          }
        });
      }
      return res.send('Created ' + docs.length + ' records');
    }
  };

}).call(this);
