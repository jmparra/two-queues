var MQTTPubSub = require('../mqtt_pubsub');


function new_client() {
	/*
  * Returns a new pubsub client instance - MQTT
  */
  var client = new MQTTPubSub();
  return client;
}


/*
*	Loops forever, publishing messages to one channel.
*/
var client = new_client()
  , message = new Array(20).join('h'); //Message size: 20

function publish() {
	client.publish('/perf', message);
	setImmediate(publish);
}

publish();
