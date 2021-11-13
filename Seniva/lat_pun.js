var l_p = {
    'I': '', 'Í': '',
    'E': '', 'É': '',
    'A': '', 'Á': '',
    'O': '', 'Ó': '',
    'U': '', 'Ú': '',
    'Y': '', 'Ý': '',
    'W': '', 'Ẃ': '',
    'Q': '', 'H': '',
    'P': '', 'B': '',
    'T': '', 'D': '',
    'K': '', 'G': '',
    'C': '', 'J': '',
    'S': '', 'Z': '',
    'F': '', 'V': '',
    'M': '', 'N': '',
    'L': '', 'R': '',
    'X': '',
    'i': '', 'í': '',
    'e': '', 'é': '',
    'a': '', 'á': '',
    'o': '', 'ó': '',
    'u': '', 'ú': '',
    'y': '', 'ý': '',
    'w': '', 'ẃ': '',
    'q': '', 'h': '',
    'p': '', 'b': '',
    't': '', 'd': '',
    'k': '', 'g': '',
    'c': '', 'j': '',
    's': '', 'z': '',
    'f': '', 'v': '',
    'm': '', 'n': '',
    'l': '', 'r': '',
    'x': '', '’': '',
    ',': ' ', '\\.': ' ',
    '\\[': '', '\\]': '',
    '\'': '', ':': '',
    '“': '', '”': ''
}

function lat_pun() {
    var f = document.getElementById('lat').value

    f = f.replace(/\"\b/g, '')
    f = f.replace(/\b\"/g, '')
    f = f.replace(/,\b/g, '')

    f = f.replace(/\b([hbzfr])u(n?)\b/g, '$1 u$2')
    f = f.replace(/\b([ks])u(n?)\b/g, '检$1 u$2')

    f = f.replace(/\bi(n?)\b\s?/g, '$1')
    f = f.replace(/\be(n?)\b\s?/g, '$1')
    f = f.replace(/\ba(n?)\b\s?/g, '$1')
    f = f.replace(/\bo(n?)\b\s?/g, '$1')
    f = f.replace(/\bu(n?)\b\s?/g, '$1')

    f = f.replace(/\bi/g, '')
    f = f.replace(/\be/g, '')
    f = f.replace(/\ba/g, '')
    f = f.replace(/\bo/g, '')
    f = f.replace(/\bu/g, '')
    f = f.replace(/\by/g, '')
    f = f.replace(/\bw/g, '')

    f = f.replace(/\bí/g, '')
    f = f.replace(/\bé/g, '')
    f = f.replace(/\bá/g, '')
    f = f.replace(/\bó/g, '')
    f = f.replace(/\bú/g, '')
    f = f.replace(/\bý/g, '')
    f = f.replace(/\bẃ/g, '')
    
    f = f.replace(/n([ieaouywíéáóúýẃ])/g, '$1')

    f = f.replace(/Xz/g, '')
    f = f.replace(/Dc/g, '')
    
    f = f.replace(/xz/g, '')
    f = f.replace(/dc/g, '')

    for (var i in l_p) {
        var i_reg = RegExp(i, 'g')
        f = f.replace(i_reg, l_p[i])
    }
    
    f = f.replace(/([])/g, '$1')
    f = f.replace(/([])/g, '$1')
    f = f.replace(/([])/g, '$1')
    f = f.replace(/([])/g, '$1')
    f = f.replace(/([])/g, '$1')
    f = f.replace(/([])/g, '$1')
    f = f.replace(/([])/g, '$1')

    document.getElementById('pun').value = f
}

function pun_lat() {
    var f = document.getElementById('pun').value

    f = f.replace(//g, '\"')
    f = f.replace(//g, '\"')
    f = f.replace(//g, ',')

    f = f.replace(/^([])\s(?)/g, '$1$2 ')
    f = f.replace(/(\s)([])\s(?)/g, '$1$2$3 ')

    f = f.replace(/^/g, 'in ')
    f = f.replace(/^/g, 'en ')
    f = f.replace(/^/g, 'an ')
    f = f.replace(/^/g, 'on ')
    f = f.replace(/^/g, 'un ')
    f = f.replace(/(\s)/g, '$1in ')
    f = f.replace(/(\s)/g, '$1en ')
    f = f.replace(/(\s)/g, '$1an ')
    f = f.replace(/(\s)/g, '$1on ')
    f = f.replace(/(\s)/g, '$1un ')
    f = f.replace(/^/g, 'i ')
    f = f.replace(/^/g, 'e ')
    f = f.replace(/^/g, 'a ')
    f = f.replace(/^/g, 'o ')
    f = f.replace(/^/g, 'u ')
    f = f.replace(/(\s)/g, '$1i ')
    f = f.replace(/(\s)/g, '$1e ')
    f = f.replace(/(\s)/g, '$1a ')
    f = f.replace(/(\s)/g, '$1o ')
    f = f.replace(/(\s)/g, '$1u ')

    f = f.replace(/^/g, '')
    f = f.replace(/([\s])/g, '$1')
    
    f = f.replace(//g, 'n')

    f = f.replace(//g, 'Xz')
    f = f.replace(//g, 'Dc')
    
    f = f.replace(//g, 'xz')
    f = f.replace(//g, 'dc')

    for (var i in l_p) {
        var i_reg = RegExp(l_p[i], 'g')
        f = f.replace(i_reg, i)
    }
    
    document.getElementById('lat').value = f
}