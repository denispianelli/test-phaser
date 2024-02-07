import { Scene } from 'phaser';
import { createZombieAnims } from '../anims/EnemyAnims';
import { createWizardAnims } from '../anims/CharacterAnims';
import { Zombie } from '../enemies/Zombie';
import { Map } from '../stages/Map';
import { Wizard } from '../characters/Wizard';
import {
  createRestartButton,
  displayGameOverText,
} from '../utils/gameOverUtils';
import { handlePlayerDeath } from '../utils/gameUtils';
import { setupCamera } from '../utils/cameraUtils';
import {
  handleZombiePlayerCollision,
  setupColliders,
} from '../utils/colliderUtils';

export class Game extends Scene {
  constructor() {
    super('Game');
    this.isCollision = false;
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.map = new Map(this);
  }

  create() {
    this.createAnimations();
    this.createMap();
    this.createPlayer();
    this.createZombies();
    setupColliders(this, this.player, this.map, this.zombies);
    setupCamera(this, this.player);
  }

  update() {
    this.player.update();
    this.zombies.getChildren().forEach((zombie) => {
      zombie.update();
    });

    if (this.player.health <= 0) {
      handlePlayerDeath(this);
    }

    if (!this.isCollision) {
      this.player.clearTint();
    }
    this.isCollision = false;
  }

  createAnimations() {
    createZombieAnims(this.anims);
    createWizardAnims(this.anims);
  }

  createMap() {
    this.map.create();
  }

  createPlayer() {
    this.player = new Wizard(this, 959 / 2, 640 / 2, 'wizardWalk', 300);
    this.add.existing(this.player);
  }

  createZombies() {
    this.zombies = this.physics.add.group({
      classType: Zombie,
    });
    this.zombies.create(256, 128, 'zombie', this.player);
  }

  handleZombiePlayerCollision(player, zombie) {
    handleZombiePlayerCollision(player, zombie, this);
  }

  displayGameOverText() {
    displayGameOverText(this, this.player);
  }

  createRestartButton() {
    createRestartButton(this, this.player);
  }
}
