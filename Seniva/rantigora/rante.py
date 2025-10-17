import re
import yaml
import os

# 将 Seniva.db 转换为列表
path = os.path.dirname(os.path.abspath(__file__)).replace('\\', '/') + '/' # 'Seniva/rantigora/'
dbpath = r'D:\hafa-zug\Lexique Pro Data\Seniva\Seniva.db'
with open(dbpath, 'r', encoding='utf-8') as f:
    db = f.readlines()

dic = []
i = -1

for line in db:
    #print(line)
    match = re.search(r'^\\(\S*)\s(.*?)$', line)
    #print(match)
    if match is None:
        continue
    if i == -1 and match.group(1) != 'lx':
        continue
    if match.group(1) == 'lx':
        i += 1
        dic.append({'lx': [match.group(2)]})
    elif match.group(1) == 'nt':
        note = re.search(r'^\\nt\s(.*?):\s(.*?)$', line)
        if note is None:
            if 'nt' in dic[i]:
                dic[i]['nt'].append(match.group(2))
            else:
                dic[i]['nt'] = match.group(2)
        elif note.group(1) == 'Ftnk':
            ftnk = note.group(2).replace('.', '_.')
            fitenka = []
            ftnkn = ftnk.split('/')
            for ftnkj in ftnkn:
                kuatghauh = re.search(r'([^\(]*?)\(([^\)]*?)\)(.*?)', ftnkj)
                if kuatghauh is None:
                    fitenka.append(ftnkj)
                else:
                    fitenka.append(kuatghauh.group(1)+kuatghauh.group(3))
                    fitenka.append(kuatghauh.group(1)+kuatghauh.group(2)+kuatghauh.group(3))
            dic[i]['Ftnk'] = fitenka
        elif note.group(1) == '词源':
            dic[i]['et'] = [note.group(2)]
        elif note.group(1) == 'Han':
            han = note.group(2)
            hans = []
            hann = han.split('/')
            for hanj in hann:
                kuatghauh = re.search(r'([^\(]*?)\(([^\)]*?)\)(.*?)', hanj)
                if kuatghauh is None:
                    hans.append(hanj)
                else:
                    hans.append(kuatghauh.group(1)+kuatghauh.group(3))
                    hans.append(kuatghauh.group(1)+kuatghauh.group(2)+kuatghauh.group(3))
            dic[i]['Hnv1'] = hans
            dic[i]['Hnv3'] = hans
        elif note.group(1) == 'Hnv3':
            dic[i]['Hnv3'] = [note.group(2)]
    elif match.group(1) in dic[i]:
        dic[i][match.group(1)].append(match.group(2))
    else:
        dic[i][match.group(1)] = [match.group(2)]

#print(dic)
with open(path + 'dic.yaml', 'w', encoding='utf-8') as g:
#g.write(dic)
    g.write(yaml.dump(dic,allow_unicode=True))

# 生成 html

section = '''    <section id="{lat}">
        <div class="label">{lat}</div>
        <span class="search">
            {search}
        </span>
        <div class="card lab">
            <div class="ort">
                <span class="pnst">{pnst}</span> /
                <span class="hnv1">{hnv1}</span> /
                <span class="hnv3">{hnv3}</span>
                <button onclick="haf('{lat}')">🔊</button>
            </div>
            <table>
                <tr>
                    <td><span class="ftnk">{ftnk}</span></td>
                    <td>
{senses}
                    </td>
                </tr>
            </table>
{ety}
{ex}
{cfs}
        </div>
    </section>
'''

sense = '''                        <div class="sense">
                            <abbr title="{0}">{1}</abbr>{2} <em>{3}</em>
                        </div>
'''
ety = '            <div class="ety"><abbr title="词源">源</abbr>{0}</div>'
ex = '            <div class="ex"><abbr title="用例">例</abbr>{0} {1}</div>'
cfs = '            <div class="cf"><abbr title="参考">参</abbr>{0}</div>'
cf0 = '<a href="#{0}" onclick="crom(\'{0}\')">{0}</a> '
ps = {
    'hf': ['叹', '感叹词 Interjection'],
    'v': ['动', '动词 Verb'],
    'vn': ['代', '代词 Pronoun'],
    'p': ['名', '名词 Noun'],
    'cp': ['名', '名词 Noun'],
    'fp': ['名', '名词 Noun'],
    'jp': ['专', '专有名词 Proper Noun'],
    'c': ['副', '副词 Adverb'],
    't': ['数', '数词 Numeral'],
    'h': ['连', '连词 Conjunction'],
    's': ['缀', '词缀 Affix'],
    'k': ['介', '介词 Preposition'],
    'j': ['助', '助词 Particle']
}

