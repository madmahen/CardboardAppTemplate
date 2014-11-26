CardboardAppTemplate
====================

Template project for create native google cardboard app with three.js compatible with Google Cardboard magnet sensor.

## Template

Sample app is in `app/src/main/assets/main.js`.

```JavaScript
(function(window) {
  // Create global variable `app` to access from Java code. This line is required!
  var app = window.app = new CardboardApp();

  var scene = app.scene,
    camera = app.camera,
    renderer = app.renderer;

  initScene(scene);

  app.on('click', function() {
    // Do something on cardboard magnet sensor triggered.
  });

  // Add update callback receiver
  // e.detail is CardboardApp.State object.
  // e.detail.dt is a result of THREE.Clock.getDelta() for each frames.
  app.on('update', function(e) {
    // Do something on every frame update
  });

  function initScene(scene) {
    // put some meshs to scene
  }
})(window);
```

## More informations

* [Google Cardboard library](https://developers.google.com/cardboard/overview)
* [Crosswalk (Embeddable Chromium WebView)](https://crosswalk-project.org/)
