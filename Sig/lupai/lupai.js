const svg模板 =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 256" width="512" height="256">
<defs>
    <style>
        /*自定义区*/
        .路, .口, .白 {
            fill: #ffffff;
        }
        .底, .点, .向 {
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
        .拉 .向 {
            font-size: 30px;
            font-family: 'IBM Plex Sans';
            font-weight: 700;
        }
        /*不变区*/
        .口, .向 {
            text-anchor: middle;
        }
        .路 .前, .右 {
            text-anchor: end;
        }
        .点 .前, .左 {
            text-anchor: start;
        }
        .汉 .路, .汉 .向 {
            font-size: 48px;
        }
        .汉 .口 {
            font-size: 38px;
        }
        .汉 .点 {
            font-size: 30px;
        }
        .拉 .路 {
            font-size: 22px;
        }
    </style>
</defs>
<g id="底板">
    <rect class="底" width="512" height="256" />
    <path class="白"
        d="M502.55,7A2.45,2.45,0,0,1,505,9.45v237.1a2.45,2.45,0,0,1-2.45,2.45H9.45A2.45,2.45,0,0,1,7,246.55V9.45A2.45,2.45,0,0,1,9.45,7h493.1m0-4H9.45A6.45,6.45,0,0,0,3,9.45v237.1A6.45,6.45,0,0,0,9.45,253h493.1a6.45,6.45,0,0,0,6.45-6.45V9.45A6.45,6.45,0,0,0,502.55,3Z" />
    <rect class="白" x="10" y="10" width="84" height="60" />
    <polyline class="底" points="65 37 75 31.4 85 37 75 15" />
</g>
<g id="形状">
    <rect class="白" x="250" y="96" width="12" height="90" />
    <polyline class="白" points="250 96 262 96 256 90" />
    <rect class="白" x="211" y="138" width="90" height="12" />
    <polyline class="白" points="211 150 211 138 205 144" />
    <polyline class="白" points="301 138 301 150 307 144" />
    <rect class="白" x="339" y="172" width="163" height="51" />
    <rect class="白" x="10" y="172" width="163" height="51" />
    <rect class="白" x="339" y="20" width="163" height="51" />
</g>
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
    <g class="点">
        <text class="前" transform="translate(340 47)">前点</text>
        <text class="左" transform="translate(10 199)">左点</text>
        <text class="右" transform="translate(502 199)">右点</text>
    </g>
    <g class="向">
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
    <g class="点">
        <text class="前" transform="translate(342 66)">前点拉</text>
        <text class="左" transform="translate(12 218)">左点拉</text>
        <text class="右" transform="translate(500 218)">右点拉</text>
    </g>
    <g class="向">
        <text transform="translate(74.5 60.19)">方向拉</text>
    </g>
</g>
</svg>`

var 结果 = []
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
    单修('.拉 .路 .右', 205)
    单修('.汉 .点 .前 ', 162)
    单修('.汉 .点 .左', 162)
    单修('.汉 .点 .右', 162)
    单修('.拉 .点 .前 ', 160)
    单修('.拉 .点 .左', 160)
    单修('.拉 .点 .右', 160)
    单张 = $('#预览').html()
    return 单张
}

function 读取() {
    if (格式.方向词.value == '帜和语') {
        var 拉方向 = ['F', 'R', 'P', 'K']
    }
    if (格式.方向词.value == '英语') {
        var 拉方向 = ['N', 'E', 'S', 'W']
    }
    if (格式.方向词.value == '自定义') {
        if (格式.自定义词.value.length == 4) {
            var 拉方向 = 格式.自定义词.value.split('')
        } else {
            var 拉方向 = ['B', 'D', 'N', 'X']
        }
    }
    var 返回 = {
        '口': 信息.汉路口.value,
        '拉口': 信息.拉路口.value,
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
        var 单张 = '<div>' + svg模板 + '</div>'

        单张 = 单张.replace('#ffffff', 信息.前景)
        单张 = 单张.replace('#2e3192',信息.背景)
        单张 = 单张.replace('方向',信息.方向词[i])
        单张 = 单张.replace('方向拉',信息.拉方向词[i])

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

        单张 = 单张.replace('前点拉',信息.拉点[i])
        单张 = 单张.replace('左点拉',信息.拉点[(i+3)%4])
        单张 = 单张.replace('右点拉',信息.拉点[(i+1)%4])

        单张 = 全修(单张)
        结果.push(单张)
    }
    $('#预览').html(结果.join(''))
}