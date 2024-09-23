const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');


const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(bodyParser.json());


app.get('/data', (req, res) => {
    fs.readFile(path.join(__dirname, '/data/data.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo el archivo.');
        }
        res.json(JSON.parse(data));
    });
});


app.post('/data', (req, res) => {
    fs.writeFile(path.join(__dirname, '/data/data.json'), JSON.stringify(req.body, null, 2), (err) => {
        if (err) {
            return res.status(500).send('Error escribiendo el archivo.');
        }
        res.send('Datos actualizados correctamente.');
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



