import subprocess as sp
import os

for lat in os.listdir('Seniva/rantigora/seniva-cute'):
    if lat.endswith('.ogg'):
        sp.run(['wrangler', 'r2', 'object', 'put', f'guc-bise/seniva-cute/{lat}', f'--file=Seniva/rantigora/seniva-cute/{lat}'])