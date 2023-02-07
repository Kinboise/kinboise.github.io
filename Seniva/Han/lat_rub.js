const rub = {
    'i': '<ruby style="ruby-position:over">$1<rt>⟋</rt></ruby>',
    'e': '<ruby style="ruby-position:under">$1<rt>⟍</rt></ruby>',
    'a': '<ruby style="ruby-position:under">$1<rt>—</rt></ruby>',
    'o': '<ruby style="ruby-position:under">$1<rt>⟋</rt></ruby>',
    'u': '<ruby style="ruby-position:over">$1<rt>⟍</rt></ruby>',
    '\\.': '<ruby style="ruby-position:under">$1<rt>・</rt></ruby>',
}
const fene = {
    'I': '<sup>⟋</sup>',
    'E': '<sub>⟍</sub>',
    'A': '<sub>—</sub>',
    'O': '<sub>⟋</sub>',
    'U': '<sup>⟍</sup>',
    '，': ' | ',
    '。': ' ‖ '
}
// const liprub = {
//     'i': '<ruby style="ruby-position:under">$1<rt>⟋</rt></ruby>',
//     'e': '<ruby style="ruby-position:under">$1<rt>⟍</rt></ruby>',
//     'a': '<ruby style="ruby-position:under">$1<rt>—</rt></ruby>',
//     'o': '<ruby style="ruby-position:over">$1<rt>⟋</rt></ruby>',
//     'u': '<ruby style="ruby-position:over">$1<rt>⟍</rt></ruby>',
//     '\\.': '<ruby style="ruby-position:under">$1<rt>・</rt></ruby>',
// }
// const lipfene = {
//     'I': '<sub>⟋</sub>',
//     'E': '<sub>⟍</sub>',
//     'A': '<sub>—</sub>',
//     'O': '<sup>⟋</sup>',
//     'U': '<sup>⟍</sup>',
//     '，': ' | ',
//     '。': ' ‖ '
// }
function lat_rub() {
    fipe = document.getElementById('lat').value
    for (var tomo in rub) {
        const re = new RegExp(tomo, 'g')
        fipe = fipe.replace(re, tomo + '\u200c')
    }
    for (var tomo in fene) {
        const re = new RegExp(tomo, 'g')
        fipe = fipe.replace(re, fene[tomo])
    }
    fipe = fipe.replace(/\\\./g, '.')
    for (var tomo in rub) {
        const re = new RegExp('(.)' + tomo + '\u200c', 'g')
        fipe = fipe.replace(re, rub[tomo])
    }
    fipe = `<span style="line-height:250%;font-family:'DejaVu Sans','Noto Sans Symbols2';">` + fipe + `</span>`
    document.getElementById('rub').innerHTML = fipe
    document.getElementById('sor').innerHTML = fipe
    // document.getElementById('lip').innerHTML = fipe
}

window.onload = lat_rub