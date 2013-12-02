cupcake-dashboard
=================

A dashboard for cupcakes.

### Developers: ###

*Required: node.js, npm, bower.*

1. `npm install` to install dependencies.
1. `bower install` and `npm install` in the /app directory to install client app dependencies.
1. Needs mongo running.
1. `grunt` in the main directory to build the server.
1. `node server.js` to start the server.
1. `grunt build` in /app to build the angular app.

### Deployers: ###

1. Download the [stackato client](https://api.paas.allizom.org/console/client/)
and save it as `stackato`
1. `stackato target api.paas.allizom.org` (Do this once.)
1. `stackato login` (Do this once, too.)
1. `stackato info` (Do this once to make sure it‘s all working.)
1. (Optionally do a `stackato delete` to remove the old version.)
1. `stackato push` (Do this every time you want to deploy. ;)
