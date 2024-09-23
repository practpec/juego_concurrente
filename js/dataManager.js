export function enviarDatosActualizados(datos) {
    return fetch('/data', { // Cambia aquí para usar la ruta relativa
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Error en la respuesta de la red: ${response.status} - ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos actualizados con éxito:', data);
        return data;
    })
    .catch(error => {
        console.error('Error al actualizar los datos:', error);
        throw error;
    });
}

export function obtenerDatosJugador() {
    return fetch('/data') // Cambia aquí para usar la ruta relativa
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Error en la respuesta de la red: ${response.status} - ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos obtenidos con éxito:', data);
            return data;
        })
        .catch(error => {
            console.error('Error obteniendo los datos:', error);
            throw error;
        });
}
