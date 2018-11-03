_ = require("underscore")
express = require("express")
ejs = require("ejs")
restful = require("node-restful")
async = require("async")
url = require("url")
mongoose = restful.mongoose
moment = require("moment")
helmet = require("helmet")
Project = require("./models/project")
Theme = require("./models/theme")
Product = require("./models/product")
User = require("./models/user")
Phases = require("./models/phases")
Statuses = require("./models/status")
Events = require("./models/event")
AdminRoutes = require("./routes/admin")
Logger = require("./logger")

# logging template
logTmpl = ejs.compile('<%= date %> (<%= response_time %>ms): ' +
                          '<%= status %> <%= method %> <%= url %>');

app = express()
server = require("http").createServer app

# security middleware

policy = {
  defaultPolicy: {
    'default-src': ["'none'", 'https://login.persona.org'],
    'img-src': ['*'],
    'font-src': ['*'],
    'script-src': ["'self'", 'www.google-analytics.com', 'https://*.persona.org', "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", 'fonts.googleapis.com', "'unsafe-inline'"],
    'xhr-src': ["'self'"],
    'connect-src': ["'self'"]
  }
}

helmet.csp.policy(policy);

# app.use helmet.csp()
helmet.defaults app

app.use express.compress()
app.use express.bodyParser()
app.use express.cookieParser()
app.use express.session
  secret: 'personasecret'
app.use express.query()

#logging
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

#static view config
app.set('views', __dirname + '/app/');
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);
app.use(express.static(__dirname + '/app/dist'));

#port and ip config based on env
PORT = process.env.PORT || process.env.VCAP_APP_PORT || 3000
HOST = process.env.IP_ADDRESS || process.env.VCAP_APP_HOST || '127.0.0.1'

mongourl = "mongodb://localhost/projects"
if process.env.MONGODB_URL
  mongourl = process.env.MONGODB_URL
mongoose.connect mongourl

# is user logged in?
isLoggedIn = (req, res, next) ->
  req.session.email = "bwinton@mozilla.com"
  if req.session.email
    res.logged_in_email = req.session.email
    next()
  else
    res.send 401

# can user edit project?
authProject = (req, res, next) ->
  isLoggedIn req, res, ->
    project = Project.findOne({_id:req.params.id})
                     .populate('owner')
                     .exec (err, doc) ->
                       if doc.owner.email is req.session.email or getAuthLevel(req.session.email) is 3
                         next()
                       else
                         res.send 403

# can user edit theme?
authTheme = (req, res, next) ->
  isLoggedIn req, res, ->
    theme = Theme.findOne({_id:req.params.id})
                 .populate('owner')
                 .exec (err, doc) ->
                   if doc.owner.email is req.session.email or getAuthLevel(req.session.email) is 3
                     next()
                   else
                     res.send 403

# can user edit product?
authProduct = (req, res, next) ->
  isLoggedIn req, res, ->
    product = Product.findOne({_id:req.params.id})
                 .populate('owner')
                 .exec (err, doc) ->
                   if doc.owner.email is req.session.email or getAuthLevel(req.session.email) is 3
                     next()
                   else
                     res.send 403

# can edit user?
authUser = (req, res, next) ->
  isLoggedIn req, res, ->
    User.findOne({_id: req.params.id}).lean().exec (err, doc) ->
      if req.session.email is doc.email
        next()
      else
        res.send 403

# log event to event feed
logEvent = (req, res, next) ->
  if (res.locals.status_code >= 200 and res.locals.status_code < 300) or req.method is 'DELETE'
    Logger.log req, res, next, io
  else
    next()


# server side auth on projects
Project.before 'post' , isLoggedIn
Project.before 'put'  , authProject
Theme.before   'post' , isLoggedIn
Theme.before   'put'  , authTheme
Product.before 'post' , isLoggedIn
Product.before 'put'  , authProduct
User.before    'put'  , authUser

# log deletions before record is gone
Theme.before 'delete'  , (req, res, next) ->
  authTheme req, res, ->
    logEvent req, res, next

Product.before 'delete'  , (req, res, next) ->
  authProduct req, res, ->
    logEvent req, res, next

Project.before 'delete' , (req, res, next) ->
  authProject req, res, ->
    logEvent req, res, next



# logging
Project.after 'post' , logEvent
Theme.after 'put'    , logEvent
Theme.after 'post'   , logEvent
Product.after 'put'  , logEvent
Product.after 'post' , logEvent

