function tuc(imgid) {
    var img = document.getElementById(imgid);
    if (img.style.display != 'none') {
        img.style.display = 'none';
    }
    else {
        img.style.display = 'block';
    }
}