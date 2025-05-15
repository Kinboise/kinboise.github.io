from joppy.client_api import ClientApi
import pandas as pd
from 转换 import convKakipeno, convProto

path = 'Kaki/rantigora/'
# 账号
a = open(path + 'account.txt', 'r', -1, 'utf-8')
lines = a.readlines()
token = lines[0].strip()
id = lines[1].strip()
a.close()

# 从Simplenote获取数据
content = ClientApi(token).get_note(id, fields='body').body
# content = content[21:]

# 检查有无改变
lf = open(path + 'last.txt', 'r', -1, 'utf-8')
last = lf.read()
lf.close()

if last != content:
    # 写入csv
    with open(path + 'Rantrugork i\'Tcembi.csv', 'w', -1, 'utf-8') as h:
        h.write(content)
    with open(path + 'last.txt', 'w', -1, 'utf-8') as l:
        l.write(content)

    # csv转换心领小字
    dat = pd.read_csv(path + 'Rantrugork i\'Tcembi.csv', header=None)
    dat.columns = ['Han','Old1','Lat','note']
    old2 = dat['Old1'].map(lambda x: convProto(x), na_action='ignore')
    sim = dat['Lat'].map(lambda x: convKakipeno(x), na_action='ignore')
    dat.insert(1, 'Old2', old2)
    dat.insert(3, 'Sim', sim)
    dat.to_csv(path + 'Rantrugork i\'Tcembi.csv', index=False, encoding='utf_8_sig')

    # 生成html
    card = '''
            <div class="flexcard">
                <div class="label">
                    <span class="sim">
                        {sim}
                    </span>
                </div>
                <div class="card half">
                    <span class="lat">
                        {old2} &gt; {lat}
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
        cards += card.format(sim = convKakipeno(word[2]), old2 = convProto(word[1]), lat = word[2], han = word[0])

    with open(path + 'template.txt', 'r', -1, 'utf-8') as tpl:
        html = tpl.read()
        html = html.replace('{}', cards)

    with open(path + 'index.html', 'w', -1, 'utf-8') as f:
        f.write(html)

    import subprocess as sp
    sp.run('git add Kaki/rantigora')
    sp.run(['git', 'commit', '-m', 'novizi rantigora a Kaki'])
    sp.run('git push origin main')