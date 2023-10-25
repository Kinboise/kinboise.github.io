window.onload = function() {
    conv()
}

function conv() {
    document.getElementById('fit').innerHTML = ''
    const kage = prepare()
    var lat = document.getElementById('lat').value
    lat = lat.split(/[_\s]/)
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    for (var l in lat) {
        var fit = parseSVG(latToFit(kage, lat[l]))
        var g = fit.firstChild.getElementsByTagName('g')[0]
        g.setAttribute('transform', `translate(${l * 200},0)`)
        svg.appendChild(g)
    }
    svg.setAttribute('height', '200')
    svg.setAttribute('width', lat.length * 200)
    svg.setAttribute('id', 'svg')
    // const svgImg = document.getElementById('fit');
    // console.log(svg.outerHTML)
    // svgImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.outerHTML);
    // console.log(svgImg.outerHTML)

    document.getElementById('fit').appendChild(svg)
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