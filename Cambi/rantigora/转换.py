# import pandas as pd

def convSim(w: str):
    import yaml
    path = 'Cambi/rantigora/sim.yml'
    with open(path, 'r', -1, 'utf-8') as mb:
        cmb = yaml.safe_load(mb)
    n = ''
    for i in w:
        if i in cmb:
            n += cmb[i]
        else:
            n += i
    return n

def convProto(w: str):
    import yaml
    path = 'Cambi/rantigora/proto.yml'
    with open(path, 'r', -1, 'utf-8') as mb:
        cmb = yaml.safe_load(mb)
    n = ''
    for i in w:
        if i in cmb:
            n += cmb[i]
        else:
            n += i
    return n

# dat = pd.read_excel('Rantrugork i\'Holrpavieh.xlsx')
# dat["Hor"]= dat["Hor"].map(lambda x: sep(x), na_action='ignore')
# dat["Aur"]= dat["Hor"].map(lambda x: conv(x), na_action='ignore')

# dat.to_csv('n.csv')

# a = input('输入拉丁：')
# print(conv(sep(a)))