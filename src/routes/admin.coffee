Project = require "../models/project"
Phases = require "../models/phases"
User = require "../models/user"
Theme = require "../models/theme"
mongoose = require("node-restful").mongoose
async = require("async")
pkg = require("../package.json")

module.exports =
  dump: (req, res) ->
    queue = []
    response =
      version: pkg.version

    queue.push (next) ->
      Project.find (err, docs) ->
        response.projects = docs
        next()

    queue.push (next) ->
      Theme.find (err, docs) ->
        response.themes = docs
        next()

    queue.push (next) ->
      User.find (err, docs) ->
        response.users = docs
        next()

    queue.push (next) ->
      response.phases = Phases
      next()

    async.parallel queue, ->
      res.send response

  load: (req, res) ->
    res.send 'Nope'
