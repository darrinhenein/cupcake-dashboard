(function() {
  var Event, Phases, Project, Theme, User, async, mongoose, pkg;

  Project = require("../models/project");

  Phases = require("../models/phases");

  User = require("../models/user");

  Theme = require("../models/theme");

  Event = require("../models/event");

  mongoose = require("node-restful").mongoose;

  async = require("async");

  pkg = require("../package.json");

  module.exports = {
    dump: function(req, res) {
      var queue, response;
      queue = [];
      response = {
        version: pkg.version,
        date: new Date()
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
        return Event.find(function(err, docs) {
          response.events = docs;
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
      var data, dropEvents, dropProjects, dropThemes, dropUsers, queue;
      data = req.body;
      queue = [];
      dropProjects = function(next) {
        return mongoose.connection.db.dropCollection('projects', function(err, docs) {
          return next();
        });
      };
      dropThemes = function(next) {
        return mongoose.connection.db.dropCollection('themes', function(err, docs) {
          return next();
        });
      };
      dropUsers = function(next) {
        return mongoose.connection.db.dropCollection('users', function(err, docs) {
          return next();
        });
      };
      dropEvents = function(next) {
        return mongoose.connection.db.dropCollection('events', function(err, docs) {
          return next();
        });
      };
      queue.push(function(next) {
        return Project.create(data.projects, function(err) {
          console.log("created " + data.projects.length + " projects");
          return next();
        });
      });
      queue.push(function(next) {
        return Theme.create(data.themes, function(err) {
          console.log("created " + data.themes.length + " themes");
          return next();
        });
      });
      queue.push(function(next) {
        return User.create(data.users, function(err) {
          console.log("created " + data.users.length + " users");
          return next();
        });
      });
      queue.push(function(next) {
        return Event.create(data.events, function(err) {
          console.log("created " + data.events.length + " events");
          return next();
        });
      });
      return async.parallel([dropProjects, dropThemes, dropUsers, dropEvents], function(next) {
        return async.parallel(queue, function(next) {
          return res.send({
            message: "Database recreated successfully.",
            date: data.date
          });
        });
      });
    }
  };

}).call(this);
