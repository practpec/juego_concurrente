export function enviarDatosActualizados(datos) {
    // Hacer una solicitud POST a la API para actualizar los datos
    return fetch('/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Datos actualizados con éxito:', data);
    })
    .catch(error => {
        console.error('Error al actualizar los datos:', error);
    });
}

export function obtenerDatosJugador() {
    // Hacer una solicitud GET para obtener los datos del jugador
    return fetch('/api')
        .then(response => response.json())
        .then(data => {
            console.log('Datos obtenidos con éxito:', data);
            return data;
        })
        .catch(error => {
            console.error('Error obteniendo los datos:', error);
            throw error;
        });
}
