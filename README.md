Fork of "A Tale of Two Queues"
==============================
Based on [A Tale of Two Queues](http://blog.jupo.org/2013/02/23/a-tale-of-two-queues/)

Simple benchmark (ZMQ) between Python and NodeJS
================================================

Following are the software and library requirements for running these
benchmarks, using [homebrew](http://mxcl.github.com/homebrew) for OSX,
[pip](http://www.pip-installer.org) for Python. Installation should be similar on various Linuxes using their respective
package managers rather than homebrew.

    $ brew install zeromq [1]
    $ brew install gnuplot [2]
    $ sudo npm install zmq [3]
    $ sudo npm install commander [4]
    $ pip install pyzmq [5]

1. <http://www.zeromq.org>
2. <http://www.gnuplot.info>
3. <https://github.com/JustinTulloss/zeromq.node>
4. <https://github.com/tj/commander.js>
5. <https://github.com/zeromq/pyzmq>
5. <https://github.com/andymccurdy/redis-py>


Run
===
Run and wait...

    $ python bench.py

The output folder contain de result
