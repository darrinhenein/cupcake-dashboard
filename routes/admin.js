(function() {
  var Phases, Project, Theme, User, async, mongoose, pkg;

  Project = require("../models/project");

  Phases = require("../models/phases");

  User = require("../models/user");

  Theme = require("../models/theme");

  mongoose = require("node-restful").mongoose;

  async = require("async");

  pkg = require("../package.json");

  module.exports = {
    dump: function(req, res) {
      var queue, response;
      queue = [];
      response = {
        version: pkg.version
      };
      queue.push(function(next) {
        return Project.find(function(err, docs) {
          response.projects = docs;
          return next();
        });
      });
      queue.push(function(next) {
        return Theme.find(function(err, docs) {
          response.themes = docs;
          return next();
        });
      });
      queue.push(function(next) {
        return User.find(function(err, docs) {
          response.users = docs;
          return next();
        });
      });
      queue.push(function(next) {
        response.phases = Phases;
        return next();
      });
      return async.parallel(queue, function() {
        return res.send(response);
      });
    },
    load: function(req, res) {
      return res.send('Nope');
    }
  };

}).call(this);
