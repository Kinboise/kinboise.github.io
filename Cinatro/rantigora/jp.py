from joppy.client_api import ClientApi
# import pandas as pd
from 转换 import convKld

path = 'Cinatro/rantigora/'
# 账号
a = open(path + 'account.txt', 'r', -1, 'utf-8')
lines = a.readlines()
token = lines[0].strip()
id = lines[1].strip()
a.close()

# 从Joplin获取数据
content = ClientApi(token).get_note(id, fields='body').body

if content is None:
    raise ValueError('No content')

content = content.split('---\n')[1]

# 检查有无改变
with open(path + 'last.txt', 'r', -1, 'utf-8') as f:
    last = f.read()

if last != content:
    with open(path + 'last.txt', 'w', -1, 'utf-8') as f:
        f.write(content)
    # 生成html
    card = '''
            <tr class="flexcard">
                <td class="label cin">
                    <span class="kld">
                        {kld}<br>{kld2}
                    </span>
                </td>
                <td class="card half">
                    <span class="lat">
                        <strong>{lat}</strong>{lat2}
                    </span>
                    <br>
                    <span class="han">
                        {han}
                    </span>
                </td>
            </tr>'''
    cards = ''
    for line in content.split('\n'):
        word = line.split(',')
        if len(word) < 3:
            cards += card.format(kld = convKld(word[1]), kld2 = '', lat = word[1], lat2 = '', han = word[0])
        else:
            cards += card.format(kld = convKld(word[1]), kld2 = convKld(word[2]), lat = word[1], lat2 = ', ' + word[2], han = word[0])

    with open(path + 'template.txt', 'r', -1, 'utf-8') as tpl:
        html = tpl.read()
        html = html.replace('{}', cards)

    with open(path + 'index.html', 'w', -1, 'utf-8') as g:
        g.write(html)

    import subprocess as sp
    sp.run('git add Cinatro/rantigora')
    sp.run(['git', 'commit', '-m', 'novizi rantigora a Cinatro'])
    sp.run('git push origin main')