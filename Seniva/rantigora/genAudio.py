from senivatts import senivatts
import os
import yaml
# import subprocess as sp

path = os.path.dirname(os.path.abspath(__file__)).replace('\\', '/') + '/' # 'Seniva/rantigora/' 

with open(path + 'dic.yaml', 'r', encoding='utf-8') as g:
    dic = yaml.safe_load(g)

dic = [x['ph'][0] for x in dic if f'{x["ph"][0]}.ogg' not in os.listdir(f'{path}seniva-cute')]
size = len(dic)
prog = []
for j in range(1, 11):
    prog.append(int(size * (0.1 * j)))

for i in range(len(dic)):
    lat = dic[i]
    if i in prog:
        print(i)
    # senivatts(lat, output=f'{path}cute/{lat}.mp3')
    senivatts(lat, lang='ka', voice=2, output=f'{path}seniva-cute/{lat}.ogg')
    # sp.run(['wrangler', 'r2', 'object', 'put', f'guc-bise/{lat}.ogg', f'--file=Seniva/rantigora/seniva-cute/{lat}.ogg'])