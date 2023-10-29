function genId(id) {
    if (id == undefined) {
        // const ULID = require('ulid')
        var id = ULID.ulid()
        id = 'u' + id
    }
    return id
}

function changeCase(lat) {
    var newLat = ''
    for (var i in lat) {
        if (lat[i] == lat[i].toLowerCase()) {
            newLat += lat[i].toUpperCase()
        } else {
            newLat += lat[i].toLowerCase()
        }
    }
    return newLat
}

function splitParts(lat) {
    if (lat.startsWith('|')) {
        var bar = true
        lat = lat.replace('|','')
    } else {
        var bar = false
    }
    if (lat.indexOf('\'') != -1) {
        var ret = lat.split('\'')
    } else {
        lat = lat.split('').join('~')
        const reps = ['nQ', 'dC', 'xZ']
        for (var i in reps) {
            var reg = new RegExp(reps[i].split('').join('~'), 'g')
            lat = lat.replace(reg, reps[i])
        }
        lat = lat.replace(/~([ieaouyw])/g, '$1')
        var ret = lat.split('~')
    }
    if (bar) {
        ret.push('|')
    }
    return ret
}

function prepare(style) {
    // const { Kage } = require('@kurgm/kage-engine')
    // if (style == 1) {
    //     const { fitenka } = require('./hejti.js')
    // } else {
    //     const { fitenka } = require('./sunti.js')
    // }
    // const { fitenka } = require('./sunti.js')
    const kage = new Kage()
    for (var i in fitenka) {
        kage.kBuhin.push(i, fitenka[i].split('\n').join('$'))
    }
    return kage
}

function makeC(kage, C, id) {
    C = C.split('').join('~').replace(/~([QCZ])/g,'$1').split('~')
    var c = []
    for (var i in C) {
        var l = Math.round(parseInt(i) * 200 / (C.length)).toString()
        var r = Math.round((parseInt(i) + 1) * 200 / (C.length)).toString()
        c.push(`99:0:0:${l}:0:${r}:200:${C[i]}`)
    }
    var c = c.join('$')
    id = genId(id)
    kage.kBuhin.push(id, c)
    return id
}

function makeAffix(kage, lat, id) {
    id = genId(id)
    lat = lat.replace(/([ieaouyw])/g, '~$1')
    lat = lat.split('~')
    if (lat.length == 1) {
        kage.kBuhin.push(id, `99:0:0:0:50:200:150:${lat[0]}`)
    } else if ('iuyw'.indexOf(lat[1]) != -1) {
        kage.kBuhin.push(id, `99:0:0:0:50:200:150:${lat[0]}$99:0:0:0:0:200:50:${lat[1]}`)
    } else {
        kage.kBuhin.push(id, `99:0:0:0:50:200:150:${lat[0]}$99:0:0:0:150:200:200:${lat[1]}`)
    }
    return id
}

function addV(kage, base, V, id) {
    id = genId(id)
    if ('ie'.indexOf(V) != -1) {
        kage.kBuhin.push(id, `99:0:0:0:0:60:200:${V}$99:0:0:60:0:200:200:${base}`)
    } else if ('ou'.indexOf(V) != -1) {
        kage.kBuhin.push(id, `99:0:0:140:0:200:200:${V}$99:0:0:0:0:140:200:${base}`)
    } else if (V == 'a') {
        kage.kBuhin.push(id, `99:0:0:0:180:200:200:${V}$99:0:0:0:0:200:180:${base}`)
    } else if ('IUYW'.indexOf(V) != -1) {
        kage.kBuhin.push(id, `99:0:0:60:0:140:80:${V.toLowerCase()}$99:0:0:0:80:200:200:${base}`)
    } else {
        kage.kBuhin.push(id, `99:0:0:60:120:140:200:${V.toLowerCase()}$99:0:0:0:0:200:120:${base}`)
    } 
    return id
}

function combine(kage, id1, id2, id) {
    id = genId(id)
    kage.kBuhin.push(id, `99:0:0:0:0:200:100:${id1}$99:0:0:0:100:200:200:${id2}`)
    return id
}

function combine3(kage, id1, id2, id3, id) {
    id = genId(id)
    kage.kBuhin.push(id, `99:0:0:0:0:200:100:${id1}$99:0:0:0:100:95:200:${id2}$1:0:0:100:100:100:200$99:0:0:105:100:200:200:${id3}`)
    return id
}

function addBar(kage, base, id) {
    id = genId(id)
    kage.kBuhin.push(id, `1:0:0:24:30:24:170$99:0:0:40:0:200:200:${base}`)
    return id
}

function addAffix(kage, base, prefix, suffix, id) {
    id = genId(id)
    var ls = []
    if (prefix.length + suffix.length <= 1) {
        var l = 70
        var lb = 200 - l * (prefix.length + suffix.length)
    } else if (prefix.length + suffix.length == 2) {
        var l = 50
        var lb = 200 - l * (prefix.length + suffix.length)
    } else {
        var lb = 80
        var l = Math.round(120 / (prefix.length + suffix.length))
    }
    var x = 0
    for (var i in prefix) {
        var tempId = makeAffix(kage, prefix[i])
        ls.push([tempId, x, x += l])
    }
    ls.push([base, x, x += lb])
    for (var i in suffix) {
        if (suffix[i].startsWith('|')) {
            var bar = true
            suffix[i] = suffix[i].replace('|','')
        } else {
            var bar = false
        }
        var tempId = makeAffix(kage, suffix[i])
        if (bar) {
            tempId = addBar(kage, tempId)
        }
        ls.push([tempId, x, x += l])
    }
    var ret = []
    for (var i in ls) {
        ret.push(`99:0:0:${ls[i][1]}:0:${ls[i][2]}:200:${ls[i][0]}`)
    }
    kage.kBuhin.push(id, ret.join('$'))
    return id
}

