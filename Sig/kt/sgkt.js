
const tamo = {
    pajne: 8,
    boje: 5,
}
function yangshi(x) {
    var svg = $('#ktd')
    var p = parseInt(svg.attr(x))
    if (p < tamo[x]) {
        svg.attr(x, p+1)
    } else {
        svg.attr(x, 0)
    }
}
function xiazai() {
    var svg = $('#svg').html()
    var riqi = $('.日期').html()
    svgExport.downloadPng(
        svg,
        'kt',
        {
            width: 1024,
            height: 1024
        }
    )
}
window.onload = function () {
    $('#svg').load('kt.svg')
}