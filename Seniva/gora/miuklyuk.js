function miuklyuk() {
    for (j of ['f', 'p']) {
        var lat = document.getElementsByClassName(j + 'h2l');
        var pun = document.getElementsByClassName(j + 'h2p');
        var fit = document.getElementsByClassName(j + 'h2f');
        var han = document.getElementsByClassName(j + 'h2h');
        var mllp = document.getElementById(j + 'mllp');
        var mlfh = document.getElementById(j + 'mlfh');
        var jena = document.getElementById('fofibura-su-nito').parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-page-number');
        for (let i = 0; i < lat.length; i++) {
            let jpid = lat[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-page-number');
            let jp = jpid - jena + 1;
            mllp.innerHTML += '<tr><td class="mljp"><a href="#page-' + jpid + '">' + jp + '</a></td><td class="mll">' + 
                lat[i].innerText + '</td><td class="mlp">' + 
                pun[i].innerText + '</td></tr>';

            mlfh.innerHTML += '<tr><td class="mljp"><a href="#page-' + jpid + '">' + jp + '</a></td><td class="mlf">' + fit[i].innerText + '</td><td class="mlh">' + han[i].innerText + '</td></tr>';
        }
        console.log(mllp.innerHTML)
        console.log(mlfh.innerHTML)
    }
}

document.getElementById('soc').onload = miuklyuk();