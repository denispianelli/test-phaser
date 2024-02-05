import { Scene } from 'phaser';
import { Enemy } from './Enemy';

export class Game extends Scene {
  constructor() {
    super('Game');
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.map = this.make.tilemap({ key: 'survivor' });
    this.tileset1 = this.map.addTilesetImage('grass', 'grass');
    this.tileset2 = this.map.addTilesetImage('plant', 'plant');
    this.tileset3 = this.map.addTilesetImage('props', 'props');
    this.tileset4 = this.map.addTilesetImage('wall', 'wall');

    this.groundLayer = this.map.createLayer('ground', this.tileset1);
		this.topLayer = this.map.createLayer('top', [this.tileset2, this.tileset3, this.tileset4])

    // Declare raider sprite at the class level
    this.raider = this.physics.add.sprite(959 / 2, 640 / 2, 'raiderWalk');
    this.raider.body.setSize(this.raider.width * 0.3, this.raider.height * 0.5);
    this.raider.body.setOffset(40, 60);

    // Create walk side animation
    this.anims.create({
      key: 'walk-side',
      frames: this.anims.generateFrameNumbers('raiderWalk', {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('raiderIdle', {
        start: 0,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    });

		this.enemy = new Enemy(this, 100, 100, 'enemy', this.raider)

    this.cameras.main.startFollow(this.raider, true);
  }

  update() {
    const speed = 100;
    let velocityX = 0;
    let velocityY = 0;

    this.raider.setVelocity(0, 0);

    if (this.cursors.left.isDown || this.input.keyboard.addKey('A').isDown) {
      velocityX = -speed; // Move left
      this.raider.scaleX = -1; // Flip sprite horizontally
      this.raider.body.offset.x = 80;
    }
    if (this.cursors.right.isDown || this.input.keyboard.addKey('D').isDown) {
      velocityX = speed; // Move right
      this.raider.scaleX = 1; // Reset sprite flip
      this.raider.body.offset.x = 40;
    }
    if (this.cursors.up.isDown || this.input.keyboard.addKey('W').isDown) {
      velocityY = -speed; // Move up
    }
    if (this.cursors.down.isDown || this.input.keyboard.addKey('S').isDown) {
      velocityY = speed; // Move down
    }

    // Handle diagonal movement
    if (
      (this.cursors.left.isDown || this.input.keyboard.addKey('A').isDown) &&
      (this.cursors.up.isDown || this.input.keyboard.addKey('W').isDown)
    ) {
      velocityX *= Math.cos(Math.PI / 4);
      velocityY *= Math.sin(Math.PI / 4);
    }
    if (
      (this.cursors.right.isDown || this.input.keyboard.addKey('D').isDown) &&
      (this.cursors.up.isDown || this.input.keyboard.addKey('W').isDown)
    ) {
      velocityX *= Math.cos(Math.PI / 4);
      velocityY *= Math.sin(Math.PI / 4);
    }
    if (
      (this.cursors.left.isDown || this.input.keyboard.addKey('A').isDown) &&
      (this.cursors.down.isDown || this.input.keyboard.addKey('S').isDown)
    ) {
      velocityX *= Math.cos(Math.PI / 4);
      velocityY *= Math.sin(Math.PI / 4);
    }
    if (
      (this.cursors.right.isDown || this.input.keyboard.addKey('D').isDown) &&
      (this.cursors.down.isDown || this.input.keyboard.addKey('S').isDown)
    ) {
      velocityX *= Math.cos(Math.PI / 4);
      velocityY *= Math.sin(Math.PI / 4);
    }

    // Apply velocity
    this.raider.setVelocity(velocityX, velocityY);

    // Play animation
    if (velocityX !== 0 || velocityY !== 0) {
      this.raider.anims.play('walk-side', true);
    } else {
      this.raider.anims.play('idle', true);
    }

  }
}