with open(path + 'Fitenka.nam', 'r', -1, 'utf-8') as nam:
    names = nam.readlines()

ftnkmap = {}

for name in names:
    tmp = name.split(' ')
    ftnkmap[tmp[1].strip('\n')] = (r'\U000' + tmp[0][2:]).encode('utf-8').decode('unicode_escape')

def genFtnk(lat):
    lat = lat.split('_')
    res = ''
    for word in lat:
        if word in ftnkmap:
            res += ftnkmap[word]
    return res

def genHnv1(lat):
    # rub = {
    #     'i': '<ruby style="ruby-position:over">$1<rt>⟋</rt></ruby>',
    #     'e': '<ruby style="ruby-position:under">$1<rt>⟍</rt></ruby>',
    #     'a': '<ruby style="ruby-position:under">$1<rt>—</rt></ruby>',
    #     'o': '<ruby style="ruby-position:under">$1<rt>⟋</rt></ruby>',
    #     'u': '<ruby style="ruby-position:over">$1<rt>⟍</rt></ruby>',
    #     '\\.': '<ruby style="ruby-position:under">$1<rt>・</rt></ruby>',
    # }
    # fene = {
    #     'I': '<sup>⟋</sup>',
    #     'E': '<sub>⟍</sub>',
    #     'A': '<sub>—</sub>',
    #     'O': '<sub>⟋</sub>',
    #     'U': '<sup>⟍</sup>',
    #     '，': ' | ',
    #     '。': ' ‖ '
    # }
    # for letter in rub:
    #     lat = re.sub(letter, rub[letter], lat)
    # for letter in fene:
    #     lat = re.sub(letter, fene[letter], lat)
    return lat

def genHnv3(lat):
    sub = {
        'i': '之',
        'e': '兮',
        'a': '也',
        'o': '乎',
        'u': '然',
        '\\.': '矣'
    }
    for letter in sub:
        lat = re.sub(letter, sub[letter], lat)
    return lat

sections = ''
for word in dic:
    form = {
        'search': '',
        'ftnk': '',
        'hnv1': '',
        'hnv3': '',
        'senses': '',
        'eng': '',
        'ety': '',
        'ex': '',
        'cfs': '',
    }
    # 解析拉丁
    form['search'] += (word['ph'][0] + ';')
    form['lat'] = word['ph'][0]
    # 解析五元
    form['pnst'] = word['lx'][0]
    # 解析特正
    if 'Ftnk' in word:
        form['search'] += (word['Ftnk'][0] + ';')
        form['ftnk'] = genFtnk(word['Ftnk'][0])
    # 解析汉帜
    if 'Hnv1' in word:
        form['search'] += (word['Hnv1'][0] + ';')
        form['hnv1'] = genHnv1(word['Hnv1'][0])
    # 解析全汉帜
    if 'Hnv3' in word:
        form['search'] += (word['Hnv3'][0] + ';')
        form['hnv3'] = genHnv3(word['Hnv3'][0])
    # 解析释义
    for i in range(len(word['ps'])):
        form['search'] += (word['gn'][i] + ';')
        ps1 = word['ps'][i][:-1]
        form['senses'] += sense.format(ps[ps1][1], ps[ps1][0], word['gn'][i], word['ge'][i])
    # 解析词源
    if 'et' in word:
        form['ety'] = ety.format(word['et'][0])
    # 解析用例
    if 'xv' in word:
        for x in range(len(word['xv'])):
            if 'xn' in word and len(word['xn']) > x:
                form['ex'] += ex.format(word['xv'][x], word['xn'][x])
            else:
                form['ex'] += ex.format(word['xv'][x], '')
    # 解析参见
    if 'cf' in word:
        cf1 = ''
        for cf in word['cf']:
            cf1 += cf0.format(cf)
        form['cfs'] = cfs.format(cf1)
    sections += section.format(**form)


with open(path + 'template.html', 'r', -1, 'utf-8') as html:
    template = html.read()

with open(path + 'index.html', 'w', -1, 'utf-8') as index:
    index.write(template.replace('{0}', sections))