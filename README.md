# jsonwire

newline delimited json messages read/write stream

```
var socket;

var app = through(function(msg) {
    // handle parsed objects here
});

var wire;
socket.pipe(wire = jsonwire(app)).pipe(socket);

wire.on('error', function(err) {
    // some parsing or other error
    // pipes are disconnected now
    // up to you to reconnect
});

// app just emits whatever it wants sent
app.emit('data', {foo:'bar'});
```
