( () => {
    const e = document.querySelector("header .text-slider ul");
    e.innerHTML += e.firstElementChild.outerHTML;
    let t = 0;
    setInterval((function n() {
        document.hidden || (t++,
        t >= e.childElementCount && (t = 0),
        e.classList.toggle("no-animate", 0 === t),
        e.style.transform = `translateY(-${1.5 * t}em)`,
        0 === t && setTimeout(n, 10))
    }
    ), 3500)
}
)(),
( () => {
    const e = document.body.parentElement.classList;
    document.querySelector("header .profile .sunglasses").addEventListener("click", ( () => {
        if (e.contains("dark-theme") || e.contains("light-theme"))
            e.toggle("dark-theme"),
            e.toggle("light-theme");
        else {
            const t = window.matchMedia("(prefers-color-scheme: dark)").matches;
            e.toggle("dark-theme", !t),
            e.toggle("light-theme", t)
        }
    }
    ))
}
)();
