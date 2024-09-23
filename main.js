
import MenuScene from './js/scenes/menuScene.js';
import LevelMapScene from './js/scenes/levelMapScene.js';
import GameScene from './js/scenes/gameScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 500,
    backgroundColor: '#1d1d1d',
    scene: [ MenuScene, LevelMapScene, GameScene]
};

const juego = new Phaser.Game(config);
