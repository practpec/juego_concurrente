import { Unidad } from '../models/unidad.js';
import { Torre } from '../models/torre.js'; 

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.puntos = []; 
        this.enemigos = []; 
        this.spawnWorker = null; 
        this.vidaTorre = 1000;
        this.vidaTorreE = 1000;
        this.torresPropias = [];
        this.torresEnemigas = [];
    }

    preload() {
        this.loadAssets();
    }

    create() {
        this.setupBackground();
        this.setupTowers();
        this.setupTextStyles();

        this.spawnWorker = new Worker('/js/workers/spawn.js'); 
        this.initSpawnWorker(); 

        this.manaWorker = new Worker('/js/workers/mana.js');
        this.initManaWorker(); 

        this.manaText = this.add.text(1000, 30, `Mana: ${this.mana}`, this.estiloTexto);

        this.setupUnitButtons(); 
    }

    update(time, delta) {
        this.puntos.forEach(punto => punto.update(this.enemigos, this.puntos));
        this.enemigos.forEach(enemigo => enemigo.update(this.enemigos, this.puntos));
    
        if (this.torresPropias.length > 0 && this.torresPropias[0].vida <= 0) {
            this.mostrarMensaje('Has perdido', 'LevelMapScene');
            return;
        }
    
        if (this.torresEnemigas.length > 0 && this.torresEnemigas[0].vida <= 0) {
            this.mostrarMensaje('Has ganado', 'LevelMapScene');
            return; 
        }
    
        this.puntos = this.puntos.filter(punto => punto.sprite.active);
        this.enemigos = this.enemigos.filter(enemigo => enemigo.sprite.active);
    }
    
    
    loadAssets() {
        this.load.image('fondo1', '/images/fondo.jpg');
        this.load.image('imagen2', '/images/torre.png');
        this.load.image('imagen3', '/images/torre_e.png');
        this.cargarImagenesUnidades();
    }
    
    cargarImagenesUnidades() {
        const misUnidades = JSON.parse(localStorage.getItem('unidades'));
    
        if (misUnidades) {
            misUnidades.forEach(unidad => {
                unidad.caminar.forEach((ruta) => {
                    const imagenKey = `${unidad.nombre}_caminar_${ruta.split('/').pop()}`;
                        this.load.image(imagenKey, ruta);
                       
                });
    
                unidad.atacar.forEach((ruta) => {
                    const imagenKey = `${unidad.nombre}_atacar_${ruta.split('/').pop()}`;
                        this.load.image(imagenKey, ruta);
                });
    
                const detenerKey = `${unidad.nombre}_detener`;
                    this.load.image(detenerKey, unidad.imagen);
            });
        }
    }

    
   
    setupBackground() {
        this.add.image(600, 250, 'fondo1').setOrigin(0.5).setDisplaySize(1200, 500);
       
    }

    setupTowers() {
        const torrePropia = new Torre(this, this.vidaTorre, 80, 300, 'imagen2');
        const torreEnemiga = new Torre(this, this.vidaTorreE, 1120, 300, 'imagen3');

        this.torresPropias.push(torrePropia);
        this.torresEnemigas.push(torreEnemiga);
    }

    setupTextStyles() {
        this.estiloTexto = { fontFamily: 'Pixelify Sans', fontSize: '20px', fill: '#000' };
        this.superTitulo = { fontFamily: 'Pixelify Sans', fontSize: '40px', fill: '#000' }; 
    }

    initSpawnWorker() {
        this.add.text(550, 450, 'Retirada', this.superTitulo)
        .setInteractive()
        .on('pointerdown', () => this.scene.start('MenuScene'));
        const nivelDetalles = JSON.parse(localStorage.getItem('nivelDetalles'));
        let index = 0;

        this.spawnWorker.onmessage = (event) => {
            if (event.data === 'spawn') {
                if (index < nivelDetalles.unidades.length) {
                    const unidadData = nivelDetalles.unidades[index];
                    const enemigo = new Unidad(this, 1100, 430, unidadData, true); 
                    this.enemigos.push(enemigo); 
                    enemigo.startMoving(-1); 
                    index++;
                } else {
                    index = 0; 
                }
            }
        };

        this.spawnWorker.postMessage('start'); 
    }

    initManaWorker() {
        this.mana = 0; 
    
        this.manaWorker.onmessage = (event) => {
            this.mana = event.data; 
            this.manaText.setText(`Mana: ${this.mana}`);
            this.actualizarEstadoBotones(); 
        };
    
        this.manaWorker.postMessage('start');
    }
    

    setupUnitButtons() {
        const misUnidades = JSON.parse(localStorage.getItem('misUnidades'));
        
        misUnidades.forEach((unidad, index) => {
            const boton = this.add.text(150 + index * 200, 20, unidad.nombre, this.estiloTexto)
                .setInteractive()
                .on('pointerdown', () => {
                    if (this.mana >= unidad.precio_mana) {
                        this.manaWorker.postMessage('pause');
                        this.addUnit(unidad); 
                        boton.setVisible(false); 
    
                        this.mana -= unidad.precio_mana;
                        this.manaWorker.postMessage(this.mana); 
    
                        setTimeout(() => {
                            boton.setVisible(true);
                        }, unidad.velocidad_enfriamiento * 1000); 
                    }
                });
    
            boton.setOrigin(0.5, 0);
    
            this.add.text(150 + index * 200, 50, `Mana: ${unidad.precio_mana}`, this.estiloTexto)
                .setOrigin(0.5, 0);
    
            this.add.text(150 + index * 200, 70, `Enfriamiento: ${unidad.velocidad_enfriamiento}`, this.estiloTexto)
                .setOrigin(0.5, 0);
    
            unidad.boton = boton;
        });
    
        this.misUnidades = misUnidades; 
    }
    

    actualizarEstadoBotones() {
        this.misUnidades.forEach(unidad => {
            if (this.mana < unidad.precio_mana) {
                unidad.boton.setVisible(false);
            } else {
                unidad.boton.setVisible(true); 
            }
        });
    }
    
    

    addUnit(unidad) {
        const nuevoPunto = new Unidad(this, 100, 430, unidad, false); 
        this.puntos.push(nuevoPunto);
        nuevoPunto.startMoving(1); 
    }

    actualizarDatosJugador() {
    let data = JSON.parse(localStorage.getItem('data'));


    const recompensa = {
        oro: 50,
        experiencia: 10 
    };


    data.jugador.monedas += recompensa.oro;
    data.jugador.experiencia += recompensa.experiencia;

    localStorage.setItem('data', JSON.stringify(data));
}

