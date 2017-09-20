var express = require('express');
var router = express.Router();

const autocomplete = require('../autocomplete.js');
var Shortcuts = new autocomplete();

console.log("start");
console.log(Shortcuts.get("cancer"));


router.post('/', function(req, res) {

  res.contentType('application/json');

  var diagnosis = req.body.word;
  console.log("diagnosis: "+ diagnosis + "wordcount:" + diagnosis.length);
  var response = Shortcuts.get(diagnosis);
  console.log("response: " + JSON.stringify(response));

  res.json(response);
});


router.post('/new', function(req, res) {

  res.contentType('application/json');

  var key = req.body.key;
  var value = req.body.value;

  Shortcuts.set(key, value);
  console.log(key);

  var response = Shortcuts.get(key);

  console.log(value);
  console.log("response: "+ JSON.stringify(response));
  res.json(response);
});

module.exports = router;
