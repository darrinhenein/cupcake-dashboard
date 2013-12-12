restful = require "node-restful"
mongoose = restful.mongoose
ObjectId = mongoose.Schema.Types.ObjectId

ProjectSchema = restful.model("project", mongoose.Schema(
  title: {
    type: "string"
    match: /\S/
    required: true
  }
  description: "string"
  owner: {
    type: ObjectId
    ref: 'user'
  }
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
  bugs: [{
    type: String
    match: /\d/
  }]
  created_at: {
    type: "date"
    default: Date.now
  }
  last_updated: {
    type: Date
  }
  collaborators: [
    {
      email: "string"
    }
  ]
  status: {
    index: {
      type: "number"
      default: 0
    }
    related: [{
      type: ObjectId
      ref: 'project'
    }]
  }
  is_finished: "boolean"
  phases: {}
  themes: [{
    type: ObjectId
    ref: 'theme'
    }]
  products: [{
    type: ObjectId
    ref: 'product'
    }]
)).methods [
  "get"
  "post"
  "put"
  "delete"
  ]

module.exports = ProjectSchema