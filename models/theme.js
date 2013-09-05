(function() {
  var ThemeSchema, mongoose, restful;

  restful = require("node-restful");

  mongoose = restful.mongoose;

  module.exports = ThemeSchema = restful.model("theme", mongoose.Schema({
    title: "string",
    description: "string",
    owner_email: "string",
    created_at: {
      type: "date",
      "default": Date.now
    },
    is_finished: "boolean"
  })).methods(["get", "post", "put", "delete"]);

}).call(this);
