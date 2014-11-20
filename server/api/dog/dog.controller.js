/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Dog = require('./dog.model');

// Get list of dogs
exports.index = function(req, res) {
  Dog.find(function (err, dogs) {
    if(err) { return handleError(res, err); }
    return res.json(200, dogs);
  });
};

// Get a single dog
exports.show = function(req, res) {
  Dog.findById(req.params.id, function (err, dog) {
    if(err) { return handleError(res, err); }
    if(!dog) { return res.send(404); }
    return res.json(dog);
  });
};

// Creates a new dog in the DB.
exports.create = function(req, res) {
  Dog.create(req.body, function(err, dog) {
    if(err) { return handleError(res, err); }
    return res.json(201, dog);
  });
};

// Updates an existing dog in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Dog.findById(req.params.id, function (err, dog) {
    if (err) { return handleError(res, err); }
    if(!dog) { return res.send(404); }
    dog.activity.push(req.query);
    dog.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, dog);
    });
  });
};

// Deletes a dog from the DB.
exports.destroy = function(req, res) {
  Dog.findById(req.params.id, function (err, dog) {
    if(err) { return handleError(res, err); }
    if(!dog) { return res.send(404); }
    dog.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
