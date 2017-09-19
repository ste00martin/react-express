var express = require('express');
var router = express.Router();

const Shortcuts = require('../autocomplete.js');


router.post('/', function(req, res) {

  res.contentType('application/json');

  var diagnosis = req.body.word;

  client.get(diagnosis, function(error, result) {

    if (result) {
      // the result exists in our cache - return it to our user immediately

      res.send([{"text": result}, {"text": "stuff" }]);

        var shortcuts = [{
        	text: result
        }];

        var output = JSON.stringify(shortcuts);

        res.send(output);
    } else {

        var shortcuts = [{
        	text: diagnosis
        }];

        var output = JSON.stringify(shortcuts);
        res.send(output);
    }

  });

});

module.exports = router;
