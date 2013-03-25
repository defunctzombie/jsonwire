var test = require('tape');
var through = require('through');

var jsonwire = require('./index');
var json = JSON.stringify;

test('simple', function(assert) {
    assert.plan(1);

    var net = through(function(d) {
        this.queue(d);
    });

    var wire = jsonwire(net);
    wire.once('data', function(d) {
        assert.deepEqual(d, {foo: 'bar'});
    });

    // pretend the transport got some data
    net.emit('data', json({foo: 'bar'}) + '\n');
});

test('partial', function(assert) {
    assert.plan(1);

    var net = through(function(d) {
        this.queue(d);
    });

    var wire = jsonwire(net);
    wire.once('data', function(d) {
        assert.deepEqual(d, {foo: 'bar'});
    });

    net.emit('data', '{');
    net.emit('data', '"foo":');
    net.emit('data', '"bar"');
    net.emit('data', '}');
    net.emit('data', '\n');
});

test('multi', function(assert) {
    assert.plan(2);

    var net = through(function(d) {
        this.queue(d);
    });

    var wire = jsonwire(net);
    wire.on('data', function(d) {
        assert.deepEqual(d, {foo: 'bar'});
    });

    net.emit('data', '{"foo":"bar"}\n');
    net.emit('data', '{"foo":');
    net.emit('data', '"bar"}\n');
});

test('parse error', function(assert) {
    assert.plan(1);

    var net = through(function(d) {
        this.queue(d);
    });

    var wire = jsonwire(net);
    wire.on('error', function(err) {
        assert.equal(err.message, 'Unexpected token f');
    });

    net.emit('data', '{foo:"bar}\n');
});

test('net error', function(assert) {
    assert.plan(1);

    var net = through(function(d) {
        this.queue(d);
    });

    var wire = jsonwire(net);
    wire.on('error', function(err) {
        assert.equal(err.message, 'foobar');
    });

    net.emit('error', new Error('foobar'));
});
