export class Unidad {
    constructor(scene, x, y, unidadData, esEnemigo = false) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.unidadData = unidadData;
        this.esEnemigo = esEnemigo;
        this.vida = unidadData.vida;
        this.ataque = unidadData.ataque;  
        this.atacando = false; 

        this.cargarAnimaciones();

        this.sprite = this.scene.add.sprite(this.x, this.y, unidadData.caminar[0].split('/').pop())
            .setOrigin(0.5, 1); 

        if (this.esEnemigo) {
            this.sprite.setScale(-1, 1);
        }
        this.sprite.play(`${unidadData.nombre}_caminar_${unidadData.caminar[0].split('/').pop()}`); 

        this.worker = new Worker('/js/workers/caminar.js');
        this.initWorker();

        this.moviendo = false;
        this.direccion = 1;  
    }
    
    cargarAnimaciones() {
        const animKeyCaminar = `${this.unidadData.nombre}_caminar`;
        const animKeyAtacar = `${this.unidadData.nombre}_atacar`;

        if (!this.scene.anims.exists(animKeyCaminar)) {
            this.scene.anims.create({
                key: animKeyCaminar,
                frames: this.unidadData.caminar.map((ruta) => {
                    return { key: `${this.unidadData.nombre}_caminar_${ruta.split('/').pop()}` };
                }),
                frameRate: 10,
                repeat: -1,    
            });
        }

        if (!this.scene.anims.exists(animKeyAtacar)) {
            this.scene.anims.create({
                key: animKeyAtacar,
                frames: this.unidadData.atacar.map((ruta) => {
                    return { key: `${this.unidadData.nombre}_atacar_${ruta.split('/').pop()}` };
                }),
                frameRate: 5,
                repeat: -1    
            });
        }
    }

    initWorker() {
        this.worker.onmessage = (event) => {
            if (event.data.dx !== undefined) {
                this.move(event.data.dx); 
            } else if (event.data.atacar) {
                this.atacarUnidad();  
            }
        };
    }

    move(dx) {
        if (this.moviendo) {
            this.sprite.x += dx * this.direccion;
        }
    }

    startMoving(direccion) {
        this.direccion = direccion;
        this.moviendo = true;
        this.sprite.play(`${this.unidadData.nombre}_caminar`);
        this.worker.postMessage('mover'); 
    }

    stopMoving() {
        this.moviendo = false;
        this.worker.postMessage('detener'); 
    }

    startCombat() {
        this.stopMoving();
        this.sprite.play(`${this.unidadData.nombre}_atacar`);
        this.worker.postMessage('combatir');
        this.atacando = true;
    }

    stopCombat() {
        this.worker.postMessage('detener');
        this.atacando = false;
        this.oponente = null;
        if (this.attackInterval) {
            clearInterval(this.attackInterval); 
            this.attackInterval = null;
        }
    }

    atacarUnidad() {
        if (this.oponente) {
            this.oponente.recibirDano(this.ataque);
            if (this.oponente.vida <= 0) {
                this.oponente.destruir();
                this.oponente = null;
                this.revisarColisionOContinuar();
            }
        }
    }

    atacarTorre(torre) {
        if (!this.atacando) {
            this.atacando = true;
            this.startCombat(); 
            this.attackInterval = setInterval(() => {
                torre.attackWorker.postMessage({ atacar: true, cantidad: this.ataque });
                if (torre.vida <= 0) {
                    clearInterval(this.attackInterval);
                    this.stopCombat();
                }
            }, 1000);
        }
    }
    

    recibirDano(cantidad) {
        this.vida -= cantidad;
        if (this.vida <= 0) {
            this.destruir();
        }
    }

    destruir() {
        this.stopMoving();
        this.sprite.destroy();
        this.stopCombat();
    }

    revisarColisionOContinuar() {
        let hayColision = false;

        if (this.esEnemigo) {
            hayColision = this.checkCollision(this.scene.puntos, false);
        } else {
            hayColision = this.checkCollision(this.scene.enemigos, true);
        }

        if (!hayColision) {
            this.startMoving(this.direccion);
        }
    }

    checkCollision(unidades, esEnemigo) {
        for (const unidad of unidades) {
            if (this !== unidad && this.esEnemigo !== esEnemigo) {
                const distancia = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, unidad.sprite.x, unidad.sprite.y);
                const distanciaMinima = 55;
    
                if (distancia <= distanciaMinima) {
                    this.oponente = unidad; 
                    this.startCombat();
                    return true;
                }
            }
        }
    
        const torres = this.esEnemigo ? this.scene.torresPropias : this.scene.torresEnemigas;
        for (const torre of torres) {
            const distancia = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, torre.sprite.x, torre.sprite.y);
            const distanciaMinima = 175;

            if (distancia <= distanciaMinima) {
                this.atacarTorre(torre);
                return true;
            }
        }
    
        return false;  
    }
    
    

    update(enemigos, misUnidades) {
        if (this.moviendo) {
            if (this.esEnemigo) {
                if (!this.checkCollision(misUnidades, false)) {
                    this.checkCollision(this.scene.torresPropias, false);
                }
            } else {
                if (!this.checkCollision(enemigos, true)) {
                    this.checkCollision(this.scene.torresEnemigas, true);
                }
            }
        }
    
        if (this.direccion === 1 && this.sprite.x >= 1050) { 
            this.stopMoving();
        } else if (this.direccion === -1 && this.sprite.x <= 150) { 
            this.stopMoving();
        }
    }
    
}
