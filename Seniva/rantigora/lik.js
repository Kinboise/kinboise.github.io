function lik() {
    var kw = document.getElementById('keyword').value
    var list = document.getElementsByTagName('section')
    for (var i in list) {
        var word = list[i].getElementsByClassName('search')[0].innerHTML
        var hidden = (list[i].classList.length == 1)
        if (word.includes(kw) && hidden) {
            list[i].removeAttribute('class')
        }
        if (!word.includes(kw) && !hidden) {
            list[i].setAttribute('class', 'hidden')
        }
    }
}

function crom(word) {
    document.getElementById('keyword').value = word
    lik(word)
    // location.href += '#' + word
}
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
function lat_rub() {
    for (var i in document.getElementsByClassName('hnv1')) {
        var hnv1 = document.getElementsByClassName('hnv1')[i]
        var fipe = hnv1.innerHTML
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
        hnv1.innerHTML = fipe
    }
}

window.onload = lat_rub