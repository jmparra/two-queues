var zmq = require('zmq');

var serve = function(quiet) {
  var receiver = zmq.socket('pull');
  receiver.bind('tcp://*:5562');
  var sender = zmq.socket('pub');
  sender.bind('tcp://*:5561');

  var seconds = 1000;
  var last = new Date();
  var message = 0;
  last = last.getTime() / seconds;

  receiver.on('message', function (packet) {
    sender.send(packet);
    if (!quiet) {
      message++;
      var now = new Date();
      now = now.getTime() / seconds;
      if ((now - last) > 1) {
        console.log(message, 'msg/sec');
        last = now;
        message = 0;
      }
    } //quiet
  });
}

// Exposed
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = serve;
}