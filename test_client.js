var program       = require('commander')
  , MQTTPubSub    = require('./mqtt_pubsub')
	, child_process = require('child_process');

function new_client() {
	/*
  * Returns a new pubsub client instance - MQTT
  * client, based on command-line arg.
  */
  var client = new MQTTPubSub();
  return client;
}

function publisher() {
  publicadores.push(child_process.fork(__dirname + "/pubsub/publisher"));
}

function subscriber() {
  consumidores.push(child_process.fork(__dirname + "/pubsub/subscriber"));
}

function runWorkers(cb) {
  for (var i = 0; i < program.numClients; i++) {
    cb();
  }
}

function clean() {
	// Kill all process created
  for(var k in publicadores)
    publicadores[k].kill();
  for(var k in consumidores)
    consumidores[k].kill();
  
  process.exit();
}

function get_metrics() {
	/*
	* Subscribes to the metrics channel and returns messages from
  * it until --num-seconds has passed.
  */
  var client = new_client()
    , metrics = []
    , seconds = 1000
    , start = new Date();

  start = start.getTime() / seconds;

  client.subscribe('/metrics');
	client.on('message', function (topic, message) {
		metrics.push(message);
	});

  function metric() {
    var now = new Date();
    now = now.getTime() / seconds;
    if ((now - start) >= program.numSeconds) {
    	client = null;
      console.log(metrics[Math.ceil(metrics.length/2)], 'median msg/sec');
      clean();
    } else {
      setImmediate(metric);
    }
  }

  metric();
}

// Set up and parse command-line args.
var channels = []
  , publicadores = []
  , consumidores = [];

program
  .version('0.0.1')
  .usage('[options]')
  .option('--host <host>', 'Address broker', '10.128.90.155')
  .option('--num-clients <n>', 'Num of clients', 1)
  .option('--num-seconds <n>', 'Seconds execution test', 10)
  .option('--num-channels <n>', 'Num of channels', 1)
  .option('--message-size <n>', 'Size of message', 20)
  .option('--quiet', 'verbose')
  .parse(process.argv);

for (var i = 0; i < program.numChannels; i++) {
	channels.push(i);
}

//Create publisher/subscriber workers, pausing to allow
//publishers to hit full throttle
runWorkers(publisher);
setTimeout(runWorkers(subscriber), 1 * 1000); //1 seconds

// Consume metrics until --num-seconds has passed, and display
// the median value.
get_metrics();
