function jd() {
    var x = Tengx.X.value
    var z = Tengx.Z.value
    svg_y = x * 0.26458334
    svg_x = z * -0.26458334
    var dypc = document.getElementById("g7095")
    dypc.setAttribute("transform", "translate(" + svg_x + "," + svg_y + ")")
    //var wx = window.innerWidth/-2
    //var wy = window.innerHeight/-2
    dypc.scrollIntoView()
    //window.scrollBy(wx, wy)
}

function ck_tuc() {
    layer = document.getElementById("layer14")
    if (Tengx.ck.checked) {
        layer.style = "display:inline"
    } else {
        layer.style = "display:none"
    }
}
function kd_tuc() {
    layer = document.getElementById("layer3")
    if (Tengx.kd.checked) {
        layer.style = "display:inline"
    } else {
        layer.style = "display:none"
    }
}
function kl_tuc() {
    layer = document.getElementById("layer2")
    if (Tengx.kl.checked) {
        layer.style = "display:inline"
    } else {
        layer.style = "display:none"
    }
}
function kt_tuc() {
    layer = document.getElementById("layer6")
    if (Tengx.kt.checked) {
        layer.style = "display:inline"
    } else {
        layer.style = "display:none"
    }
}
function dy_tuc() {
    layer = document.getElementById("layer40")
    if (Tengx.dy.checked) {
        layer.style = "display:inline"
    } else {
        layer.style = "display:none"
    }
}

window.onload = function () {
    var url = location.search
    if (url.indexOf("?") != -1) {
        var str = url.substr(1)
        strs = str.split("&")
        Z = decodeURIComponent(strs[1].split("=")[1].replace("Z=", ""))
        X = decodeURIComponent(strs[0].split("=")[1].replace("X=", ""))
        Tengx.X.setAttribute("value", X)
        Tengx.Z.setAttribute("value", Z)
        Tengx.dy.setAttribute("checked", true)
    }
    dy_tuc()
    jd()
}