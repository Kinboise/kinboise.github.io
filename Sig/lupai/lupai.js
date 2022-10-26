const 形状 = {
'十字路口':
`<g id="形状">
    <rect class="白" x="250" y="96" width="12" height="90" />
    <polyline class="白" points="250 96 262 96 256 90" />
    <rect class="白" x="211" y="138" width="90" height="12" />
    <polyline class="白" points="211 150 211 138 205 144" />
    <polyline class="白" points="301 138 301 150 307 144" />
</g>`,

'环岛':
`<g id="形状">
<rect class="白" x="250" y="96" width="12" height="90" />
<polyline class="白" points="250 96 262 96 256 90" />
<rect class="白" x="250" y="99" width="12" height="90" transform="translate(400 -112) rotate(90)" />
<polyline class="白" points="211 150 211 138 205 144" />
<polyline class="白" points="301 138 301 150 307 144" />
<circle class="底TAMO" cx="256" cy="144" r="24" />
<path class="白"
    d="M256,132a12,12,0,1,1-12,12,12,12,0,0,1,12-12m0-12a24,24,0,1,0,24,24,24,24,0,0,0-24-24Z" />
<polygon class="底TAMO" points="256.15 144.43 232.08 160.08 240.5 168.5 256.15 144.43" />
</g>`,

'菱形桥上':
`<g id="形状">
    <polyline class="白" points="244 96 256 96 250 90" />
    <rect class="白" x="273.5" y="122.5" width="12" height="43" transform="translate(423.5 -135.5) rotate(90)" />
    <polyline class="白" points="211 150 211 138 205 144" />
    <polyline class="白" points="301 138 301 150 307 144" />
    <polygon class="白" points="256 186 250 186 244 186 244 96 256 96 256 186" />
    <path class="白"
        d="M256,186h0l.05-12,0,6,0-6c2.81,0,12-1,12-12V141.71h12V162c0,7-2.17,12.69-6.45,17C266.73,185.77,257.3,186,256,186Z" />
    <rect class="白" x="220.5" y="128.5" width="12" height="31" transform="translate(370.5 -82.5) rotate(90)" />
</g>`,

'菱形桥下':
`<g id="形状">
    <rect class="白" x="244" y="96" width="12" height="40" />
    <polyline class="白" points="244 96 256 96 250 90" />
    <rect class="白" x="250" y="99" width="12" height="90" transform="translate(400 -112) rotate(90)" />
    <polyline class="白" points="211 150 211 138 205 144" />
    <polyline class="白" points="301 138 301 150 307 144" />
    <polygon class="白" points="256 186 250 186 244 186 244 152 256 152 256 186" />
    <path class="白"
        d="M256,186h0l.05-12,0,6,0-6c2.81,0,12-1,12-12V141.71h12V162c0,7-2.17,12.69-6.45,17C266.73,185.77,257.3,186,256,186Z" />
</g>`,

'苜蓿桥上':
`<g id="形状">
    <rect class="白" x="240" y="96" width="12" height="90" />
    <polyline class="白" points="240 96 252 96 246 90" />
    <polyline class="白" points="211 150 211 138 205 144" />
    <polyline class="白" points="301 138 301 150 307 144" />
    <path class="白" d="M252,186l-8.76-8.2c6.2-6.64,38.17-39.8,57.78-39.8v12C289.8,150,265,172.08,252,186Z" />
    <path class="白"
        d="M260.53,150H254V138h6.53c5.67,0,8.22-3.39,8.23-6.74,0-3.07-2.15-6.38-8.28-6.43-11.13-.1-14.25,0-14.29,0l-.39-12c.13,0,3.26-.1,14.78,0,13.3.12,20.22,9.39,20.18,18.48S273.62,150,260.53,150Z" />
    <rect class="白" x="211" y="138" width="27" height="12" />
</g>`,

'苜蓿桥下':
`<g id="形状">
    <rect class="白" x="240" y="152" width="12" height="34" />
    <polyline class="白" points="240 96 252 96 246 90" />
    <polyline class="白" points="211 150 211 138 205 144" />
    <polyline class="白" points="301 138 301 150 307 144" />
    <path class="白" d="M252,186l-8.76-8.2c6.2-6.64,38.17-39.8,57.78-39.8v12C289.8,150,265,172.08,252,186Z" />
    <path class="白"
        d="M260.53,150H211V138h49.53c5.67,0,8.22-3.39,8.23-6.74,0-3.07-2.15-6.38-8.28-6.43-11.13-.1-14.25,0-14.29,0l-.39-12c.13,0,3.26-.1,14.78,0,13.3.12,20.22,9.39,20.18,18.48S273.62,150,260.53,150Z" />
    <rect class="白" x="240" y="96" width="12" height="40" />
</g>`,
}

