(function(window) {
  // Create global variable app to access from Java code.
  var app = window.app = new CardboardApp();

  var scene = app.scene,
    camera = app.camera,
    renderer = app.renderer;

  initScene(scene);

  var walking = false;
  app.on('click', function() {
    walking = !walking;
  });

  // Add update callback receiver
  // e.detail is CardboardApp.State object.
  // e.detail.dt is a result of THREE.Clock.getDelta() for each frames.
  // e.detail.touching is true while user is touching to screen (with VR kit's button).
  app.on('update', function(e) {
    if (walking) {
      var vec = new THREE.Vector3(0, 0, -1);
      vec.applyQuaternion(camera.quaternion);
      vec.y = 0; // now vec is forward vector.

      vec.multiplyScalar(10 * e.detail.dt);
      camera.position.add(vec);
    }
  });

  // And be able to add more callback(s)
  app.on('update', function(e) {
    cube.rotation.y += 0.5 * e.detail.dt;
  });

  function initScene(scene) {
    // init scene with sample contents
    var light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.4);
    scene.add(light);

    var texture = THREE.ImageUtils.loadTexture(
      'textures/patterns/checker.png'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat = new THREE.Vector2(100, 100);
    texture.anisotropy = renderer.getMaxAnisotropy();

    // Create floor
    var floor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1000, 1000),
      new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x666666,
        shininess: 20,
        shading: THREE.FlatShading,
        map: texture
      })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Create cube
    var cube = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshBasicMaterial({
      color: 0xff9900
    }));
    scene.add(cube);

    // Move camera to see a cube
    camera.position.y = 10;
    camera.position.z = -10;
  }
})(window);
