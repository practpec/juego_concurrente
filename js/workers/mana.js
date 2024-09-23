let mana = 0; 
let isPaused = false;

function contarMana() {
    if (!isPaused) {
        mana += 1; 
        postMessage(mana); 
    }
    setTimeout(contarMana, 100); 
}

onmessage = function(event) {
    if (event.data === 'start') {
        isPaused = false;
        contarMana();
    } else if (event.data === 'pause') {
        isPaused = true;
    } else if (typeof event.data === 'number') {
        mana = event.data; 
        isPaused = false;  
        
    }
};
