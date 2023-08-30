function hx(x) {
    return x.toString(16).toUpperCase().padStart(4, '0');
}

function translateCode() {
    let text = document.getElementById("inputTextarea").value.split("\n");

    // Generate random number
    let base = document.getElementById("baseTextarea").value.split(",");
    let num = 0;
    while (base.includes(hx(num))) {
        num = Math.floor(Math.random() * 0x10000);
    }

    // Update file
    document.getElementById("baseTextarea").value += "," + hx(num);

    let loctext = [];
    let l = 0;

    for (let n = 0; n < text.length; n++) {
        let line = text[n];
        let b = line.match(/^(\s+)- narrate/);
        if (b) {
            let li = ["targets", "from", "format"];
            if (document.getElementById("mode").checked) {
                var ret = b[1] + "- definemap lnar_dat:\n";
                ret += b[1] + "  data: " + hx(num) + "\n";
                ret += b[1] + "  num: " + l + "\n";
                for (let i of li) {
                    let a = line.match(new RegExp(i + ":(\\S+)"));
                    if (a) {
                        line = line.replace(" " + i + ":" + a[1], "");
                        ret += b[1] + "  " + i + ": " + a[1] + "\n";
                    }
                }
                if (line.match(/ per_player/)) {
                    line = line.replace(" per_player", "");
                    ret += b[1] + "  per_player: true\n";
                }
            } else {
                var ret = b[1] + `- define lnar_dat <map[data=${hx(num)};num=${l.toString()}`
                for (let i of li) {
                    let a = line.match(new RegExp(i + ":(\\S+)"));
                    if (a) {
                        line = line.replace(" " + i + ":" + a[1], "");
                        ret += ';' + i + "=" + a[1];
                    }
                }
                if (line.match(/ per_player/)) {
                    line = line.replace(" per_player", "");
                    ret += ";per_player=true";
                }
                ret += ']>\n'
            }
            ret += b[1] + "- inject lnar";
            let msg = line.replace(/^\s+- narrate /, "");
            msg = msg.replace(/^"([^"]+)"$/, "$1");
            loctext.push("    " + l + ":\n        zh: " + msg + "\n        en: " + msg);
            l++;
            text[n] = ret;
        }
    }

    // Write file
    let output = "";
    if (loctext.length != 0) {
        output += "lnar_" + hx(num) + ":\n    type: data\n";
        output += loctext.join("\n") + "\n";
    }
    output += text.join("\n");
    document.getElementById("outputTextarea").value = output;
}

function copy() {
    var copyText = document.getElementById("outputTextarea");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
}