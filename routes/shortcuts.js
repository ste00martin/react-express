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

module.exports = router;