const 隐藏 = '$1 style="display:none"'

const svg模板 =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 256" width="512" height="256">
<defs>
    <style>
        /*自定义区*/
        .路, .口, .白 {
            fill: #ffffff;
        }
        .底TAMO, .点TAMO, .向TAMO {
            fill: #2e3192;
        }
        .汉 {
            font-family: MiSans;
            font-weight: 600
        }
        .拉 {
            font-family: 'IBM Plex Sans Condensed';
            font-weight: 600;
        }
        .拉 .向TAMO {
            font-size: 30px;
            font-family: 'IBM Plex Sans';
            font-weight: 700;
        }
        /*不变区*/
        .口, .向TAMO {
            text-anchor: middle;
        }
        .路 .前, .右 {
            text-anchor: end;
        }
        .点TAMO .前, .左 {
            text-anchor: start;
        }
        .汉 .路, .汉 .向TAMO {
            font-size: 48px;
        }
        .汉 .口 {
            font-size: 38px;
        }
        .汉 .点TAMO {
            font-size: 30px;
        }
        .拉 .路, .拉 .口 {
            font-size: 22px;
        }
        .拉 .点TAMO {
            font-size: 18px;
        }
    </style>
</defs>
<g id="底板">
    <rect class="底TAMO" width="512" height="256" />
    <path class="白"
        d="M502.55,7A2.45,2.45,0,0,1,505,9.45v237.1a2.45,2.45,0,0,1-2.45,2.45H9.45A2.45,2.45,0,0,1,7,246.55V9.45A2.45,2.45,0,0,1,9.45,7h493.1m0-4H9.45A6.45,6.45,0,0,0,3,9.45v237.1A6.45,6.45,0,0,0,9.45,253h493.1a6.45,6.45,0,0,0,6.45-6.45V9.45A6.45,6.45,0,0,0,502.55,3Z" />
    <rect class="白" x="10" y="10" width="84" height="60" />
    <polyline class="底TAMO" points="65 37 75 31.4 85 37 75 15" />
    <rect class="白 点底右" x="339" y="172" width="163" height="51" />
    <rect class="白 点底左" x="10" y="172" width="163" height="51" />
    <rect class="白 点底前" x="339" y="20" width="163" height="51" />
</g>
<g id="形状"></g>
<!--填字区-->
<g class="汉">
    <g class="口">
        <text transform="translate(256 221)">本路口</text>
    </g>
    <g class="路">
        <text class="前" transform="translate(332 56.89)">前路</text>
        <text class="左" transform="translate(8 141.45)">左路</text>
        <text class="右" transform="translate(502 141.78)">右路</text>
    </g>
    <g class="点TAMO">
        <text class="前" id="点前" transform="translate(340 47)">前点</text>
        <text class="左" id="点左" transform="translate(10 199)">左点</text>
        <text class="右" id="点右" transform="translate(502 199)">右点</text>
    </g>
    <g class="向TAMO">
        <text transform="translate(37 56.89)">方向</text>
    </g>
