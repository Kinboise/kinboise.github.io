function 渲染(汉, 拉丁, 特正) {
    var fit = genSvg(特正)
    var wid = parseInt(fit.getAttribute('width'))
    var x = 192 - wid * 0.06
    const svg = fit.childNodes
    var embeds = document.getElementsByTagName('embed')
    for (var i of embeds) {
        var doc = i.getSVGDocument().documentElement
        doc.getElementsByClassName('han')[0].innerHTML = 汉
        doc.getElementsByClassName('lat')[0].innerHTML = 拉丁
        doc.getElementsByClassName('fit')[0].innerHTML = ''
        doc.getElementsByClassName('fit')[0].setAttribute('transform', `translate(${x},10),scale(0.12)`)
        for (var j of svg) {
            doc.getElementsByClassName('fit')[0].appendChild(j.cloneNode(true))
        }
    }
}

function 生成() {
    var 汉 = $('#汉').val()
    var 拉丁 = $('#拉丁').val()
    var 特正 = $('#特正').val()
    渲染(汉, 拉丁, 特正)
}

// function changeDir(d) {
//     if (d == 'KR') {
//         $('#KR').attr('hidden', false)
//         $('#FP').attr('hidden', true)
//     } else {
//         $('#FP').attr('hidden', false)
//         $('#KR').attr('hidden', true)
//     }
// }

function rxsvg(id) {
    for (var i of document.getElementsByClassName(id)) {
        svgExport.downloadSvg(
            i.getSVGDocument().documentElement.outerHTML,
            'rx' + $('#汉').val() + i.getAttribute('src').split('/')[1].replace('.svg',''),
            { width: 384, height: 128 }
        )
    }
}
function rxpng(id) {
    for (var i of document.getElementsByClassName(id)) {
        svgExport.downloadPng(
            i.getSVGDocument().documentElement.outerHTML,
            'rx' + $('#汉').val() + i.getAttribute('src').split('/')[1].replace('.svg',''),
            { width: 384, height: 128 }
        )
    }
}