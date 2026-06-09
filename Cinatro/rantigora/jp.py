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
                    <span class="ipa">
                        {ipa}
                    </span>
                    <br>
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
        lat = word[1].split('[')
        if len(lat) > 1:
            ipa = f'[{lat[1][:-1]}]'
        else:
            ipa = ''
        lat = lat[0]
        if len(word) < 3:
            cards += card.format(kld = convKld(lat), kld2 = '', lat = lat, lat2 = '', han = word[0], ipa = ipa)
        else:
            lat2 = word[2].split('[')
            if len(lat2) > 1:
                ipa2 = f'[{lat2[1][:-1]}]'
            else:
                ipa2 = '['
            lat2 = lat2[0]
            if ipa2 != '[':
                ipa = f'{ipa[:-1]}, {ipa2[1:]}'
            cards += card.format(kld = convKld(lat), kld2 = convKld(lat2), lat = lat, lat2 = ', ' + lat2, han = word[0], ipa = ipa)

    with open(path + 'template.txt', 'r', -1, 'utf-8') as tpl:
        html = tpl.read()
        html = html.replace('{}', cards)

    with open(path + 'index.html', 'w', -1, 'utf-8') as g:
        g.write(html)

    import subprocess as sp
    sp.run('git add Cinatro/rantigora')
    sp.run(['git', 'commit', '-m', 'novizi rantigora a Cinatro'])
    sp.run('git push origin main')