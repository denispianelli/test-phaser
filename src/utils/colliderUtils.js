export function setupColliders(scene, player, map, zombies) {
  scene.physics.add.collider(player, map.wallsLayer);
  scene.physics.add.collider(zombies, map.wallsLayer);
	scene.physics.add.collider(zombies, zombies);
	scene.physics.add.collider(
    zombies,
    player,
    scene.handleZombiePlayerCollision,
    null,
    scene
  );
}

export function handleZombiePlayerCollision(player, zombie, scene) {
	// Enregistre l'etat de la collision
  scene.isCollision = true;
	// Change la teinte du perso en rouge
  player.setTintFill(0xff0000);
  if (!player.damageTimer || scene.time.now > player.damageTimer) {
    player.damage(5);
    player.damageTimer = scene.time.now + 250;
  }
}
