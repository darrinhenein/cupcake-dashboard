restful = require "node-restful"
mongoose = restful.mongoose

module.exports = UserSchema = restful.model("user", mongoose.Schema(
  email: {
    type: "string"
    required: true
  }
  first_name: "string"
  last_name: "string"
  authLevel: "number"
  created_at: {
    type: "date"
    default: Date.now
  }
)).methods [
  "get"
  "post"
  "put"
  "delete"
]