import { Scene } from 'phaser';
import { createZombieAnims } from '../anims/EnemyAnims';
import { createWizardAnims } from '../anims/CharacterAnims';
import { createWeaponAnims } from '../anims/weaponAnims';
import { Zombie } from '../enemies/Zombie';
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
import { catacombsMap } from '../stages/CatacombsMap';

export class Game extends Scene {
  constructor() {
    super('Game');
    this.isCollision = false;
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.map = new catacombsMap(this);
    this.map.create();
    this.createAnimations();
    this.createPlayer();
    this.createZombies();
    setupColliders(this, this.player, this.map, this.zombies);
    setupCamera(this, this.player);

    // CODE ALEX
    //Spawn Enemy toutes les 5 secondes
    this.spawnEvent = this.time.addEvent({
      delay: 1000,
      callback: this.spawnEnemies,
      callbackScope: this,
      loop: true,
    });
  }

  update(time, delta) {
    // console.log('FPS', this.game.loop.actualFps);

    // const frameRate = 1000 / delta;
    // console.log('FPS', frameRate);

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

    // <ALEX CODE>
    // Nouvelle méthode pour gérer l'attaque automatique éclair
    this.handleAutoAttack(time);
    // </ALEX CODE>
  }

  createAnimations() {
    createZombieAnims(this.anims);
    createWizardAnims(this.anims);
    createWeaponAnims(this.anims);
  }

  createPlayer() {
    this.player = new Wizard(this, 959 / 2, 640 / 2, 'wizardWalk', 300);
    this.add.existing(this.player);
  }

  createZombies() {
    this.zombies = this.physics.add.group({
      classType: Zombie,
    });
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

  // </ALEX CODE>

  // Réglage du spawn d'enemys
  spawnEnemies() {
    const nombreEnnemis = Phaser.Math.Between(1, 5);
    for (let i = 0; i < nombreEnnemis; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);
      if (this.player.health > 0) {
        this.zombies.create(x, y, 'zombie', this.player);
      }
    }
  }

  // Méthode pour régler les dégâts du joueur en jeu
  setPlayerDamage(attack) {
    this.player.attack = attack;
  }

  handleAutoAttack(time) {
    // Trouver l'ennemi le plus proche et sa distance
    let closestEnemy = null;
    let closestDistance = Infinity;

    this.zombies.children.each((zombie) => {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        zombie.x,
        zombie.y
      );
      if (distance < closestDistance) {
        closestDistance = distance;
        closestEnemy = zombie;
      }
    });

    // Attaque si l'ennemi est dans la portée et que le cooldown est passé
    if (
      closestEnemy &&
      closestDistance < 1000 &&
      time > this.player.lastAttackTime + this.player.attackCooldown
    ) {
      this.attackClosestEnemy(closestEnemy);
      this.createProjectile(
        this.player.x,
        this.player.y,
        closestEnemy.x,
        closestEnemy.y
      );
      this.player.lastAttackTime = time;
    }
  }

  //Animation éclair pour attaque Player
  // createLightningEffect(x1, y1, x2, y2) {
  //   let graphics = this.add.graphics({
  //     lineStyle: { width: 2, color: 0xffff00 },
  //   });
  //   graphics.lineBetween(x1, y1, x2, y2);
  //   this.time.delayedCall(100, () => graphics.clear());
  // }

  createProjectile(x1, y1, x2, y2) {
    // Create the projectile sprite at the starting position (x1, y1)
    let projectile = this.physics.add.sprite(x1, y1, 'projectile');


    // Calculate angle between player and enemy
    let angle = Phaser.Math.Angle.Between(x1, y1, x2, y2);

    projectile.rotation = angle;

    // Set velocity of the projectile based on the angle and desired speed
    let speed = 200; // Adjust as needed
    projectile.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

		projectile.setSize(10, 10);

    // Play the projectile animation
    projectile.play('projectile-anim'); // Start playing the animation

    // Set collision detection between the projectile and the enemies
    this.physics.add.overlap(projectile, this.zombies, (projectile, enemy) => {
      // Handle collision between projectile and enemy
      this.handleProjectileCollision(projectile, enemy);
    });

    // Set a timer to destroy the projectile after a certain delay
    this.time.delayedCall(1000, () => {
      projectile.destroy();
    });
  }

  // Handle collision between projectile and enemy
  handleProjectileCollision(projectile, enemy) {
    enemy.setTintFill(0xffffff);
    setTimeout(() => {
      enemy.clearTint(); // Reset tint to normal (white)
    }, 100); // 100 milliseconds
    enemy.takeDamage(this.player.attack);
    projectile.destroy();
  }

  //Attaque auto Player vers Enemy + conditions mort Enemy
  attackClosestEnemy(closestEnemy) {
    // closestEnemy.setTint(0xff0000);
    // closestEnemy.takeDamage(this.player.attack);
    if (closestEnemy.health >= 0) {
      this.createProjectile(
        this.player.x,
        this.player.y,
        closestEnemy.x,
        closestEnemy.y
      );
      this.player.lastAttackTime = this.time.now; // Utilisez this.time.now pour Phaser 3
    }
  }
  // </ALEX CODE>
}
