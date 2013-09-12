(function() {
  var Event, Project, Theme, User, _;

  _ = require("underscore");

  User = require('./models/user');

  Event = require('./models/event');

  Theme = require('./models/theme');

  Project = require('./models/project');

  module.exports = function(io) {
    return function(req, res, next) {
      var method, mid, schema, type;
      if (req.method === 'POST' || req.method === 'PUT') {
        if (req.path.split('/')[1] === 'api') {
          type = req.path.split('/')[2];
          type = type.substr(0, type.length - 1);
          mid = req.path.split('/')[3];
          method = req.method;
          if (type === 'theme') {
            schema = Theme;
          } else if (type === 'project') {
            schema = Project;
          }
          return schema.findOne({
            _id: mid
          }).select('title').exec(function(err, doc) {
            return User.findOne({
              email: req.session.email
            }, function(err, user) {
              return Event.create({
                verb: method,
                mid: mid,
                type: type,
                model: doc,
                changes: req.body,
                owner: user._id
              }, function(err, e) {
                return Event.findOne({
                  _id: e._id
                }).populate('owner').exec(function(err, doc) {
                  io.sockets.emit('feed', doc);
                  return next();
                });
              });
            });
          });
        } else {
          return next();
        }
      } else {
        return next();
      }
    };
  };

}).call(this);
