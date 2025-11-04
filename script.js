let count = 0;

setInterval(() => {
    document.getElementById("clicker").innerText = count;
    document.getElementById("clicker").style.fontSize = (8 + count/3) + "em";
    document.getElementById("clicker").style.setProperty('--progress', count / 20);
}, 10);

function count_click() {
    count += 1;
    console.log(count);
    setTimeout(() => {
        count -= 1;
    }, 1000);
}