export function enviarDatosActualizados(data) {
    fetch('http://localhost:3000/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(result => {
        console.log('Datos actualizados correctamente:', result);
    })
    .catch(error => {
        console.error('Error enviando los datos al servidor:', error);
    });
}

export  function obtenerDatosJugador() {
    return fetch('http://localhost:3000/data')
        .then(response => response.json())
        .catch(error => {
            console.error('Error obteniendo los datos:', error);
            throw error;
        });
}
