mongoose = require("node-restful").mongoose
Schema = mongoose.Schema

EventSchema = new Schema
  type: "string"
  details: "string"
  date:
    type: "date"
    default: Date.now

module.exports = EventSchema