# jsonwire

newline delimited json messages read/write stream

```
var socket;

var wire = jsonwire(socket);

// outgoing message on the socket, json.strigify
wire.write({foo: 'bar'});

// incomming messages parsed with json.parse
wire.on('data', function(msg) {
});
```
