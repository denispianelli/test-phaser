import { GameObjects } from 'phaser';

export class Enemy extends GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

  }

  update() {
    // Add any additional update logic here
  }

}
