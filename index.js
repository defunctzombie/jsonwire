var split = require('split');
var duplexer = require('duplexer');
var through = require('through');

module.exports = json;

function json(stream) {

  var parse = through(function(chunk) {
    try {
      this.queue(JSON.parse(chunk));
    }
    catch (err) {
      this.emit('error', err);
    }
  });

  var serialize = through(function(chunk) {
    this.queue(JSON.stringify(chunk) + '\n');
  });

  var input = split();
  var output = input.pipe(parse).pipe(stream).pipe(serialize);

  var ss = duplexer(input, output);
  parse.on('error', function(err) {
    ss.emit('error', err);
  })

  return ss;
}
