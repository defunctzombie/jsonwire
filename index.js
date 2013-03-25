var split = require('split');
var through = require('through');

module.exports = json;

function json(transport) {

  var input = through(function(data) {
    transport.write(JSON.stringify(data) + '\n')
  });

  var output = through(function(data) {
    try {
      this.queue(JSON.parse(data))
    }
    catch (err) {
      this.emit('error', err)
    }
  });

  var out = transport.pipe(split()).pipe(output)

  transport.on('error', function(err) {
    input.emit('error', err);
  });

  out.on('error', function(err) {
    input.emit('error', err);
  });

  out.on('data', function(chunk) {
    input.emit('data', chunk);
  });

  return input;
}