mostrarMensaje(texto, escenaDestino) {
    const mensaje = this.add.text(600, 250, texto, this.superTitulo).setOrigin(0.5);
    const botonAceptar = this.add.text(600, 300, 'Aceptar', this.estiloTexto)
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            mensaje.destroy();
            botonAceptar.destroy();

            if (texto === 'Has ganado') {
                this.sumarRecompensa(); 
            }

            this.scene.start(escenaDestino);
        });
}


sumarRecompensa() {
    const nivelDetalles = JSON.parse(localStorage.getItem('nivelDetalles'));
    const recompensa = nivelDetalles.recompensa;

    obtenerDatosJugador()
        .then(data => {
            data.jugador.monedas += recompensa.oro;
            data.jugador.experiencia += recompensa.experiencia;

            if (nivelDetalles.unidad_desbloquear !== null) {
                const unidadDesbloquear = {
                    id: nivelDetalles.unidad_desbloquear,
                    nivel_actual: 1 
                };

                const unidadExistente = data.desbloqueados.find(u => u.id === unidadDesbloquear.id);
                if (!unidadExistente) {
                    data.desbloqueados.push(unidadDesbloquear);
                }
            }

            enviarDatosActualizados(data);
        })
        .catch(error => console.error('Error sumando la recompensa:', error));
}







    
}

export default GameScene;

function enviarDatosActualizados(data) {
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

function obtenerDatosJugador() {
    return fetch('http://localhost:3000/data')
        .then(response => response.json())
        .catch(error => {
            console.error('Error obteniendo los datos:', error);
            throw error;
        });
}

