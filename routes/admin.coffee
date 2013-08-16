Project = require "../models/project"
mongoose = require("node-restful").mongoose

module.exports =
  dump: (req, res) ->
    Project.find (err, docs) ->
      res.json docs

  load: (req, res) ->
    docs = req.body
    for doc in docs
      Project.create doc, (err) ->
        console.log('Error: ' + err.message) if err
    res.send 'Created ' + docs.length + ' records'
