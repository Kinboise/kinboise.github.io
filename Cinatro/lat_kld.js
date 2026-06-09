const l2k = {
    'a': '',
    'i': '',
    'u': '',
    'o': '',
    'h': '',
    'm': '',
    'n': '',
    'p': '',
    'b': '',
    't': '',
    'd': '',
    'c': '',
    'g': '',
    'k': '',
    'q': '',
    's': '',
    'z': '',
    'l': '',
    'r': '',
    'f': '',
    ',': '',
    '.': '',
    '_': ''
}
const k2l = {
    '': 'a',
    '': 'i',
    '': 'u',
    '': 'o',
    '': 'h',
    '': 'm',
    '': 'n',
    '': 'p',
    '': 'b',
    '': 't',
    '': 'd',
    '': 'c',
    '': 'g',
    '': 'k',
    '': 'q',
    '': 's',
    '': 'z',
    '': 'l',
    '': 'r',
    '': 'f',
    '': ',',
    '': '.',
    '': ''
}
function lat_kld(l) {
    l = l.toLowerCase()
    var k = ''
    for (var i in l) {
        if (l[i] in l2k) {
            k += l2k[l[i]]
        } else {
            k += l[i]
        }
    }
    return k
}

function kld_lat(l) {
    var k = ''
    for (var i in l) {
        if (l[i] in k2l) {
            k += k2l[l[i]]
        } else {
            k += l[i]
        }
    }
    return k
}

function auto_lat_kld() {
    var f = document.getElementById('lat').value
    document.getElementById('kld').value = lat_kld(f)
}

function auto_kld_lat() {
    var f = document.getElementById('kld').value
    document.getElementById('lat').value = kld_lat(f)
}