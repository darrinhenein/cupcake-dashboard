express = require("express")
ejs = require("ejs")
restful = require("node-restful")
cors = require("cors")
mongoose = restful.mongoose
Phases = require("./models/phases")
EventSchema = require("./models/event")

app = express()

app.use cors()
app.use express.bodyParser()
app.use express.query()

app.set('views', __dirname + '/app/dist');
app.engine('html', ejs.renderFile);
app.use(express.static(__dirname + '/app/dist'));

mongoose.connect "mongodb://localhost/projects"

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
    default: 0
    required: true
  }
  created_at: {
    type: "date"
    default: Date.now
  }
  is_finished: "boolean"
  phases: {}
)).methods [
  "get"
  "post"
  "put"
  "delete"
]

Project.route "total.get", (req, res) ->
  Project.find {}, (err, docs) ->
    res.send {total: docs.length}

Project.register app, "/api/projects"

app.get "/api/phase/:id", (req, res) ->
  Project.find {phase: req.params.id},  (err, docs) ->
    res.send docs

app.get "/api/phases", (req, res) ->
    Project.aggregate
      $group:
        _id: "$phase"
        count:
          $sum : 1
      , (err, docs) ->
        for doc in docs
          Phases[doc._id].count = doc.count
        res.send Phases

index = (req, res) -> res.render 'index.html'

app.get "/", index
app.get "/project/:projectId", index
app.get "/project/:projectId/:phaseId", index
app.get "/phase/:phaseId", index

console.log 'Listening on post 3000...'
app.listen 3000