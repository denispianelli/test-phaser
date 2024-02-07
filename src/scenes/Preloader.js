import { Scene } from 'phaser';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  init() {}

  preload() {
    //  Chargement du chemin pour les assets
    this.load.setPath('assets');

    // Chargement des images pour les tuiles de la carte
    this.load.image('grass', 'tiles/grass.png');
    this.load.image('plant', 'tiles/plant.png');
    this.load.image('props', 'tiles/props.png');
    this.load.image('wall', 'tiles/wall.png');

    // Chargement des données de la carte
    this.load.tilemapTiledJSON('survivor', 'tiles/o-survivor.json');

    // Chargement des sprite pour le raider
    this.load.spritesheet('raiderWalk', 'characters/raider/Walk.png', {
      frameWidth: 128,
      frameHeight: 128,
    });

    this.load.spritesheet('raiderIdle', 'characters/raider/Idle_2.png', {
      frameWidth: 128,
      frameHeight: 128,
    });

    // Chargement des sprite pour le wizard
    this.load.spritesheet('wizardWalk', 'characters/wizard/Walk.png', {
      frameWidth: 128,
      frameHeight: 128,
    });

    this.load.spritesheet('wizardIdle', 'characters/wizard/Idle.png', {
      frameWidth: 128,
      frameHeight: 128,
    });

    this.load.spritesheet('wizardDead', 'characters/wizard/Dead.png', {
      frameWidth: 128,
      frameHeight: 128,
    });

    // Chargement des sprite pour le Zombie
    this.load.spritesheet('zombieWalk', 'enemies/zombie/Walk.png', {
      frameWidth: 96,
      frameHeight: 96,
    });
  }

  create() {
    this.scene.start('Game');
  }
}
