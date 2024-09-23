// attack.js
onmessage = function(event) {
    if (event.data.atacar) {
        // Aquí podrías agregar lógica adicional si es necesario
        postMessage({ atacar: true, cantidad: event.data.cantidad });
    }
};
