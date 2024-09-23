
let dx = 0; 
let atacar = false;  

onmessage = function(e) {
    if (e.data === 'mover') {
        dx = 2; 
    } else if (e.data === 'detener') {
        dx = 0;
        atacar = false;
    } else if (e.data === 'combatir') {
        atacar = true;
    }
};

setInterval(() => {
    postMessage({ dx });
}, 20);

setInterval(() => {
    if (atacar) {
        postMessage({ atacar: true });
    }
}, 1000);