</g>
<g class="拉">
    <g class="口">
        <text transform="translate(256 243.19)">本路口拉</text>
    </g>
    <g class="路">
        <text class="前" transform="translate(330 80.15)">前路拉</text>
        <text class="左" transform="translate(10 165.15)">左路拉</text>
        <text class="右" transform="translate(500 165.15)">右路拉</text>
    </g>
    <g class="点TAMO">
        <text class="前" id="点前" transform="translate(342 66)">前点拉</text>
        <text class="左" id="点左" transform="translate(12 218)">左点拉</text>
        <text class="右" id="点右" transform="translate(500 218)">右点拉</text>
    </g>
    <g class="向TAMO">
        <text transform="translate(74.5 60.19)">方向拉</text>
    </g>
</g>
</svg>`

// const 名牌模板 =
// `
// `

var 结果 = []
var 拉方向 = []

function 单修(选择器, 最长) {
    var 长度 = $(选择器)[0].getBoundingClientRect().width
    if (长度 > 最长) {
        var 倍数 = parseInt(100*最长/长度)/100
        $(选择器).attr('transform', $(选择器).attr('transform')+ 'scale(' + 倍数 + ' 1)')
    }
}
function 全修(单张) {
    $('#预览').html(单张)
    单修('.汉 .口 text', 156)
    单修('.汉 .路 .前 ', 232)
    单修('.汉 .路 .左', 192)
    单修('.汉 .路 .右', 192)
    单修('.拉 .路 .前 ', 230)
    单修('.拉 .路 .左', 205)
    单修('.拉 .路 .右', 200)
    单修('.汉 .点TAMO .前 ', 162)
    单修('.汉 .点TAMO .左', 162)
    单修('.汉 .点TAMO .右', 162)
    单修('.拉 .点TAMO .前 ', 160)
    单修('.拉 .点TAMO .左', 160)
    单修('.拉 .点TAMO .右', 160)
    单张 = $('#预览').html()
    return 单张
}

function 读取() {
    if (格式.方向词.value == '帜和语') {
        拉方向 = ['F', 'R', 'P', 'K']
    }
    if (格式.方向词.value == '英语') {
        拉方向 = ['N', 'E', 'S', 'W']
    }
    if (格式.方向词.value == '自定义') {
        if (格式.自定义词.value.length == 4) {
            拉方向 = 格式.自定义词.value.split('')
        } else {
            拉方向 = ['B', 'D', 'N', 'X']
        }
    }
    var 返回 = {
        '口': 信息.汉路口.value,
        '拉口': 信息.拉路口.value,
        '形': [
            信息.形北.value,
            信息.形东.value,
            信息.形南.value,
            信息.形西.value
        ],
        '路': [
            信息.汉路北.value,
            信息.汉路东.value,
            信息.汉路南.value,
            信息.汉路西.value
        ],
        '拉路': [
            信息.拉路北.value,
            信息.拉路东.value,
            信息.拉路南.value,
            信息.拉路西.value
        ],
        '路类': [
            信息.路北类.value,
            信息.路东类.value,
            信息.路南类.value,
            信息.路西类.value,
        ],
        '点': [
            信息.汉点北.value,
            信息.汉点东.value,
            信息.汉点南.value,
            信息.汉点西.value
        ],
        '拉点': [
            信息.拉点北.value,
            信息.拉点东.value,
            信息.拉点南.value,
            信息.拉点西.value
        ],
        '点类': [
            信息.点北类.value,
            信息.点东类.value,
            信息.点南类.value,
            信息.点西类.value,
        ],
        '背景': 格式.背景.value,
        '前景': 格式.前景.value,
        '方向词': ['北','东','南','西'],
        '拉方向词': 拉方向
    }
    return 返回
}

