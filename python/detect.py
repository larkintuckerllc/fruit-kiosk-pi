import sys
import time
import Adafruit_MPR121.MPR121 as MPR121
from socketIO_client import SocketIO, LoggingNamespace

with SocketIO('localhost', 3000, LoggingNamespace) as socketIO:
    cap = MPR121.MPR121()
    cap.begin();
    last_touched = cap.touched()
    while True:
        current_touched = cap.touched()
        for i in range(12):
            pin_bit = 1 << i
            if current_touched & pin_bit and not last_touched & pin_bit:
                socketIO.emit('message', i);
        last_touched = current_touched
        time.sleep(0.1)
