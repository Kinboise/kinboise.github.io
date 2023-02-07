// var scale = 1

// function sc(sca) {
//     scale += sca * 0.1
//     var w = $("svg").attr("width")
//     var h = $("svg").attr("height")
//     w *= scale
//     h *= scale
//     $("svg").attr("width", w)
//     $("svg").attr("height", h)
// }
function zp(event) {
    var x = event.offsetX - 1536
    var z = event.offsetY - 3072
    
    // alert('X:' + x + "  Z:" + z)
    var dypc = document.getElementById("定位")
    dypc.setAttribute("transform", "translate(" + x + "," + z + ")")

    if (z > -1576 && z <= 3072) {
        document.getElementById("sig").checked = true
    }
    if (z > 3072) {
        document.getElementById("xef").checked = true
    }
    if (z <= -1500) {
        document.getElementById("sik").checked = true
        z += 2048
    }

    Tengx.X.value = x
    Tengx.Z.value = z
  }
function jd() {
    var x = Tengx.X.value
    var z = Tengx.Z.value
    var zmin = -1500
    var zmax = 7680

    if (Tengx.chengshi.value == 'sik') {
        z -= 2048
        zmin = -3048
        zmax = -1500
    }
    if (x < -1536 || x > 2048 || z < zmin || z > zmax) {
        document.getElementById("wuxiao").setAttribute("style", "display:inline")
    } else {
        document.getElementById("wuxiao").setAttribute("style", "display:none")
        var dypc = document.getElementById("定位")
        dypc.setAttribute("transform", "translate(" + x + "," + z + ")")
        dypc.scrollIntoView({block:"center"})
    }
}

function ck_tuc() {
    layer = document.getElementById("公交")
    if (Tengx.ck.checked) {
        layer.style = "display:inline"
    } else {
        layer.style = "display:none"
    }
}
function kd_tuc() {
    layer = document.getElementById("建筑")
    if (Tengx.kd.checked) {
        layer.style = "display:inline"
    } else {
        layer.style = "display:none"
    }
}
function kl_tuc() {
    layer = document.getElementById("公路")
    if (Tengx.kl.checked) {
        layer.style = "display:inline"
    } else {
        layer.style = "display:none"
    }
}
function kt_tuc() {
    layer = document.getElementById("矿铁")
    if (Tengx.kt.checked) {
        layer.style = "display:inline"
    } else {
        layer.style = "display:none"
    }
}
function dy_tuc() {
    layer = document.getElementById("定位")
    if (Tengx.dy.checked) {
        layer.style = "display:inline"
    } else {
        layer.style = "display:none"
    }
}

function pc() {
    var x = Tengx.X.value
    var z = Tengx.Z.value
    if (x == "" || z == "") {
        var lc = "https://guc1010.top/sgdd.html"
    } else if (Tengx.chengshi.value == 'sik') {
        var lc = "https://guc1010.top/sgdd.html?X=" + x + "&Z=" + z + "&W=sik"
    }
    navigator.clipboard.writeText(lc).then(function() {
        alert("复制成功！")
      }, function() {
        alert("复制失败！")
      })
}

window.onload = function () {
    var dypc = document.getElementById("定位")
    dypc.scrollIntoView({block:"center"})
    var url = location.search
    if (url.indexOf("?") != -1) {
        var str = url.substring(1)
        var strs = str.split("&")
        var z = decodeURIComponent(strs[1].split("=")[1].replace("Z=", ""))
        var x = decodeURIComponent(strs[0].split("=")[1].replace("X=", ""))
        if (strs.length == 3) {
            var w = decodeURIComponent(strs[2].split("=")[1].replace("W=", ""))
        }
        Tengx.X.value = x
        Tengx.Z.value = z
        if (w == "sik") {
            document.getElementById("sik").checked = true
        }
        Tengx.dy.setAttribute("checked", true)
    }
    dy_tuc()
    jd()
}