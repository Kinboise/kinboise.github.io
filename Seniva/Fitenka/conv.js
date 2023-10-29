function conv() {
    document.getElementById('fit').innerHTML = ''
    var lat = document.getElementById('lat').value
    document.getElementById('fit').appendChild(genSvg(lat))
}

function genSvg(lat) {
    lat = lat.replace(/(.)([:·-])/g, '$1_$2')
    lat = lat.replace(/([:·-])(.)/g, '$1_$2')
    lat = lat.split(/[_\s]/)
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    var x = 0
    const kage = prepare()
    for (var l in lat) {
        var fit = parseSVG(latToFit(kage, lat[l]))
        var g = fit.firstChild.getElementsByTagName('g')[0]
        g.setAttribute('transform', `translate(${x},0)`)
        g.setAttribute('fill', '')
        x += parseInt(fit.firstChild.getAttribute('width'))
        svg.appendChild(g)
    }
    svg.setAttribute('height', '200')
    svg.setAttribute('width', x)
    svg.setAttribute('id', 'svg')
    return svg
}

function parseSVG(svgString) {
    const parser = new DOMParser();
    return parser.parseFromString(svgString, 'image/svg+xml');
}

function dldsvg() {
    svgExport.downloadSvg(
        document.getElementById('fit').innerHTML,
        'fit'
    )
}
function dldpng() {
    svgExport.downloadPng(
        document.getElementById('fit').innerHTML,
        'fit'
    )
}