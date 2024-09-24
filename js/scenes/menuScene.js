import { enviarDatosActualizados, obtenerDatosJugador } from '../dataManager.js';

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
        this.detailsCard = null;
        this.detailsTexts = []; 
        this.detailsButtons = []; 
    }

    preload() {
        this.loadAssets();
    }

    async create() {
        this.renderBackground();
        this.renderTitulo();
        
        try {
            this.dataLocal = await obtenerDatosJugador();
            this.renderPlayerInfo();
            this.renderUnidadesDesbloqueadas();
            this.renderUnidadesSeleccionadas();
        } catch (error) {
            console.error('Error al cargar los datos del servidor:', error);
        }
    }

    loadAssets() {
        this.load.image('fondo', '/images/campaña.png'); 
    }


    renderBackground() {
        this.add.image(600, 250, 'fondo').setOrigin(0.5);
    }

    renderTitulo() {
        const superTitulo = { fontFamily: 'Pixelify Sans', fontSize: '40px', fill: '#000' };
        this.add.text(600, 20, 'Guerra de Torres', superTitulo).setOrigin(0.5);

        this.add.text(1000, 50, 'Mapa', superTitulo)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('LevelMapScene'));
    }

    renderPlayerInfo() {
        const estiloTitulo = { fontFamily: 'Pixelify Sans', fontSize: '30px', fill: '#000' };
        this.add.text(30, 40, `Nivel Actual: ${this.dataLocal.jugador.nivelActual}`, estiloTitulo);
        this.add.text(30, 70, `Experiencia: ${this.dataLocal.jugador.experiencia}`, estiloTitulo);
        this.add.text(30, 100, `Monedas: ${this.dataLocal.jugador.monedas}`, estiloTitulo);
    }

    renderUnidadesDesbloqueadas() {
        const estiloTitulo = { fontFamily: 'Pixelify Sans', fontSize: '30px', fill: '#000' };
        const estiloTexto = { fontFamily: 'Pixelify Sans', fontSize: '20px', fill: '#000' };
        const offsetY = 30;
        
        this.add.text(370, 80, "Unidades Desbloqueadas", estiloTitulo);
        
        this.dataLocal.desbloqueados.forEach((unidad, index) => {
            const unidadData = this.dataLocal.unidades.find(u => u.id === unidad.id);
            if (unidadData) {
                const cardY = 140 + index * offsetY;

                const detallesButton = this.add.text(800, cardY, 'Detalles', estiloTexto).setInteractive();
                detallesButton.on('pointerup', () => {
                    this.showDetails(unidadData, unidad.nivel_actual);
                });

                this.add.text(370, cardY, `Nombre: ${unidadData.nombre}, Nivel: ${unidad.nivel_actual}`, estiloTexto);
            }
        });
    }

    renderUnidadesSeleccionadas() {
        const estiloTitulo = { fontFamily: 'Pixelify Sans', fontSize: '30px', fill: '#000' };
        const estiloTexto = { fontFamily: 'Pixelify Sans', fontSize: '20px', fill: '#000' };
        const offsetY = 30;
        
        const seleccionadasIds = this.dataLocal.mis_unidades.map(s => s.id);
        const seleccionadas = this.dataLocal.unidades.filter(u => seleccionadasIds.includes(u.id));

        this.add.text(30, 150, "Unidades", estiloTitulo);
        this.add.text(30, 180, "Seleccionadas:", estiloTitulo);
        
        seleccionadas.forEach((unidad, index) => {
            const cardY = 210 + index * offsetY;
            this.add.text(30, cardY, unidad.nombre, estiloTexto);

            const quitarButton = this.add.text(250, cardY, 'Quitar', estiloTexto).setInteractive();
            quitarButton.on('pointerup', () => {
                this.quitarUnidad(unidad.id);
            });
        });
    }


    quitarUnidad(unidadId) {
        this.dataLocal.mis_unidades = this.dataLocal.mis_unidades.filter(s => s.id !== unidadId);
        
        this.dataLocal.mis_unidades = this.dataLocal.mis_unidades.filter(u => u.id !== unidadId);
        
        console.log(`Unidad ${unidadId} quitada.`);
        this.actualizarData(this.dataLocal);
        this.scene.restart();
        window.location.reload();
        
    }
    

    showDetails(unidad, level) {
        if (this.detailsCard) {
            this.clearDetails();
            return;
        }

        this.detailsCard = this.createDetailsCard();
        this.renderDetailsText(unidad);
        this.renderDetailsButtons(unidad, level);
    }

    createDetailsCard() {
        return this.add.rectangle(600, 200, 500, 300, 0xD9C99A)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0x000000);
    }

    renderDetailsText(unidad) {
        const detailsY = 200;
        const estiloDetalles = { fontFamily: 'Pixelify Sans', fontSize: '20px', fill: '#000', backgroundColor: '#D9C99A' };
    
        const nivelActual = this.dataLocal.mis_unidades.find(u => u.id === unidad.id)?.nivel_actual || 1;
    
        const vidaAumentada = Math.floor(unidad.vida * Math.pow(1.1, nivelActual - 1));
        const ataqueAumentado = Math.floor(unidad.ataque * Math.pow(1.1, nivelActual - 1));
        const precioMejoraAumentado = Math.floor(unidad.precio_mejora * Math.pow(1.1, nivelActual - 1));
    
        this.detailsTexts.push(this.add.text(600, detailsY - 120, `${unidad.nombre}`, { ...estiloDetalles, fontSize: '24px' }).setOrigin(0.5));
        this.detailsTexts.push(this.add.text(600, detailsY - 80, `Vida: ${vidaAumentada}`, estiloDetalles).setOrigin(0.5));
        this.detailsTexts.push(this.add.text(600, detailsY - 50, `Ataque: ${ataqueAumentado}`, estiloDetalles).setOrigin(0.5));
        this.detailsTexts.push(this.add.text(600, detailsY - 20, `Velocidad: ${unidad.velocidad}`, estiloDetalles).setOrigin(0.5));
        this.detailsTexts.push(this.add.text(600, detailsY + 10, `Vel. Enfriamiento: ${unidad.velocidad_enfriamiento}`, estiloDetalles).setOrigin(0.5));
        this.detailsTexts.push(this.add.text(600, detailsY + 40, `Precio Mejora: ${precioMejoraAumentado}`, estiloDetalles).setOrigin(0.5));
        this.detailsTexts.push(this.add.text(600, detailsY + 70, `Precio Mana: ${unidad.precio_mana}`, estiloDetalles).setOrigin(0.5));
    }
    
    

    renderDetailsButtons(unidad, level) {
        const detailsY = 200;
        const estiloDetalles = { fontFamily: 'Pixelify Sans', fontSize: '20px', fill: '#000', backgroundColor: '#D9C99A' };
    
        const mejorarButton = this.add.text(400, detailsY + 100, 'Mejorar', estiloDetalles).setInteractive();
        mejorarButton.on('pointerup', () => {
            this.mejorarUnidad(unidad); 
            console.log(`Mejorar unidad: ${unidad.nombre}`); 
        });
        this.detailsButtons.push(mejorarButton);
        
    
        const agregarButton = this.add.text(700, detailsY + 100, 'Agregar', estiloDetalles).setInteractive();
        agregarButton.on('pointerup', () => this.agregarUnidad(unidad, level));
        this.detailsButtons.push(agregarButton);
    
        const closeButton = this.add.text(810, detailsY - 130, 'X', { fontSize: '24px', fill: '#ff0000' }).setInteractive();
        closeButton.on('pointerup', () => this.clearDetails());
        this.detailsButtons.push(closeButton);
    }
    mejorarUnidad(unidad) {
        const unidadSeleccionada = this.dataLocal.desbloqueados.find(s => s.id === unidad.id);
        const unidadDesbloqueada = this.dataLocal.mis_unidades.find(u => u.id === unidad.id);
    
        if (!unidadSeleccionada) {
            console.log('Unidad no encontrada en desbloqueadas.');
            return;
        }

    const costoMejora = Math.floor(unidad.precio_mejora * Math.pow(1.1, unidadDesbloqueada.nivel_actual));

    if (costoMejora > this.dataLocal.jugador.monedas) {
        console.log('No tienes suficientes monedas para mejorar esta unidad.');
        return;
    }
    
        if (unidadDesbloqueada) {
            unidadDesbloqueada.nivel_actual += 1;
            console.log(`Unidad ${unidad.nombre} mejorada. Nivel actual: ${unidadDesbloqueada.nivel_actual}`);
        }
    
        unidadSeleccionada.nivel_actual += 1;
        this.dataLocal.jugador.monedas -= costoMejora
    
        enviarDatosActualizados(this.dataLocal);
    }
    
    agregarUnidad(unidad, level) {
        const seleccionadasIds = this.dataLocal.mis_unidades.map(s => s.id);
        
        if (seleccionadasIds.includes(unidad.id)) {
            console.log(`La unidad ${unidad.nombre} ya está seleccionada.`);
            return;
        }
    
        if (seleccionadasIds.length >= 5) {
            console.log('No puedes seleccionar más de 5 unidades.');
            return;
        }
    
        this.dataLocal.mis_unidades.push({ id: unidad.id, nivel_actual: level });
        console.log(`Agregar unidad: ${unidad.nombre} con nivel ${level}`);
        
        this.actualizarData(this.dataLocal);
    }
    
    clearDetails() {
        this.detailsCard.setVisible(false);
        this.detailsTexts.forEach(text => text.setVisible(false));
        this.detailsButtons.forEach(button => button.setVisible(false));
        this.detailsCard = null;
        this.detailsTexts = [];
        this.detailsButtons = [];
    }

    actualizarData(data) {
        enviarDatosActualizados(data)
            .then(response => {
                console.log('Datos actualizados exitosamente', response);
            })
            .catch(error => {
                console.error('Error al actualizar los datos:', error);
            });
    }
    

    
}

export default MenuScene;
