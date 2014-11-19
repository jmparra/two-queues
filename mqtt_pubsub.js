var mqtt = require('mqtt');

var MQTTPubSub = function() {
  this.clientId = "two_queue_" + String(process.pid);
  this.pubsub = mqtt.createClient(1883, '127.0.0.1', {clientId: this.clientId});

  return this;
}

MQTTPubSub.prototype.publish = function(channel, message) {
  this.pubsub.publish(channel, String(message), {retain: false});
};

MQTTPubSub.prototype.subscribe = function(channel) {
  this.pubsub.subscribe(channel);
};

MQTTPubSub.prototype.on = function(event, callback) {
  return this.pubsub.on(event, callback);
}

// Expose module
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
  module.exports = MQTTPubSub;
