(function() {
  var AdminRoutes, EventSchema, HOST, PORT, Phases, Project, Theme, adminWhitelist, app, audience, authProject, ejs, express, getAuthLevel, index, isAdmin, isLoggedIn, logTmpl, mongoose, restful, url, _;

  _ = require("underscore");

  express = require("express");

  ejs = require("ejs");

  restful = require("node-restful");

  url = require("url");

  mongoose = restful.mongoose;

  Project = require("./models/project");

  Theme = require("./models/theme");

  Phases = require("./models/phases");

  EventSchema = require("./models/event");

  AdminRoutes = require("./routes/admin");

  logTmpl = ejs.compile('<%= date %> (<%= response_time %>ms): ' + '<%= status %> <%= method %> <%= url %>');

  app = express();

  app.resource = Project;

  app.use(express.bodyParser());

  app.use(express.cookieParser());

  app.use(express.session({
    secret: 'personasecret'
  }));

  app.use(express.query());

  app.use(function(req, res, next) {
    var rEnd;
    rEnd = res.end;
    req._rlStartTime = new Date();
    req.kvLog = {
      date: req._rlStartTime.toISOString(),
      method: req.method,
      url: url.parse(req.originalUrl).pathname
    };
    res.end = function(chunk, encoding) {
      res.end = rEnd;
      res.end(chunk, encoding);
      req.kvLog.status = res.statusCode;
      req.kvLog.response_time = new Date() - req._rlStartTime;
      return console.log(logTmpl(req.kvLog));
    };
    return next();
  });

  app.set('views', __dirname + '/app/dist');

  app.engine('html', ejs.renderFile);

  app.use(express["static"](__dirname + '/app/dist'));

  PORT = process.env.PORT || process.env.VCAP_APP_PORT || 3000;

  HOST = process.env.IP_ADDRESS || process.env.VCAP_APP_HOST || '127.0.0.1';

  audience = 'http://' + HOST + ':' + PORT;

  require('express-persona')(app, {
    audience: audience
  });

  mongoose.connect("mongodb://localhost/projects");

  isLoggedIn = function(req, res, next) {
    if (req.session.email) {
      res.logged_in_email = req.session.email;
      return next();
    } else {
      res.send('Not Authenticated');
      return next();
    }
  };

  authProject = function(req, res, next) {
    return isLoggedIn(req, res, function() {
      var project;
      return project = Project.findOne({
        _id: req.params.id
      }).exec(function(err, doc) {
        if (doc.owner_email === req.session.email || getAuthLevel(req.session.email) === 3) {
          return next();
        } else {
          return res.send('Not Authorized');
        }
      });
    });
  };

  isAdmin = function(req, res, next) {
    return isLoggedIn(req, res, function() {
      return next();
    });
  };

  Project.before('post', isAdmin);

  Project.before('put', authProject);

  Project.before('delete', authProject);

  Project.before('get', function(req, res, next) {
    var id;
    id = req.route.params.id;
    if (id) {
      return Project.findOne({
        _id: id
      }).populate('themes').exec(function(err, docs) {
        return res.send(docs);
      });
    } else {
      return Project.find().populate('themes').exec(function(err, docs) {
        return res.send(docs);
      });
    }
  });

  Project.after('put', function(req, res, next) {
    return Project.findOne({
      _id: res.locals.bundle._id
    }).populate('themes').exec(function(err, doc) {
      return res.send(doc);
    });
  });

  Theme.before('get', function(req, res, next) {
    if (req.params.id) {
      return Theme.findOne({
        _id: req.params.id
      }).exec(function(err, doc) {
        return Project.find({
          themes: doc._id
        }).populate('themes').exec(function(err, docs) {
          return res.send({
            theme: doc,
            projects: docs
          });
        });
      });
    } else {
      return next();
    }
  });

  Project.route("total.get", function(req, res) {
    return Project.find({}, function(err, docs) {
      return res.send({
        total: docs.length
      });
    });
  });

  Project.register(app, "/api/projects");

  Theme.register(app, "/api/themes");

  app.get("/api/phase/:id", function(req, res) {
    return Project.find({
      phase: req.params.id
    }, function(err, docs) {
      return res.send(docs);
    });
  });

  app.get("/api/phases", function(req, res) {
    var phase, _i, _len;
    for (_i = 0, _len = Phases.length; _i < _len; _i++) {
      phase = Phases[_i];
      phase.count = 0;
    }
    return Project.aggregate({
      $group: {
        _id: "$phase",
        count: {
          $sum: 1
        }
      }
    }, function(err, docs) {
      var doc, _j, _len1;
      for (_j = 0, _len1 = docs.length; _j < _len1; _j++) {
        doc = docs[_j];
        Phases[doc._id].count = doc.count;
      }
      return res.send(Phases);
    });
  });

  index = function(req, res) {
    return res.render('index.html');
  };

  app.get("/", index);

  app.get("/projects", index);

  app.get("/projects/new", index);

  app.get("/project/:projectId", index);

  app.get("/project/:projectId/edit", index);

  app.get("/project/:projectId/:phaseId", index);

  app.get("/phase/:phaseId", index);

  app.get("/themes", index);

  app.get("/theme/:themeId", index);

  app.get("/401", index);

  app.get("/admin/dump", AdminRoutes.dump);

  app.post("/admin/load", AdminRoutes.load);

  adminWhitelist = ['darrin', 'dhenein'];

  getAuthLevel = function(email) {
    var domain, username, _ref;
    _ref = email.split('@'), username = _ref[0], domain = _ref[1];
    console.log(username, domain);
    if (domain = 'mozilla.org' || 'mozilla.com') {
      if (_.contains(adminWhitelist, username)) {
        return 3;
      } else {
        return 2;
      }
    }
    return 0;
  };

  app.get("/getUser", function(req, res) {
    if (req.session.email) {
      return res.send({
        email: req.session.email,
        authLevel: getAuthLevel(req.session.email)
      });
    } else {
      return res.send({
        error: 'Not logged in'
      });
    }
  });

  console.log("Listening at " + HOST + ":" + PORT + "...");

  app.listen(PORT, HOST);

}).call(this);
