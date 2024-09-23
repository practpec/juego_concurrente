let interval = 7000; 

onmessage = function(e) {
    if (e.data === 'start') {
        spawnEnemies();
    }
}

function spawnEnemies() {
    setInterval(() => {
        postMessage('spawn'); 
    }, interval);
}
