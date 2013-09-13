restful = require "node-restful"
mongoose = restful.mongoose
Schema = mongoose.Schema
ObjectId = mongoose.Schema.Types.ObjectId

module.exports = EventSchema = restful.model("event", mongoose.Schema(
  verb: "string"
  mid: "string"
  type: "string"
  model: "mixed"
  changes: "mixed"
  owner: {
    type: ObjectId
    ref: 'user'
  }
  date:
    type: "date"
    default: Date.now
)).methods [
  'get'
]