function resize(kage, base, x1, y1, x2, y2, id) {
    id = genId(id)
    kage.kBuhin.push(id, `99:0:0:${x1}:${y1}:${x2}:${y2}:${base}`)
    return id
}

function shrink(kage, base, x, y, id) {
    x1 = Math.round((200 - x)/2)
    y1 = Math.round((200 - y)/2)
    x2 = Math.round((200 + x)/2)
    y2 = Math.round((200 + y)/2)
    return resize(kage, base, x1, y1, x2, y2, id)
}

function exportSVG(kage) {
    // const { Polygons } = require('@kurgm/kage-engine')
    const polygons = new Kage.Polygons();
    kage.makeGlyph(polygons, 'target');
    return polygons.generateSVG()
}

function latToFit(kage, lat) {
    if (lat.length == 1) {
        if (lat == ':') {
            return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" baseProfile="full" viewBox="0 0 50 200" width="50" height="200">
            <g fill="black">
            <circle cx="25" cy="75" r="6" />
            <circle cx="25" cy="125" r="6" />
            </g>
            </svg>`
        } else if (lat == '·') {
            return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" baseProfile="full" viewBox="0 0 50 200" width="50" height="200">
            <g fill="black">
            <circle cx="25" cy="100" r="6" />
            </g>
            </svg>`
        } else if (lat == '-') {
            return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" baseProfile="full" viewBox="0 0 100 200" width="100" height="200">
            <g fill="black">
            <rect x="15" y="97" height="6" width="70" />
            </g>
            </svg>`
        } else if (lat == lat.toUpperCase()) {
            var tempId = makeC(kage, lat.toLowerCase())
            shrink(kage, tempId, 160, 160, 'target')
        } else {
            var tempId = makeC(kage, lat)
            if ('iuyw'.indexOf(lat) != -1) {
                resize(kage, tempId, 40, 0, 160, 120, 'target')
            } else if ('eao'.indexOf(lat) != -1) {
                resize(kage, tempId, 40, 80, 160, 200, 'target')
            } else {
                shrink(kage, tempId, 120, 120, 'target')
            }
        }
    } else if (['Nq', 'Dc', 'Xz'].indexOf(lat) != -1) {
        var tempId = makeC(kage, changeCase(lat))
        shrink(kage, tempId, 160, 160, 'target')
    } else if (['nQ', 'dC', 'xZ'].indexOf(lat) != -1) {
        var tempId = makeC(kage, lat)
        shrink(kage, tempId, 120, 120, 'target')
    } else if (lat.search(/[IEAOUYW]/g) != -1) {
        lat = lat.replace(/([IEAOUYW])/g,'~$1~').replace(/~$/g,'').split('~')
        for (var i in lat) {
            var temp = lat[i].match(/[QHPBTDKGCJSZFVMNLRX]/g)
            if (temp != null && temp.length > 1) {
                lat[i] = makeC(kage, changeCase(lat[i]))
            } else {
                lat[i] = changeCase(lat[i])
            }
        }
        if (lat.length == 2) {
            if ('iuyw'.indexOf(lat[1]) != -1) {
                kage.kBuhin.push('target',`99:0:0:60:0:140:80:${lat[1]}$99:0:0:40:80:160:200:${lat[0]}`)
            } else {
                kage.kBuhin.push('target',`99:0:0:60:120:140:200:${lat[1]}$99:0:0:40:0:160:120:${lat[0]}`)
            }
        } else {
            if ('iuyw'.indexOf(lat[1]) != -1) {
                kage.kBuhin.push('target',`99:0:0:70:0:130:60:${lat[1]}$99:0:0:40:60:160:130:${lat[0]}$99:0:0:40:130:160:200:${lat[2]}`)
            } else {
                kage.kBuhin.push('target',`99:0:0:70:70:130:130:${lat[1]}$99:0:0:40:0:160:70:${lat[0]}$99:0:0:40:130:160:200:${lat[2]}`)
            }
        }
    } else {
        // const c = ['q', 'h', 'p', 'b', 't', 'd', 'k', 'g', 'c', 'j', 's', 'z', 'f', 'v', 'm', 'n', 'l', 'r', 'nQ', 'dC', 'x', 'xZ']
        const v = ['i', 'e', 'a', 'o', 'u', 'y', 'w']
        lat = lat.split('`')
        for (var i in lat) {
            var cons = lat[i].match(/[qhpbtdkgcjszfvmnlrx]/g)
            if (cons != null && cons.length > 1) {
                i = Number(i)
                var base = lat[i]
                var prefix = lat.slice(0, i)
                var suffix = lat.slice(i + 1)
            }
        }
        base = splitParts(base)
        if (base.indexOf('|') != -1) {
            var bar = true
            base.pop()
        } else {
            var bar = false
        }
        var ids = []
        for (var i in base) {
            ok = false
            for (var j in v) {
                if (!ok && base[i].indexOf(v[j]) != -1) {
                    var C = base[i].slice(0, -1)
                    var V = v[j]
                    var tempId = makeC(kage, C)
                    ids.push(addV(kage, tempId, V))
                    ok = true
                }
            }
            if (!ok) {
                ids.push(makeC(kage, base[i]))
            }
        }
        if (base.length == 2) {
            var res = combine(kage, ids[0], ids[1], 'base')
        } else {
            var res = combine3(kage, ids[0], ids[1], ids[2], 'base')
        }
        if (bar) {
            res = addBar(kage, 'base')
        }
        var tempId = addAffix(kage, res, prefix, suffix)
        shrink(kage, tempId, 160, 200, 'target')
    }
    return exportSVG(kage)
}

// module.exports = { prepare, latToFit, makeC, addV, combine, exportSVG }