import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const rutaArchivo = path.join(process.cwd(), 'data', 'data.json');

    if (req.method === 'POST') {
        // Manejo del POST para actualizar datos
        fs.writeFile(rutaArchivo, JSON.stringify(req.body, null, 2), (err) => {
            if (err) {
                console.error('Error escribiendo el archivo:', err);
                return res.status(500).json({ error: 'Error escribiendo el archivo.' });
            }
            res.status(200).json({ message: 'Datos actualizados correctamente.' });
        });
    } else if (req.method === 'GET') {
        // Manejo del GET para obtener datos
        fs.readFile(rutaArchivo, 'utf8', (err, data) => {
            if (err) {
                console.error('Error leyendo el archivo:', err);
                return res.status(500).json({ error: 'Error leyendo el archivo.' });
            }
            res.status(200).json(JSON.parse(data));
        });
    } else {
        res.status(405).json({ message: 'Método no permitido' });
    }
}
