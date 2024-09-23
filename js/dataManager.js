export function enviarDatosActualizados(data) {
    fetch('https://mini-8pv1dxccz-julio-cesars-projects.vercel.app/data', {
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
    return fetch('https://mini-8pv1dxccz-julio-cesars-projects.vercel.app/data')
        .then(response => response.json())
        .catch(error => {
            console.error('Error obteniendo los datos:', error);
            throw error;
        });
}
