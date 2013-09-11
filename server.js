(function() {
  var AdminRoutes, EventSchema, HOST, PORT, Phases, Project, Theme, User, adminWhitelist, app, async, audience, authProject, authTheme, authUser, ejs, express, getAuthLevel, index, isAdmin, isLoggedIn, logTmpl, mongoose, mongourl, restful, url, vcap, _;

  _ = require("underscore");

  express = require("express");

  ejs = require("ejs");

  restful = require("node-restful");

  async = require("async");

  url = require("url");

  mongoose = restful.mongoose;

  Project = require("./models/project");

  Theme = require("./models/theme");

  User = require("./models/user");

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

  if (process.env.VCAP_APPLICATION) {
    vcap = JSON.parse(process.env.VCAP_APPLICATION);
    audience = 'http://' + vcap.uris[0];
  }

  require('express-persona')(app, {
    audience: audience
  });

  mongourl = "mongodb://localhost/projects";

  if (process.env.MONGODB_URL) {
    mongourl = process.env.MONGODB_URL;
  }

  mongoose.connect(mongourl);

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
      }).populate('owner').exec(function(err, doc) {
        if (doc.owner.email === req.session.email || getAuthLevel(req.session.email) === 3) {
          return next();
        } else {
          return res.send('Not Authorized');
        }
      });
    });
  };

  authTheme = function(req, res, next) {
    return isLoggedIn(req, res, function() {
      var theme;
      return theme = Theme.findOne({
        _id: req.params.id
      }).populate('owner').exec(function(err, doc) {
        if (doc.owner.email === req.session.email || getAuthLevel(req.session.email) === 3) {
          return next();
        } else {
          return res.send('Not Authorized');
        }
      });
    });
  };

  authUser = function(req, res, next) {
    return isLoggedIn(req, res, function() {
      return User.findOne({
        _id: req.params.id
      }).exec(function(err, doc) {
        if (req.session.email === doc.email) {
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

  Theme.before('post', isAdmin);

  Theme.before('put', authTheme);

  Theme.before('delete', authTheme);

  User.before('put', authUser);

  Project.before('get', function(req, res, next) {
    var id;
    id = req.route.params.id;
    if (id) {
      return Project.findOne({
        _id: id
      }).populate('themes').populate('owner').exec(function(err, docs) {
        return res.send(docs);
      });
    } else {
      return Project.find().populate('themes').populate('owner').exec(function(err, docs) {
        return res.send(docs);
      });
    }
  });

  Project.after('put', function(req, res, next) {
    return Project.findOne({
      _id: res.locals.bundle._id
    }).populate('themes').populate('owner').exec(function(err, doc) {
      return res.send(doc);
    });
  });

  Theme.before('get', function(req, res, next) {
    if (req.params.id) {
      return Theme.findOne({
        _id: req.params.id
      }).populate('owner').exec(function(err, doc) {
        return Project.find({
          themes: doc._id
        }).populate('themes').populate('owner').exec(function(err, docs) {
          return res.send({
            theme: doc,
            projects: docs
          });
        });
      });
    } else {
      return Theme.find().populate('owner').exec(function(err, docs) {
        return res.send(docs);
      });
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

  User.register(app, "/api/users");

  app.get("/api/:email/projects", function(req, res) {
    return User.findOne({
      email: req.params.email
    }).exec(function(err, doc) {
      return Project.find({
        "owner": doc._id
      }).populate('owner').populate('themes').exec(function(err, projects) {
        return res.send(projects);
      });
    });
  });

  app.get("/api/:email/collaborations", function(req, res) {
    return Project.where("collaborators.email", req.params.email).populate('themes').populate('owner').exec(function(err, collaborations) {
      return res.send(collaborations);
    });
  });

  app.get("/api/:email/themes", function(req, res) {
    return User.findOne({
      email: req.params.email
    }).exec(function(err, doc) {
      return Theme.find({
        "owner": doc._id
      }).populate('owner').exec(function(err, docs) {
        return res.send(docs);
      });
    });
  });

  app.get("/api/phase/:id", function(req, res) {
    return Project.find({
      phase: req.params.id
    }).populate('owner').exec(function(err, docs) {
      return res.send(docs);
    });
  });

  app.get("/api/phases", function(req, res) {
    var phase, queries, _fn, _i, _len;
    queries = [];
    _fn = function(phase) {
      return queries.push(function(next) {
        return Project.count({
          phase: phase.phase
        }, function(err, count) {
          Phases[phase.phase].count = count;
          return next();
        });
      });
    };
    for (_i = 0, _len = Phases.length; _i < _len; _i++) {
      phase = Phases[_i];
      _fn(phase);
    }
    return async.parallel(queries, function() {
      return res.send(Phases);
    });
  });

  index = function(req, res) {
    return res.render('index.html');
  };

  app.get("/", index);

  app.get("/profile", index);

  app.get("/projects", index);

  app.get("/projects/new", index);

  app.get("/:email/projects", index);

  app.get("/:email/themes", index);

  app.get("/project/:projectId", index);

  app.get("/project/:projectId/edit", index);

  app.get("/project/:projectId/:phaseId", index);

  app.get("/phase/:phaseId", index);

  app.get("/themes", index);

  app.get("/themes/new", index);

  app.get("/theme/:themeId", index);

  app.get("/401", index);

  app.get("/admin/dump", AdminRoutes.dump);

  app.post("/admin/load", function(req, res) {
    return isLoggedIn(req, res, function() {
      if (getAuthLevel(req.session.email) > 2) {
        return AdminRoutes.load(req, res);
      } else {
        return res.send('Not Authorized to load db.');
      }
    });
  });

  adminWhitelist = ['dhenein', 'bwinton'];

  getAuthLevel = function(email) {
    var domain, username, _ref;
    if (email) {
      _ref = email.split('@'), username = _ref[0], domain = _ref[1];
      if (domain = 'mozilla.org' || 'mozilla.com' || 'mozillafoundation.org') {
        if (_.contains(adminWhitelist, username)) {
          return 3;
        } else {
          return 2;
        }
      }
    }
    return 0;
  };

  app.get("/getUser", function(req, res) {
    if (req.session.email) {
      return User.findOne({
        email: req.session.email
      }).exec(function(err, doc) {
        if (doc) {
          doc.authLevel = getAuthLevel(doc.email);
          return res.send(doc);
        } else {
          return User.create({
            email: req.session.email
          }, function(err, user) {
            user.authLevel = getAuthLevel(user.email);
            return res.send(user);
          });
        }
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
