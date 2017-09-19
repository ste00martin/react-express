'use strict';

var fs = require("fs");

class Suggestions {
  constructor() {
    var diagnosisFile = fs.readFileSync("./short-diagnoses.txt", "utf-8");
    var textByLine = diagnosisFile.split("\n");

    this.output = {};

    textByLine.forEach(diagnosis => {

      var multiline = diagnosis.split(' ');
      if (multiline.length > 1) {
        multiline.forEach(word => {

          this.set(word, diagnosis);

        });
      }

    });
  }

  get(key) {
    var result = this.output[key];
    if (result == null) {
      result = [];
    }
    return result;
  }

  set(key, val) {

    var existing = this.get(key);
    var newVal = [{text: val}];
    this.output[key] = newVal.concat(existing);

  }
}

// var stuff = new Suggestions();
// console.log(stuff.get('cancer'));

module.exports = Suggestions;


