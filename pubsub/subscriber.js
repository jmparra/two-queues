var MQTTPubSub = require('../mqtt_pubsub');


function new_client() {
	/*
  * Returns a new pubsub client instance - MQTT
  */
  var client = new MQTTPubSub();
  return client;
}


/*
* Subscribes to one channel, keeping a count of the number of
* messages received. Publishes and resets the total every second.
*/
var client = new_client()
	, seconds = 1000
  , last = new Date()
  , messages = 0;

last = last.getTime() / seconds;

client.subscribe('/perf');
client.on('message', function (topic, msg) {
	var now = new Date();
	messages++;
  now = now.getTime() / seconds;
  if ((now - last) > 1) {
    client.publish('/metrics', messages);
    last = now;
    messages = 0;
  }
});
