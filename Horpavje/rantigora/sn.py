import simplenote
import pandas as pd
from 转换 import *

path = 'Horpavje/rantigora/'

# 账号
a = open(path + 'account.txt', 'r', -1, 'utf-8')
lines = a.readlines()
user = lines[0].strip()
password = lines[1].strip()
note = lines[2].strip()
a.close()

# 从Simplenote获取数据
sn = simplenote.Simplenote(user, password)
content = sn.get_note(note)[0]['content']
content = content[21:]

# 检查有无改变
l = open(path + 'last.txt', 'r', -1, 'utf-8')
last = l.read()
l.close()

if last != content:
    # 写入csv
    with open(path + 'Rantrugork i\'Holrpavieh.csv', 'w', -1, 'utf-8') as h:
        h.write(content)

    # csv转换aurogi文
    dat = pd.read_csv(path + 'Rantrugork i\'Holrpavieh.csv', header=None)
    dat.columns = ['Han','Lat1','Lat2']
    lat1 = dat['Lat1'].map(lambda x: sep(x), na_action='ignore')
    lat2 = dat['Lat2'].map(lambda x: sep(x), na_action='ignore')
    aur1 = lat1.map(lambda x: conv(x), na_action='ignore')
    aur2 = lat2.map(lambda x: conv(x), na_action='ignore')
    dat.insert(1, 'Aur1', aur1)
    dat.insert(3, 'Aur2', aur2)
    dat.to_csv(path + 'Rantrugork i\'Holrpavieh.csv', index=False, encoding='utf_8_sig')

    # 生成html
    card = '''
            <div class="flexcard">
                <div class="label">
                    <span class="aur">
                        {aur1}{aur2}
                    </span>
                </div>
                <div class="card half">
                    <span class="lat">
                        {lat1}, {lat2}
                    </span>
                    <br>
                    <span class="han">
                        {han}
                    </span>
                </div>
            </div>'''
    cards = ''
    for line in content.split('\n'):
        word = line.split(',')
        cards += card.format(aur1 = conv(sep(word[1])), aur2 = conv(sep(word[2])), lat1 = word[1], lat2 = word[2], han = word[0])

    with open(path + 'template.txt', 'r', -1, 'utf-8') as tpl:
        html = tpl.read()
        html = html.replace('{}', cards)

    with open(path + 'index.html', 'w', -1, 'utf-8') as f:
        f.write(html)

    import subprocess as sp
    sp.run('git add .')
    sp.run(['git', 'commit', '-m', 'novizi rantigora a Horpavje'])
    sp.run('git push origin main')