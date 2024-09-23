export class Torre {
    constructor(scene, vida, x, y, spriteKey) {
        this.scene = scene; 
        this.vida = vida;
        this.sprite = this.scene.add.image(x, y, spriteKey).setOrigin(0.5).setDisplaySize(150, 300);
        this.vidaTexto = this.scene.add.text(x, y - 50, `Vida: ${this.vida}`, { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
        
        this.attackWorker = new Worker('/js/workers/atacar.js');
        this.initAttackWorker();
    }

    initAttackWorker() {
        this.attackWorker.onmessage = (event) => {
            if (event.data.atacar) {
                this.recibirDano(event.data.cantidad);
            }
        };
    }

    recibirDano(cantidad) {
        this.vida -= cantidad;
        console.log(this.vida);
        this.vidaTexto.setText(`Vida: ${this.vida}`);
        if (this.vida <= 0) {
            this.destruir();
        }
    }
    
    destruir() {
        this.sprite.destroy();
        this.vidaTexto.destroy();
        console.log('Torre destruida');
        this.attackWorker.terminate();
    }
    
}
