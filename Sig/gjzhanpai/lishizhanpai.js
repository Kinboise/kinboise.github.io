var svgmoban = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 256" width="128" height="256"><style>.bj{fill:`,
    `;}.biaotibj{fill:`,
    `;}.biaoti{text-anchor:middle;font-size:24px;font-family:'Source Han Serif CN';font-weight:900;fill:#fff;}.biaotilat{text-anchor:middle;font-size:11px;font-family:'Zilla Slab';font-weight:600;letter-spacing:0.01em;fill:#fff;}.luhaobj{fill:`,
    `;}.luhao{text-anchor:middle;font-family:Bahnschrift;font-size:16pt;fill:#fff;}.chezhan{font-size:16px;font-family:'kGlowSansSCCompressedBold';font-weight:700;}.zhushi{writing-mode:tb;text-orientation:upright;font-size:9px;font-family:'kGlowSansSCExtendedBook';font-weight:400;text-anchor:middle}.fangxianglat,.fangxiang,.tishi{font-family:Bahnschrift,MiSans;font-weight:500;fill:#fff}.fangxiang{font-size:18px;}.fangxianglat{font-size:9pt;fill:#006837;font-weight:700;font-stretch:semi-condensed;text-anchor:middle}.tishi{font-size:12px;}</style><g id="背景"><rect class="bj" width="128" height="256" /><rect class="biaotibj" width="128" height="57" /><rect class="biaotibj" y="228" width="128" height="28" /></g><g id="线路"><g id="线路1" transform="translate(0 0)"><rect class="luhaobj" x="1.5" y="65" width="34.5" height="28" /><text class="luhao" transform="translate(19.5 86.3)">`,
    `</text><text class="zhushi" transform="translate(42.38 66) scale(1 0.9)">下站</text><text class="chezhan" transform="translate(47.5 74.08)">`,
    `</text><text class="zhushi" transform="translate(42.38 86) scale(1 0.9)">终点</text><text class="chezhan" transform="translate(47.5 94.08)">`,
    `</text></g></g><g id="站名"><text class="fangxiang" transform="translate(2.5 249.01)">`,
    `</text><polygon class="fangxiang" points="31 248 40 252 31 232 22 252 31 248" /><text class="fangxianglat" transform="translate(31 247.6)">`,
    `</text><text class="tishi" transform="translate(41.52 239.43)" xml:space="preserve">`,
    `<tspan x="0" y="13" xml:space="preserve">`,
    `</tspan></text><g id="单行"><text class="biaoti" transform="translate(64 30.48)">`,
    `</text><text class="biaotilat" transform="translate(64 44.21)">`,
    `</text></g></g></svg>`
]

var fxduiying = {
    'zhiheyu': {
        'F': '北',
        'R': '东',
        'P': '南',
        'K': '西'
    },
    'yingyu': {
        'N': '北',
        'E': '东',
        'S': '南',
        'W': '西'
    },
    'zidingyi': {
        'B': '北',
        'D': '东',
        'N': '南',
        'X': '西'
    }
}

var dangqianzhan = 0
var czsl = 0
var zp = []

function zidingyiyuyan() {
    var fxc = xinxi.fangxiangci.value
    if (fxc.length != 4) {
        fxc = 'BDNX'
    }
    fxduiying['zidingyi'] = {}
    fxduiying['zidingyi'][fxc[0]] = '北'
    fxduiying['zidingyi'][fxc[1]] = '东'
    fxduiying['zidingyi'][fxc[2]] = '南'
    fxduiying['zidingyi'][fxc[3]] = '西'
}

function jiexiliebiao() {
    // 获取车站列表
    var czlbh = xinxi.chezhanliebiao.value
    var czlbl = xinxi.chezhanliebiaolat.value
    // 按行切分
    czlbh = czlbh.split('\n')
    czlbl = czlbl.split('\n')
    // 提取方向
    var czfxlb = []
    var czfxlbh = []
    var yuyan = xinxi.yuyan.value
    if (yuyan == 'zidingyi') {
        zidingyiyuyan()
    }
    for (var i in czlbh) {
        czfxlb.push(czlbh[i].slice(-1))
        czfxlbh.push(fxduiying[yuyan][czfxlb[i]])
        czlbh[i] = czlbh[i].slice(0, -1)
    }
    // 返回
    var czlb = [czlbh, czlbl, czfxlbh, czfxlb]
    return czlb
}

function xianshi() {
    document.getElementById('zhanpaiyulan').innerHTML = zp[dangqianzhan]
}

function yulan() {
    // 获取路号
    var lh = xinxi.luhao.value
    // 获取车站列表
    var czlb = jiexiliebiao()
    // 获取底部提示
    var dbts = [xinxi.dibutishi1.value,xinxi.dibutishi2.value]
    // 获取格式
    var ds = geshi.dise.value
    var bts = geshi.biaotise.value
    var lhs = geshi.luhaose.value
    // 将信息填入svg
    czsl = czlb[0].length
    zp = []
    for (var i=0;i<czsl-1;i++) {
        var tiankong = [
            ds,
            bts,
            lhs,
            lh,
            czlb[0][i+1],
            czlb[0][czsl-1],
            czlb[2][i],
            czlb[3][i],
            dbts[0],
            dbts[1],
            czlb[0][i],
            czlb[1][i]
        ]
        var danzhang = svgmoban[0]
        for (var j=0;j<tiankong.length;j++) {
            danzhang = danzhang + tiankong[j]
            danzhang = danzhang + svgmoban[j+1]
        }
        zp.push(danzhang)
    }
    dangqianzhan = 0
    xianshi()
    // document.getElementById('shengcheng').setAttribute('hidden','')
    var ylq = document.getElementById('yulanqu')
    ylq.removeAttribute('hidden')
    ylq.scrollIntoView()
}

function xiayizhang()
{
    if (dangqianzhan < czsl-2) {
        dangqianzhan++
    }
    xianshi()
}
function shangyizhang()
{
    if (dangqianzhan > 0) {
        dangqianzhan--
    }
    xianshi()
}

// function xiazaidanzhang() {
//     // svgExport.downloadSvg(
//     //     zp[dangqianzhan],
//     //     dangqianzhan
//     //     )
//     svgExport.downloadPng(
//         zp[dangqianzhan],
//         dangqianzhan,
//         {
//             width: 128,
//             height: 256
//         }
//     )
// }

function xiazaidanzhang() {
    // 创建临时链接
    var linshilianjie = document.createElement('a')
    linshilianjie.download = dangqianzhan + '.svg'
    // 隐藏链接
    linshilianjie.style.display = 'none'
    // 当前站牌转成blob
    var blob = new Blob([zp[dangqianzhan]])
    linshilianjie.href = URL.createObjectURL(blob)
    // 点击链接
    document.body.appendChild(linshilianjie)
    linshilianjie.click()
    // 移除链接
    document.body.removeChild(linshilianjie)
}

function xiazaiquanbu() {
    // 初始化一个zip打包对象
    var zip = new JSZip();
    var svg = zip.folder('svg')
    for (i in zp) {
        svg.file('Kinboise' + i + '.svg', zp[i])
    }
    // 把打包内容异步转成blob二进制格式
    zip.generateAsync({type:"blob"}).then(function(content) {
    saveAs(content, "zhanpai.zip");
});
}