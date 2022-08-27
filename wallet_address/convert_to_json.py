import os
from glob import glob
import json


files = glob("*.txt")
for file in files:
    out = 'json/' + file.split('.')[0] + '.json'
    data = open(file, 'r').read().split('\n')[1:-1]
    dct = {
        'data': data
    }
    json.dump(dct, open(out, 'w'))