Project.before 'get', (req, res, next) ->
  # override node-restful and populate the themes
  id = req.route.params.id
  if id
    Project.findOne({_id: id})
           .populate('themes')
           .populate('products')
           .populate('owner')
           .populate('status.related')
           .exec (err, doc) ->
              if doc
                res.send doc
              else
                res.send 404
  else
    Project.find().populate('themes').populate('products').populate('owner').populate('status.related').exec (err, docs) ->
      res.send docs

Project.after 'put', (req, res, next) ->
  Project.findOne({_id: res.locals.bundle._id})
         .populate('themes')
         .populate('products')
         .populate('owner')
         .populate('status.related')
         .exec (err, doc) ->
           logEvent req, res, next
           res.send doc

Theme.before 'get', (req, res, next) ->
  # add related projects to theme response if querying one theme
  if req.params.id
    Theme.findOne({_id: req.params.id})
         .populate('owner')
         .exec (err, doc) ->
          if doc
             Project.find({themes: doc._id})
                    .populate('themes')
                    .populate('products')
                    .populate('owner')
                    .exec (err, docs) ->
                      res.send
                        theme: doc
                        projects: docs
          else
            res.send 404
  else
    Theme.find().populate('owner').exec (err, docs) ->
      res.send docs

Product.before 'get', (req, res, next) ->
  # add related projects to product response if querying one product
  if req.params.id
    Product.findOne({_id: req.params.id})
         .populate('owner')
         .exec (err, doc) ->
          if doc
             Project.find({products: doc._id})
                    .populate('themes')
                    .populate('products')
                    .populate('owner')
                    .exec (err, docs) ->
                      res.send
                        product: doc
                        projects: docs
          else
            res.send 404
  else
    Product.find().populate('owner').exec (err, docs) ->
      res.send docs

Project.route "events.get",
  detail: yes
  handler: (req, res, next) ->
    Events.find({mid: req.params.id}).sort('-date').exec (err, docs) ->
      res.send docs

Project.route "phases.get",
  detail: yes
  handler: (req, res, next) ->
    Events.find({changes: 'phases'}).exec (err, docs) ->
      res.send docs

Project.route "activity.get",
  detail: yes
  handler: (req, res, next) ->
    now = moment().toDate()
    ago = moment().subtract('days', 7).toDate()
    arr = []
    for i in [0...7]
      arr[i] =
        date: moment().subtract('days', i).format("MM-DD-YYYY")

    Events.find({
            mid: req.params.id,
            date: {"$gt": ago, "$lte": now}
          })
          .sort('-date')
          .lean()
          .exec (err, docs) ->
            docs = _.countBy docs, (e) ->
              return moment(e.date).format("MM-DD-YYYY")
            for d in arr
              d.count = docs[d.date] || 0
            res.send arr

Project.route "total.get", (req, res) ->
  Project.find {}, (err, docs) ->
    res.send {total: docs.length}

Project.register app, "/api/projects"
Theme.register app, "/api/themes"
Product.register app, "/api/products"
User.register app, "/api/users"

app.get "/api/events/:num?", (req, res) ->
  num = req.params.num || 1000
  Events.find().sort('-date').limit(num).populate('owner').exec (err, docs) ->
    res.send docs

app.get "/api/events/:num/counts", (req, res) ->
  num = req.params.num
  Events.find().sort('-date').limit(num).lean().exec (err, docs) ->
    docs = _.countBy docs, (e) ->
      return moment(e.date).format("MM-DD-YYYY")
    res.send docs

app.get "/api/:email/projects", (req, res) ->
  User.findOne({email: req.params.email})
      .exec (err, doc) ->
        Project.find({"owner": doc._id}).populate('owner').populate('themes').populate('products').exec (err, projects) ->
          res.send projects

app.get "/api/:email/collaborations", (req, res) ->
  Project.where("collaborators.email", req.params.email)
         .populate('themes')
         .populate('products')
         .populate('owner')
         .exec (err, collaborations) ->
           res.send collaborations

app.get "/api/:email/themes", (req, res) ->
  User.findOne({email: req.params.email}).exec (err, doc) ->
    Theme.find({"owner": doc._id}).populate('owner').exec (err, docs) ->
      res.send docs

app.get "/api/:email/products", (req, res) ->
  User.findOne({email: req.params.email}).exec (err, doc) ->
    Product.find({"owner": doc._id}).populate('owner').exec (err, docs) ->
      res.send docs

app.get "/api/phase/:id", (req, res) ->
  Project.find({phase: req.params.id}).populate('owner').exec (err, docs) ->
    res.send docs

