'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DogActivity = new Schema({
  level: Number,
  addedAt: { type: Date, default: Date.now, expires: '48h' }
});

var DogSchema = new Schema({
  name: String,
  color: String,
  race: String,
  activity: [DogActivity]
});

module.exports = mongoose.model('Dog', DogSchema);
