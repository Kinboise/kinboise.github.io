def convKakipeno(w: str):
    import yaml
    path = 'Kaki/rantigora/Kakipeno.yml'
    with open(path, 'r', -1, 'utf-8') as mb:
        cmb : dict[str, str] = yaml.safe_load(mb)
    for i in reversed(cmb):
        w = w.replace(i, cmb[i])
    return w

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