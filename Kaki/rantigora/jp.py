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

# 从Joplin获取数据
content = ClientApi(token).get_note(id, fields='body').body

if content is not None:
    # 删除首个 '---' 及之前的部分（若存在）
    sep = '---\n'
    if sep in content:
        content = content.split(sep, 1)[1]

    # 检查有无改变
    lf = open(path + 'last.txt', 'r', -1, 'utf-8')
    last = lf.read()
    lf.close()

    if last != content:
        # 写入csv
        with open(path + 'Rantrugork i\'Gaki.csv', 'w', -1, 'utf-8') as h:
            h.write(content)
        with open(path + 'last.txt', 'w', -1, 'utf-8') as l:
            l.write(content)

        # csv转换心领小字
        dat = pd.read_csv(path + 'Rantrugork i\'Gaki.csv', header=None)
        dat.columns = ['Han','Lat','Old1','note']
        old2 = dat['Old1'].map(lambda x: convProto(x), na_action='ignore')
        kak = dat['Lat'].map(lambda x: convKakipeno(x), na_action='ignore')
        dat.insert(2, 'Old2', old2)
        dat.insert(1, 'Kak', kak)
        dat.to_csv(path + 'Rantrugork i\'Gaki.csv', index=False, encoding='utf_8_sig')

        # 生成html
        card = '''
                <div class="flexcard">
                    <div class="label">
                        <span class="kak">
                            {kak}
                        </span>
                    </div>
                    <div class="card half">
                        <span class="lat">
                            {old2}&gt;{lat}
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
            if len(word) >= 3:
                cards += card.format(kak = convKakipeno(word[1]), old2 = convProto(word[2]), lat = word[1], han = word[0])
            else:
                cards += card.format(kak = convKakipeno(word[1]), old2 = '?', lat = word[1], han = word[0])

        with open(path + 'template.txt', 'r', -1, 'utf-8') as tpl:
            html = tpl.read()
            html = html.replace('{}', cards)

        with open(path + 'index.html', 'w', -1, 'utf-8') as f:
            f.write(html)
        # 提交到GitHub
        import subprocess as sp
        sp.run('git add Kaki/rantigora')
        sp.run(['git', 'commit', '-m', 'novizi rantigora a Kaki'])
        sp.run('git push origin main')