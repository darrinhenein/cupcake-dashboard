restful = require "node-restful"
mongoose = restful.mongoose

module.exports = restful.model("project", mongoose.Schema(
  title: "string"
  description: "string"
  owner_email: "string"
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