
import time
import mosquitto
import os


class MQTTPubSub(object):

    def __init__(self, host="127.0.0.1"):
        #create an mqtt client
        mypid = os.getpid()
        client_uniq = "two_queue_"+str(mypid)
        self.pubsu = mosquitto.Mosquitto(client_uniq)
        self.pubsu.connect(host)
        self.pubsu.on_message = self.on_message
        #self.pub = context.socket(zmq.PUSH)
        #self.pub.connect("tcp://%s:%s" % (host, 5562))
        #self.sub = context.socket(zmq.SUB)
        #self.sub.connect("tcp://%s:%s" % (host, 5561))
        self.channels = set()
        self.received = True
        self.message  = ""

    def on_message(self, obj, msg):
        self.message = msg.topic+" "+msg.payload
        self.received = True 

    def publish(self, channel, message):
        self.pubsu.publish(channel, message)

    def subscribe(self, channels):
        for channel in channels:
            self.channels.add(channel)
            self.pubsu.subscribe(channel)

    def unsubscribe(self, channels):
        for channel in channels:
            self.channels.remove(channel)
            self.pubsu.unsubscribe(channel)

    def pubsub(self):
        return self

    def recv(self):
        while self.received == False:
            self.pubsu.loop();
        self.received = False
        return self.message

    def listen(self):
        while True:
            channel, _, data = self.recv().partition(" ")
            yield {"type": "message", "channel": channel, "data": data}


if __name__ == "__main__":
    receiver = MQTTPubSub(host="127.0.0.1")
    pubsub = receiver.pubsub()
    last = time.time()
    messages = 0
    pubsub.subscribe(["teste"])
    try:
        while True:
            pubsub.publish("teste",pubsub.recv())
            messages += 1
            now = time.time()
            if now - last > 1:
                print "%s msg/sec" % messages
                last = now
                messages = 0
    except (KeyboardInterrupt, SystemExit):
        pass
