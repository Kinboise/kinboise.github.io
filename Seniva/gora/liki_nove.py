from pathlib import Path
import re
import yaml

path = str(Path(__file__).parent)

with open(f'{path}\\index.html', 'r', -1, 'utf-8') as f:
    gora = f.read()

path2 = str(Path(__file__).parent.parent)

with open(f'{path2}\\rantigora\\dic.yaml', 'r', -1, 'utf-8') as f:
    dic = yaml.safe_load(f)

words = [x['ph'][0] for x in dic]
print(len(words))
newwords = []

res = re.findall(r'<tr><td>\n([\u0000-\u4dff]*?)\n</td><td class="pu">', gora, re.S)

print(res)

if res:
    for para in res:
        for word in re.split(r'[\s,\.;:\*“”]+', para):
            word = re.sub('<(.*?)>', '', word)
            if word not in words and word not in newwords:
                newwords.append(word)

with open(f'{path}\\nove.txt', 'w', -1, 'utf-8') as f:
    f.write('\n'.join(newwords))