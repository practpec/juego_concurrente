onmessage = function(event) {
    if (event.data.atacar) {
        postMessage({ atacar: true, cantidad: event.data.cantidad });
    }
};
