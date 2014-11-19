var zmq = require('zmq');

var ZMQPubSub = function(host) {
  this.pub = zmq.socket('push');
  this.pub.connect('tcp://127.0.0.1:5562');
  this.sub = zmq.socket('sub');
  this.sub.connect('tcp://127.0.0.1:5561');
  this.channels = [];

  return this;
}

ZMQPubSub.prototype.publish = function(channel, message) {
  this.pub.send(channel+' '+message);
};

ZMQPubSub.prototype.subscribe = function(channel) {
  this.sub.subscribe(channel);
};

ZMQPubSub.prototype.on = function(event, callback) {
  return this.sub.on(event, callback);
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
  module.exports = ZMQPubSub;
