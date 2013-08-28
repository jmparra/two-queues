
import time
import mosquitto
import os


class MQTTPubSub(object):

    def __init__(self, host="127.0.0.1"):
        #create an mqtt client
        mypid = os.getpid()
        client_uniq = "two_queue_"+str(mypid)
        self.pubsub = mosquitto.Mosquitto(client_uniq)
        self.pubsub.connect(host)
        #self.pub = context.socket(zmq.PUSH)
        #self.pub.connect("tcp://%s:%s" % (host, 5562))
        #self.sub = context.socket(zmq.SUB)
        #self.sub.connect("tcp://%s:%s" % (host, 5561))
        self.channels = set()

    def on_message(mosq, obj, msg):
        ret = msg.topic+" "+msg.payload
        return ret

    def publish(self, channel, message):
        self.pubsub.publish(channel, message)

    def subscribe(self, channels):
        for channel in channels:
            self.channels.add(channel)
            self.pubsub.subscribe(channel)

    def unsubscribe(self, channels):
        for channel in channels:
            self.channels.remove(channel)
            self.pubsub.unsubscribe(channel)

    def pubsub(self):
        return self

    def listen(self):
        while self.pubsub.loop() == 0:
            channel, _, data = self.sub.recv().partition(" ")
            yield {"type": "message", "channel": channel, "data": data}


def serve(quiet):
    context = zmq.Context()
    receiver = context.socket(zmq.PULL)
    receiver.bind("tcp://*:%s" % 5562)
    sender = context.socket(zmq.PUB)
    sender.bind("tcp://*:%s" % 5561)
    last = time.time()
    messages = 0
    try:
        while True:
            sender.send(receiver.recv())
            if not quiet:
                messages += 1
                now = time.time()
                if now - last > 1:
                    print "%s msg/sec" % messages
                    last = now
                    messages = 0
    except (KeyboardInterrupt, SystemExit):
        pass
