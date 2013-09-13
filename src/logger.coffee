_ = require("underscore")
User = require('./models/user')
Event = require('./models/event')
Theme = require('./models/theme')
Project = require('./models/project')

module.exports.listen = (io) ->
  return (req, res, next) ->
    if req.method is 'PUT' or req.method is 'DELETE'
      if req.path.split('/')[1] is 'api'

        type = req.path.split('/')[2]
        type = type.substr(0, type.length-1)

        mid = req.path.split('/')[3]
        method = req.method

        if type is 'theme'
          schema = Theme
        else if type is 'project'
          schema = Project

        schema.findOne({_id: mid}).select('title').exec (err, doc) ->
          User.findOne {email: req.session.email}, (err, user) ->
            Event.create {
                verb: method
                mid: mid
                type: type
                model: doc
                changes: req.body
                owner: user._id
              }, (err, e) ->
                Event.findOne({_id: e._id}).populate('owner').exec (err, doc) ->
                  io.sockets.emit 'feed', doc
                  next()
      else
        next()
    else
      next()

module.exports.log = (req, res, next, io) ->
    if req.method is 'POST'
      if req.path.split('/')[1] is 'api'

        type = req.path.split('/')[2]
        type = type.substr(0, type.length-1)

        method = req.method

        User.findOne {email: req.session.email}, (err, user) ->
          Event.create {
              verb: method
              type: type
              model: res.locals.bundle
              owner: user._id
            }, (err, e) ->
              Event.findOne({_id: e._id}).populate('owner').exec (err, doc) ->
                io.sockets.emit 'feed', doc
                next()
      else
        next()
    else
      next()
