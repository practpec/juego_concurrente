class LevelMapScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelMapScene' });
        this.nivelData = null; 
    }

    preload() {
        this.load.image('fondo', '/images/campaña.png'); 
        this.load.json('data', '/data/data.json');
    }

    create() {
        this.add.image(600, 250, 'fondo').setOrigin(0.5);

        const estiloTexto = { fontFamily: 'Pixelify Sans', fontSize: '20px', fill: '#000' }; 
        const estiloTitulo = { fontFamily: 'Pixelify Sans', fontSize: '30px', fill: '#000' }; 
        const superTitulo = { fontFamily: 'Pixelify Sans', fontSize: '40px', fill: '#000' }; 

        this.add.text(500, 20, 'Mapa de Niveles', superTitulo);

        this.add.text(20, 20, 'Menu Principal', estiloTitulo)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('MenuScene'));

        
        this.nivelData = this.cache.json.get('data');

        const niveles = 20;
        const camino = [];

        const inicioX = 50;
        const centroY = 250;
        const radioCirculo = 20; 
        const separacion = 55;
        const amplitudOndulada = 100;
        const frecuencia = 1; 

        for (let i = 0; i < niveles; i++) {
            const offsetY = Math.sin(i / frecuencia) * amplitudOndulada;
            const posX = inicioX + i * separacion;
            const posY = centroY + offsetY;

            const circle = this.add.circle(posX, posY, radioCirculo, 0xBFAC88)
                .setStrokeStyle(3, 0x000000)
                .setInteractive();

            this.add.text(posX - 10, posY - 10, (i + 1).toString(), estiloTexto);

            circle.on('pointerdown', () => {
                this.seleccionarNivel(i + 1);
            });

            camino.push({ x: posX, y: posY });
        }
    }

    seleccionarNivel(nivelSeleccionado) {
        const nivelDetalles = this.getDetallesNivel(nivelSeleccionado);
        const unidadesConEstadisticas = this.getMisUnidadesConEstadisticas();
    
        
        localStorage.setItem('nivelDetalles', JSON.stringify(nivelDetalles));
        localStorage.setItem('misUnidades', JSON.stringify(unidadesConEstadisticas));
        localStorage.setItem('unidades', JSON.stringify(this.nivelData.unidades));
    
        this.scene.start('GameScene');
    }    

    getDetallesNivel(nivelSeleccionado) {
        
        const nivel = this.nivelData.niveles.find(n => n.nivel === nivelSeleccionado);
    
        
        const detallesUnidades = this.nivelData.unidades;
    
        
        const unidadesConDetalles = nivel.unidades.map(unidad => {
            const unidadBase = detallesUnidades.find(u => u.id === unidad.id);
            const estadisticasModificadas = this.calcularEstadisticas(unidadBase, unidad.nivel_unidad);
            
            return {
                ...unidadBase,
                ...estadisticasModificadas
            };
        });
    
        return {
            ...nivel,
            unidades: unidadesConDetalles 
        };
    }
    
    
    getMisUnidadesConEstadisticas() {
        const misUnidades = this.nivelData.mis_unidades;
        const detallesUnidades = this.nivelData.unidades;
    
        
        return misUnidades.map(unidad => {
            const unidadBase = detallesUnidades.find(u => u.id === unidad.id);
            const estadisticasModificadas = this.calcularEstadisticas(unidadBase, unidad.nivel_actual);
            return {
                ...unidadBase,
                ...estadisticasModificadas
            };
        });
    }
    
    getUnidadesDelNivelConEstadisticas(nivelSeleccionado) {
        const detallesNivel = this.getDetallesNivel(nivelSeleccionado);
        const detallesUnidades = this.nivelData.unidades;
    
        
        const unidadesDelNivel = detallesNivel.unidades.map(unidad => {
            const unidadBase = detallesUnidades.find(u => u.id === unidad.id);
            const estadisticasModificadas = this.calcularEstadisticas(unidadBase, unidad.nivel_unidad);
            return {
                id: unidadBase.id,
                nombre: unidadBase.nombre,
                vida: estadisticasModificadas.vida,
                ataque: estadisticasModificadas.ataque,
                velocidad: unidadBase.velocidad,
                velocidad_enfriamiento: unidadBase.velocidad_enfriamiento,
                precio_mejora: estadisticasModificadas.precio_mejora,
                precio_mana: unidadBase.precio_mana,
                nivel_base: unidadBase.nivel_base,
                imagen: unidadBase.imagen,
                caminar: unidadBase.caminar,
                atacar: unidadBase.atacar
            };
        });
    
        return {
            nivelDetalles: {
                algorit: detallesNivel.algorit,
                nivel: detallesNivel.nivel,
                recompensa: detallesNivel.recompensa,
                unidad_desbloquear: detallesNivel.unidad_desbloquear,
                unidades: unidadesDelNivel
            },
            misUnidades: this.getMisUnidadesConEstadisticas() 
        };
    }
    
    calcularEstadisticas(unidadBase, nivel) {
        const factor = 0.10;
        return {
            vida: Math.floor(unidadBase.vida * (1 + factor * (nivel - 1))),
            ataque: Math.floor(unidadBase.ataque * (1 + factor * (nivel - 1))),
            precio_mejora: Math.floor(unidadBase.precio_mejora * (1 + factor * (nivel - 1)))
        };
    }
    
       
}

export default LevelMapScene;