function 生成() {
    var 信息 = 读取()
    结果 = []
    $('#预览区').removeAttr('hidden')
    for (var i=0;i<4;i++) {
        var 单张 = svg模板

        //路口指路牌
        单张 = 单张.replace('#ffffff', 信息.前景)
        单张 = 单张.replace('#2e3192',信息.背景)
        单张 = 单张.replace('方向',信息.方向词[i])
        单张 = 单张.replace('方向拉',信息.拉方向词[i])

        单张 = 单张.replace('<g id="形状"></g>',形状[信息.形[i]])

        单张 = 单张.replace('本路口',信息.口)
        单张 = 单张.replace('本路口拉',信息.拉口)

        单张 = 单张.replace('前路',信息.路[i])
        单张 = 单张.replace('左路',信息.路[(i+3)%4])
        单张 = 单张.replace('右路',信息.路[(i+1)%4])

        单张 = 单张.replace('前路拉',信息.拉路[i])
        单张 = 单张.replace('左路拉',信息.拉路[(i+3)%4])
        单张 = 单张.replace('右路拉',信息.拉路[(i+1)%4])
        
        单张 = 单张.replace('前点',信息.点[i])
        单张 = 单张.replace('左点',信息.点[(i+3)%4])
        单张 = 单张.replace('右点',信息.点[(i+1)%4])

        if (信息.点[i] == '-') {
            单张 = 单张.replace(/(class="白\s点底前")/g, 隐藏)
        }
        if (信息.点[(i+3)%4] == '-') {
            单张 = 单张.replace(/(class="白\s点底左")/g, 隐藏)
        }
        if (信息.点[(i+1)%4] == '-') {
            单张 = 单张.replace(/(class="白\s点底右")/g, 隐藏)
        }

        if (信息.点类[i] != '一般') {
            单张 = 单张.replace(/(id="点前")/g, '$1 style="fill:' + 格式.前景.value + '" ')
            单张 = 单张.replace(/(class="白\s点底前")/g, '$1 style="fill:' + 格式[信息.点类[i]].value + ';stroke:' + 格式.前景.value + ';stroke-width:3px;rx:1px" ')
        }
        if (信息.点类[(i+3)%4] != '一般') {
            单张 = 单张.replace(/(id="点左")/g, '$1 style="fill:' + 格式.前景.value + '" ')
            单张 = 单张.replace(/(class="白\s点底左")/g, '$1 style="fill:' + 格式[信息.点类[(i+3)%4]].value + ';stroke:' + 格式.前景.value + ';stroke-width:3px;rx:1px" ')
        }
        if (信息.点类[(i+1)%4] != '一般') {
            单张 = 单张.replace(/(id="点右")/g, '$1 style="fill:' + 格式.前景.value + '" ')
            单张 = 单张.replace(/(class="白\s点底右")/g, '$1 style="fill:' + 格式[信息.点类[(i+1)%4]].value + ';stroke:' + 格式.前景.value + ';stroke-width:3px;rx:1px" ')
        }
        
        if (信息.路类[(i+2)%4] == '高速') {
            单张 = 单张.replace(/#2e3192/g, 格式.高速.value)
        }

        单张 = 单张.replace('前点拉',信息.拉点[i])
        单张 = 单张.replace('左点拉',信息.拉点[(i+3)%4])
        单张 = 单张.replace('右点拉',信息.拉点[(i+1)%4])

        //道路名牌
        // 单张 = 单张.replace('名牌方向',信息.方向词[i])
        // 单张 = 单张.replace('名牌方向拉',信息.拉方向词[i])
        // 单张 = 单张.replace('名牌前路',信息.路[i])
        // 单张 = 单张.replace('名牌前路拉',信息.拉路[i])

        单张 = 全修(单张)
        单张 = 单张.replace(/TAMO/g,i)
        结果.push(单张)
    }
    $('#预览').html('<div>' + 结果.join('</div><div>') + '</div>')
}

function 下载全部() {
    for (i in 结果) {
        svgExport.downloadPng(
            结果[i],
            'lk' + 信息.汉路口.value + 拉方向[i],
            {
                width: 512,
                height: 256
            }
        )
    }
}

function 下载全部svg() {
    // 初始化一个zip打包对象
    var zip = new JSZip();
    var svg = zip.folder('svg')
    for (i in zp) {
        svg.file(zm[i] + '.svg', zp[i])
    }
    // 把打包内容异步转成blob二进制格式
    zip.generateAsync({type:"blob"}).then(function(content) {
        saveAs(content, "路牌.zip");
    });
}