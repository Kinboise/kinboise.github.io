def convKld(w: str):
    import yaml
    path = 'Cinatro/rantigora/kld.yml'
    with open(path, 'r', -1, 'utf-8') as mb:
        kld = yaml.safe_load(mb)
    n = ''
    for i in w.lower():
        if i in kld:
            n += kld[i]
        else:
            n += i
    return n