app.get "/api/phases", (req, res) ->
    queries = []

    for phase in Phases
      do (phase) ->
        queries.push (next) ->
          Project.count {phase: phase.phase}, (err, count) ->
            Phases[phase.phase].count = count
            next()

    async.parallel queries, ->
      res.send Phases

app.get "/api/statuses", (req, res) ->
  res.send Statuses

indexRoute = (req, res) ->
  if !req.session.email
    req.session.email = "bwinton@mozilla.com"

  queries = []
  bootstrap = {}

  bootstrap.phases = Phases

  queries.push (next) ->
    Project.find().populate('themes').populate('products').populate('owner').populate('status.related').exec (err, docs) ->
      bootstrap.projects = docs
      next()

  queries.push (next) ->
    Product.find().populate('owner').exec (err, docs) ->
      bootstrap.products = docs
      next()

  queries.push (next) ->
    Theme.find().populate('owner').exec (err, docs) ->
      bootstrap.themes = docs
      next()

  queries.push (next) ->
    Events.find().sort('-date').limit(1000).populate('owner').exec (err, docs) ->
      bootstrap.events = docs
      next()

  async.parallel queries, ->
    res.render 'dist/base.html',
      bootstrap: bootstrap

projectRoute = (req, res) ->
  if !req.session.email
    req.session.email = "bwinton@mozilla.com"
  queries = []
  bootstrap = {}

  bootstrap.phases = Phases

  queries.push (next) ->
    Product.find().populate('owner').exec (err, docs) ->
      bootstrap.products = docs
      next()

  queries.push (next) ->
    Theme.find().populate('owner').exec (err, docs) ->
      bootstrap.themes = docs
      next()

  queries.push (next) ->
    Project.findOne({_id: req.route.params.projectId})
           .populate('themes')
           .populate('products')
           .populate('owner')
           .populate('status.related')
           .exec (err, doc) ->
              bootstrap.project = doc
              next()

  async.parallel queries, ->
    res.render 'dist/base.html',
      bootstrap: bootstrap

# Angular Routes
app.get "/"                            , indexRoute
app.get "/profile"                     , indexRoute
app.get "/projects"                    , indexRoute
app.get "/projects/new"                , indexRoute
app.get "/:email/projects"             , indexRoute
app.get "/:email/themes"               , indexRoute
app.get "/project/:projectId"          , projectRoute
app.get "/project/:projectId/edit"     , projectRoute
app.get "/project/:projectId/:phaseId" , projectRoute
app.get "/phase/:phaseId"              , indexRoute
app.get "/themes"                      , indexRoute
app.get "/themes/new"                  , indexRoute
app.get "/theme/:themeId"              , indexRoute
app.get "/products"                    , indexRoute
app.get "/products/new"                , indexRoute
app.get "/product/:productId"          , indexRoute
app.get "/about"                       , indexRoute
app.get "/401"                         , indexRoute

# admin
app.get "/admin/dump", AdminRoutes.dump

app.post "/admin/load", (req, res) ->
  isLoggedIn req, res, ->
    if getAuthLevel(req.session.email) > 2
      AdminRoutes.load req, res
    else
      res.send 403

# Auth Levels
# 0 : Public (no write/delete)
# 1 : Not Used
# 2 : Editor (can create/delete/edit own models)
# 3 : Admin  (all access)

# whitelist of admin emails
adminWhitelist = ['dhenein', 'bwinton', 'lco', 'madhava']

getAuthLevel = (email) ->
  if email
    [username, domain] = email.split '@'
    if domain = 'mozilla.org' or 'mozilla.com' or 'mozillafoundation.org'
      if _.contains adminWhitelist, username
        return 3
      else
        return 2
  return 0

# auth user
app.get "/getUser", (req, res) ->
  console.log "Getting #{req.session.email}"
  if req.session.email
    User.findOne({email: req.session.email}).lean().exec (err, doc) ->
      if doc
        doc.authLevel = getAuthLevel doc.email
        res.send doc
      else
        User.create {
          email: req.session.email
        }, (err, user) ->
          user.authLevel = getAuthLevel user.email
          res.send user
  else
    res.send 200

app.get '/api', (req, res) ->
  routes = []
  routes.push app.routes.get
  routes.push app.routes.post
  routes.push app.routes.put
  routes.push app.routes.delete
  routes = _.sortBy _.flatten(routes), (route) ->
    return route.path
  res.render 'dist/api.html',
    routes: routes

console.log "Listening at #{HOST}:#{PORT}..."
server.listen PORT, HOST
