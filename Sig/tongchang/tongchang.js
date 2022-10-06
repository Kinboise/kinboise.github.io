var svgmoban = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="128px" height="128px" viewBox="0 0 256 128">
    <defs>
        <style>
            /* 不变区 */
            line {
                fill: none;
                stroke-miterlimit: 10;
                stroke-width: 8px;
            }

            text {
                text-anchor: middle;
                font-family: Cabin, '思源黑体', '思源黑体 CN', 'Source Han Sans', 'Source Han Sans CN', sans-serif;
            }

            .zh {
                font-size: 20px;
                fill: `,`;
                font-family: Bahnschrift, monospace;
            }

            .han {
                font-size: 21px;
                font-weight: 500;
            }

            .lat {
                font-size: 12px;
                font-weight: 600;
            }

            .bj {
                fill: `,`;
            }
            
            .st {
                fill: `,`;
            }

            /* 变化区 */
            text {
                fill: `,`;
            }

            .bz {
                fill: `,`;
            }

            .zx {
                stroke: `,`;
            }

            .yx {
                stroke: `,`;
            }

            .sk {
                fill: `,`;
            }

            .hc1 {
                fill: `,`;`,`
            }

            .hc2 {
                fill: `,`;`,`
            }
        </style>
    </defs>
    <g>
        <rect class="bj" width="128" height="128" />
        <rect class="st" y="116" width="128" height="12" />
    </g>
    <g>
        <line class="zx" x1="0" y1="64" x2="64" y2="64" />
        <line class="yx" x1="64" y1="64" x2="128" y2="64" />
        <rect class="sk" x="40" y="52" width="48" height="24" rx="8.49" /><text class="zh"
            transform="translate(64 71)">`,`</text>
        <rect class="bz" x="10" y="77" width="108" height="35" rx="6" /><text class="han"
            transform="translate(64 95.25)">`,`</text><text class="lat" transform="translate(64 110)">`,`</text>
        <rect class="hc1" x="40" y="27" width="48" height="24" rx="8.49" /><text class="zh"
        transform="translate(64 46)">`,`</text>
        <rect class="hc2" x="40" y="2" width="48" height="24" rx="8.49" /><text class="zh"
        transform="translate(64 21)">`,`</text>
    </g>
</svg>`
]

var zp = []
var dangqianzhan = 0

function xianshi() {
    document.getElementById('tongchang').innerHTML = zp[dangqianzhan]
}

function yulan() {
    // 获取格式
    bj = geshi.beijing.value
    wz = geshi.wenzi.value
    bz = geshi.benzhan.value
    gz = geshi.guozhan.value
    xl = xinxi.xianlu.value
    hc1 = xinxi.huancheng1yanse.value
    hc2 = xinxi.huancheng2yanse.value
    if (xinxi.huancheng1cunzai.checked) {
        var hc1cz = ''
    } else {
        var hc1cz = 'display: none;'
    }
    if (xinxi.huancheng2cunzai.checked) {
        var hc2cz = ''
    } else {
        var hc2cz = 'display: none;'
    }
    // 将信息填入svg
    var tiankong = [
        bj,
        bj,
        xl,
        //站名
        [bj,gz,bj,wz,gz,bj,wz,bj,gz,bj,bj,wz],
        //本站
        [bz,bj,bz,bj,bj,bz,bj,bz,bj,bz,bz,bj],
        //左线
        [xl,gz,xl,xl,gz,bj,bj,bj,bj,gz,gz,xl],
        //右线
        [bj,bj,gz,xl,gz,gz,xl,xl,gz,xl,bj,bj],
        //色块
        [xl,gz,xl,xl,gz,xl,xl,xl,gz,xl,xl,xl],
        //换乘线路
        [hc1,gz,hc1,hc1,gz,hc1,hc1,hc1,gz,hc1,hc1,hc1],
        hc1cz,
        [hc2,gz,hc2,hc2,gz,hc2,hc2,hc2,gz,hc2,hc2,hc2],
        hc2cz,
        xinxi.zhanhao.value,
        xinxi.zhanming.value,
        xinxi.zhanminglat.value,
        xinxi.huancheng1.value,
        xinxi.huancheng2.value,
    ]
    //拼接字符串得到svg
    zp = []
    for (var j=0;j<12;j++) {
        zp.push(svgmoban[0])
        for (var i=0;i<tiankong.length;i++) {
            if (typeof tiankong[i] == 'string') {
                zp[j] += tiankong[i]
            } else {
                zp[j] += tiankong[i][j]
            }
            zp[j] += svgmoban[i+1]
        }
        // if (j<5) {
        //     var tc = document.getElementById('tongchangzuo')
        // } else {
        //     var tc = document.getElementById('tongchangyou')
        // }
        // var neirong = document.createElement('canvas')
        // var gezi = document.createElement('td')
        // neirong.innerHTML = zp[j]
        // gezi.appendChild(neirong)
        // tc.appendChild(gezi)
    }
    xianshi()
    var ylq = document.getElementById('yulanqu')
    ylq.removeAttribute('hidden')
    ylq.scrollIntoView()
}

function xiayizhang()
{
    if (dangqianzhan < 11) {
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

function xiazaidanzhang() {
    svgExport.downloadPng(
        zp[dangqianzhan],
        dangqianzhan,
        {
            width: 128,
            height: 128
        }
    )
}

function xiazaiquanbu() {
    for (i in zp) {
        svgExport.downloadPng(
            zp[i],
            i,
            {
                width: 128,
                height: 128
            }
        )
    }
}

// function xiazaidanzhang() {
//     // 创建临时链接
//     var linshilianjie = document.createElement('a')
//     linshilianjie.download = dangqianzhan + '.svg'
//     // 隐藏链接
//     linshilianjie.style.display = 'none'
//     // 当前站牌转成blob
//     var blob = new Blob([zp[dangqianzhan]])
//     linshilianjie.href = URL.createObjectURL(blob)
//     // 点击链接
//     document.body.appendChild(linshilianjie)
//     linshilianjie.click()
//     // 移除链接
//     document.body.removeChild(linshilianjie)
// }

// function xiazaiquanbu() {
//     // 初始化一个zip打包对象
//     var zip = new JSZip();
//     var svg = zip.folder('svg')
//     for (i in zp) {
//         svg.file('Kinboise' + i + '.svg', zp[i])
//     }
//     // 把打包内容异步转成blob二进制格式
//     zip.generateAsync({type:"blob"}).then(function(content) {
//     saveAs(content, "tongchang.zip");
// });
// }