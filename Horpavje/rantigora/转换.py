import pandas as pd
import yaml, re

path = 'Horpavje/rantigora/aurime.yml'
with open(path, 'r', -1, 'utf-8') as au:
    aur = yaml.safe_load(au)

# print(len(aur))

def sep(w):
    v = ['i','u','e','o','a','q']
    for i in v:
        w = re.sub('(' + i + ')', '\\1 ', w)
    w = re.sub(r'(nn)', '\\1 ', w)
    w = re.sub(r'\s\s', ' ', w)
    return w.rstrip()

def conv(w):
    w = w.split(' ')
    # print(w)
    n = ''
    for i in w:
        n += aur[i]
    return n

# dat = pd.read_excel('Rantrugork i\'Holrpavieh.xlsx')
# dat["Hor"]= dat["Hor"].map(lambda x: sep(x), na_action='ignore')
# dat["Aur"]= dat["Hor"].map(lambda x: conv(x), na_action='ignore')

# dat.to_csv('n.csv')

# a = input('输入拉丁：')
# print(conv(sep(a)))