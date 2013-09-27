(function() {
  var Event, Project, Theme, User, async, _;

  _ = require("underscore");

  User = require('./models/user');

  Event = require('./models/event');

  Theme = require('./models/theme');

  Project = require('./models/project');

  async = require('async');

  module.exports.log = function(req, res, next, io) {
    var getModel, method, mid, modelData, sendPacket, type, updateModel;
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
      if (req.path.split('/')[1] === 'api') {
        type = req.path.split('/')[2];
        type = type.substr(0, type.length - 1);
        mid = req.path.split('/')[3];
        method = req.method;
        modelData = {};
        getModel = function(cb) {
          var schema;
          if (req.method === 'DELETE') {
            if (type === 'theme') {
              schema = Theme;
            } else if (type === 'project') {
              schema = Project;
            }
            return schema.findOne({
              _id: mid
            }).select('title').exec(function(err, doc) {
              modelData = doc;
              return cb();
            });
          } else {
            modelData = res.locals.bundle;
            return cb();
          }
        };
        updateModel = function(cb) {
          var schema;
          if (type === 'theme') {
            schema = Theme;
          } else if (type === 'project') {
            schema = Project;
          }
          return schema.update({
            _id: mid
          }, {
            last_updated: new Date()
          }, function(err, doc) {
            return cb();
          });
        };
        sendPacket = function(cb) {
          return User.findOne({
            email: req.session.email
          }, function(err, user) {
            return Event.create({
              verb: method,
              type: type,
              model: modelData,
              changes: req.body,
              mid: mid,
              owner: user._id
            }, function(err, e) {
              return Event.findOne({
                _id: e._id
              }).populate('owner').exec(function(err, doc) {
                io.sockets.emit('feed', doc);
                return cb();
              });
            });
          });
        };
        return async.series([getModel, updateModel, sendPacket], function(err, results) {
          return next();
        });
      } else {
        return next();
      }
    } else {
      return next();
    }
  };

}).call(this);
