export function setupColliders(scene, player, map, zombies) {
  scene.physics.add.collider(player, map.wallsLayer);
  scene.physics.add.collider(player, map.plantLayer);
  scene.physics.add.collider(player, map.potLayer);
  scene.physics.add.collider(zombies, map.wallsLayer);
  scene.physics.add.collider(zombies, map.plantLayer);
  scene.physics.add.collider(zombies, map.potLayer);
  scene.physics.add.collider(
    zombies,
    player,
    scene.handleZombiePlayerCollision,
    null,
    scene
  );
}

export function handleZombiePlayerCollision(player, zombie, scene) {
  scene.isCollision = true;
  player.setTint(0xff0000);
  if (!player.damageTimer || scene.time.now > player.damageTimer) {
    player.damage(5);
    player.damageTimer = scene.time.now + 250;
  }
}
