express = require("express")
ejs = require("ejs")
restful = require("node-restful")
url = require("url")
cors = require("cors")
mongoose = restful.mongoose
Project = require("./models/project")
Phases = require("./models/phases")
EventSchema = require("./models/event")
AdminRoutes = require("./routes/admin")

# logging template
logTmpl = ejs.compile('<%= date %> (<%= response_time %>ms): ' +
                          '<%= status %> <%= method %> <%= url %>');

app = express()

app.resource = Project

# app.use cors()
app.use express.bodyParser()
app.use express.cookieParser()
app.use express.session
  secret: 'personasecret'
app.use express.query()
app.use (req, res, next) ->
  rEnd = res.end

  # To track response time
  req._rlStartTime = new Date()

  # Setup the key-value object of data to log and include some basic info
  req.kvLog =
    date: req._rlStartTime.toISOString()
    method: req.method
    url: url.parse(req.originalUrl).pathname

  # Proxy the real end function
  res.end = (chunk, encoding) ->
    # Do the work expected
    res.end = rEnd
    res.end chunk, encoding

    # And do the work we want now (logging!)

    # Save a few more variables that we can only get at the end
    req.kvLog.status = res.statusCode
    req.kvLog.response_time = (new Date() - req._rlStartTime)

    # Print the log
    #if (res.statusCode != 200 && res.statusCode != 304)
    console.log logTmpl(req.kvLog)

  next()



app.set('views', __dirname + '/app/dist');
app.engine('html', ejs.renderFile);
app.use(express.static(__dirname + '/app/dist'));

PORT = process.env.PORT || process.env.VCAP_APP_PORT || 3000
HOST = process.env.IP_ADDRESS || process.env.VCAP_APP_HOST || '127.0.0.1'

# Must match your browser's address bar
audience = 'http://' + HOST + ':' + PORT

require('express-persona') app,
  audience: audience

mongoose.connect "mongodb://localhost/projects"

auth = (req, res, next) ->
  if req.session.email
    res.logged_in_email = req.session.email
    next()
  else
    res.send 'Not Authenticated'
    next()

# server side auth on projects
# Project.before('post', auth).before('put', auth).before('get', auth)

Project.before 'put', (req, res, next) ->
  console.log req.route
  console.log req.body
  next()

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

# Angular Soutes
app.get "/", index
app.get "/project/:projectId", index
app.get "/project/:projectId/edit", index
app.get "/project/:projectId/:phaseId", index
app.get "/phase/:phaseId", index

# admin
app.get "/admin/dump", AdminRoutes.dump
app.post "/admin/load", AdminRoutes.load

# auth
app.get "/getUser", (req, res) ->
  res.send {logged_in_email: req.session.email}


console.log "Listening at #{HOST}:#{PORT}..."
app.listen PORT, HOST