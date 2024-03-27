from senivatts import senivatts
import os
import yaml

path = os.path.dirname(os.path.abspath(__file__)).replace('\\', '/') + '/' # 'Seniva/rantigora/'

with open(path + 'dict.yaml', 'r', encoding='utf-8') as g:
    dic = yaml.safe_load(g)

size = len(dic)
prog = []
for j in range(1, 11):
    prog.append(int(size * (0.1 * j)))

for i in range(len(dic)):
    lat = dic[i]['ph'][0]
    if i in prog:
        print(i)
    senivatts(lat, output=f'{path}cute/{lat}.mp3')
    senivatts(lat, output=f'{path}cute/{lat}.ogg')