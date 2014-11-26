/** 
 * Creates cardboard app. Initialize three.js app for you.
 * @class
 * @property {THREE.Scene} scene Default scene. See {@link http://threejs.org/docs/#Reference/Scenes/Scene|THREE.Scene} document.
 * @property {THREE.Camera} camera Default camera. See {@link http://threejs.org/docs/#Reference/Cameras/Camera|THREE.Camera} and {@link http://threejs.org/docs/#Reference/Cameras/PerspectiveCamera|THREE.PerspectiveCamera} documents.
 * @property {THREE.WebGLRenderer} renderer Default renderer. See {@link http://threejs.org/docs/#Reference/Renderers/WebGLRenderer|THREE.WebGLRenderer} document.
 */
function CardboardApp() {
  var app = this,
    renderer = app.renderer = new THREE.WebGLRenderer({
      antialias: true
    }),
    effect = new THREE.StereoEffect(renderer),
    clock = new THREE.Clock(),
    state = new CardboardApp.State();

  app.scene = new THREE.Scene();
  app.camera = new THREE.PerspectiveCamera(90, 1, 0.01, 1000);
  app.vr = true;

  document.body.appendChild(renderer.domElement);

  // Gyro control
  var controls = new THREE.DeviceOrientationControls(app.camera, true);
  controls.connect();

  // Adjust viewport size
  setTimeout(resize, 1);
  window.addEventListener('resize', resize, false);

  // Windows size change handler
  function resize() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    app.camera.aspect = width / height;
    app.camera.updateProjectionMatrix();
    app.vr = (width >= height);

    effect.setSize(width, height);
  }

  // Basic event handlers
  app.on('touchstart', function(e) {
    state.touching = true;
  }).on('touchend', function(e) {
    state.touching = false;
  }).on('mousedown', function(e) {
    state.touching = true;
  }).on('mouseup', function(e) {
    state.touching = false;
  });

  // Start render loop
  (function loop() {
    requestAnimationFrame(loop);

    app.camera.updateProjectionMatrix();
    controls.update();

    // broadcast update
    state.dt = clock.getDelta();
    app.emit('update', {
      detail: state
    });

    // render scene
    (app.vr ? effect : renderer).render(app.scene, app.camera);
  })();
}

CardboardApp.prototype = {
  /**
   * Utility method to addEventListener for rendering canvas.
   * You can receive `update` event for each time frame rendering.
   * @param {string} eventName Name of event.
   * @param {function} listener Listener function that will be called with corresponding `emit`.
   */
  on: function(eventName, listener) {
    this.renderer.domElement.addEventListener(eventName, listener);
    return this;
  },

  /**
   * Utility method to removeEventListener for rendering canvas.
   * @param {string} eventName Name of event.
   * @param {function} listener Listener function that has been added with `on` method.
   */
  off: function(eventName, listener) {
    this.renderer.domElement.removeEventListener(eventName, listener);
    return this;
  },

  /**
   * Utility method to dispatch CustomEvent for rendering canvas.
   * You can use arbitrary `eventName` and receive it with `on` method.
   * @param {string} eventName Name of event.
   * @param {Object} arg (Optional) Object to customize CustomEvent. See {@link https://developer.mozilla.org/en/docs/Web/API/CustomEvent#Constructor|CustomEvent} document.
   */
  emit: function(eventName, arg) {
    var event = new CustomEvent(eventName, arg);
    this.renderer.domElement.dispatchEvent(event);
    return this;
  },

  /**
   * Utility method to call renderer canvas's requestFullscreen. Please call this on user gesture event handler.
   */
  requestFullscreen: function() {
    var elem = this.renderer.domElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  }
};

/**
 * Holds application state. Passed to 'update' event listener's event.detail property.
 * CardboardApp creates this instance automatically. You don't need to call `new CardboardApp.State()`.
 * @class
 * @protected
 * @property {number} dt Delta time from previous frame. This is actually THREE.Clock.getDelta() for each frames.
 * @property {boolean} true if user is touching on screen (with VR kit's button).
 */
CardboardApp.State = function() {
  this.dt = 0;
  this.touching = false;
};
