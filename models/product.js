(function() {
  var ObjectId, ProductSchema, mongoose, restful;

  restful = require("node-restful");

  mongoose = restful.mongoose;

  ObjectId = mongoose.Schema.Types.ObjectId;

  module.exports = ProductSchema = restful.model("product", mongoose.Schema({
    title: {
      type: "string",
      match: /\S/,
      required: true
    },
    description: "string",
    owner: {
      type: ObjectId,
      ref: 'user'
    },
    created_at: {
      type: "date",
      "default": Date.now
    },
    last_updated: {
      type: Date
    }
  })).methods(["get", "post", "put", "delete"]);

}).call(this);
