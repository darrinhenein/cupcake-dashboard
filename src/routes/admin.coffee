Project = require "../models/project"
Phases = require "../models/phases"
User = require "../models/user"
Theme = require "../models/theme"
Product = require "../models/product"
Event = require "../models/event"
mongoose = require("node-restful").mongoose
async = require("async")
pkg = require("../package.json")

module.exports =
  dump: (req, res) ->
    queue = []
    response =
      version: pkg.version
      date: new Date()

    queue.push (next) ->
      Project.find (err, docs) ->
        response.projects = docs
        next()

    queue.push (next) ->
      Theme.find (err, docs) ->
        response.themes = docs
        next()

    queue.push (next) ->
      Product.find (err, docs) ->
        response.products = docs
        next()

    queue.push (next) ->
      User.find (err, docs) ->
        response.users = docs
        next()

    queue.push (next) ->
      Event.find (err, docs) ->
        response.events = docs
        next()

    queue.push (next) ->
      response.phases = Phases
      next()

    async.parallel queue, ->
      res.send response

  load: (req, res) ->
    data = req.body
    queue = []

    dropProjects = (next) ->
      mongoose.connection.db.dropCollection 'projects', (err, docs) ->
        next()

    dropThemes = (next) ->
      mongoose.connection.db.dropCollection 'themes', (err, docs) ->
        next()

    dropProducts = (next) ->
      mongoose.connection.db.dropCollection 'products', (err, docs) ->
        next()

    dropUsers = (next) ->
      mongoose.connection.db.dropCollection 'users', (err, docs) ->
        next()

    dropEvents = (next) ->
      mongoose.connection.db.dropCollection 'events', (err, docs) ->
        next()

    queue.push (next) ->
      Project.create data.projects, (err) ->
        console.log "created " + data.projects.length + " projects"
        next()

    queue.push (next) ->
      Theme.create data.themes, (err) ->
        console.log "created " + data.themes.length + " themes"
        next()

    queue.push (next) ->
      Product.create data.products, (err) ->
        console.log "created " + data.products.length + " products"
        next()

    queue.push (next) ->
      User.create data.users, (err) ->
        console.log "created " + data.users.length + " users"
        next()

    queue.push (next) ->
      Event.create data.events, (err) ->
        console.log "created " + data.events.length + " events"
        next()

    async.parallel [dropProjects, dropThemes, dropProducts, dropUsers, dropEvents], (next) ->
      async.parallel queue, (next) ->
        res.send
          message:"Database recreated successfully."
          date: data.date


