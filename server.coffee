express = require("express")
restful = require("node-restful")
cors = require("cors")
mongoose = restful.mongoose

app = express()

app.use cors()
app.use express.bodyParser()
app.use express.query()

mongoose.connect "mongodb://localhost/projects"

Phases = [
      {
        title: "Proposal",
        phase: 0
      },
      {
        title: "Ideation",
        phase: 1
      },
      {
        title: "Prototype",
        phase: 2
      },
      {
        title: "Evaluation",
        phase: 3
      },
      {
        title: "Shipped",
        phase: 4
      }
    ]


Project = app.resource = restful.model("project", mongoose.Schema(
  title: "string"
  description: "string"
  progress: {
    type: "number"
    default: 0
    required: true
  }
  phase: {
    type: "number"
    default: 1
    required: true
  }
  created_at: {
    type: "date"
    default: Date.now
  }
  is_finished: "boolean"
))

Project.methods [
  "get"
  "post"
  "put"
  "delete"
]

Project.route "total.get", (req, res) ->
  Project.find {}, (err, docs) ->
    res.send {total: docs.length}

Project.register app, "/projects"

app.get "/phase/:id", (req, res) ->
  Project.find {phase: req.params.id},  (err, docs) ->
    res.send docs

app.get "/phases", (req, res) ->
    Project.aggregate
      $group:
        _id: "$phase"
        count:
          $sum : 1
      , (err, docs) ->
        for doc in docs
          Phases[doc._id].count = doc.count
        res.send Phases

console.log 'Listening on post 3000...'
app.listen 3000